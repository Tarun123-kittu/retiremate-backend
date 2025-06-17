const XLSX = require('xlsx');
const path = require('path');
const FinancialAdvisor = require('../models/financial-advisors.model');
const FinancialReferenceModel = require('../models/financial-reference.model');

const csv = require('csv-parser');
const fs = require('fs');
const ZipCodeLocation = require('../models/zipcode-locations.mode');
const StateLifestyle = require('../models/retirementLifestylecost.model');
const SurveyRangeValue = require('../models/survey-range.model');


exports.uploadFinancialAdvisorData = async (filePath, fileNo) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const details = jsonData.map(row => ({
      primary_business_name: row['Primary Business Name'],
      main_office_city: row['Main Office City'],
      main_office_state: row['Main Office State'],
    }));

    await FinancialAdvisor.deleteOne({ financial_Advisor_file_no: fileNo });

    await FinancialAdvisor.create({
      financial_Advisor_file_no: fileNo,
      details
    });
  } catch (error) {
    console.error('Error in upload financial advisors function:', error);
    throw new Error(error.message || 'Failed to upload financial advisor file details');
  }
};


exports.getFinancialAdvisors = async (fileNumber, page = 1, limit = 3) => {
  try {
    const skip = (page - 1) * limit;

    const financialAdvisors = await FinancialAdvisor.aggregate([
      { $match: { financial_Advisor_file_no: fileNumber } },
      { $unwind: "$details" },
      { $skip: skip },
      { $limit: limit },
      { $replaceRoot: { newRoot: "$details" } }
    ]);

    const totalCountAgg = await FinancialAdvisor.aggregate([
      { $match: { financial_Advisor_file_no: fileNumber } },
      { $project: { total: { $size: "$details" } } }
    ]);

    const total = totalCountAgg[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      financialAdvisors,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit
      }
    };

  } catch (error) {
    console.error('Error in upload financial advisors function:', error);
    throw new Error(error.message || 'Failed to upload financial advisor file details');
  }
}



exports.processFinancialReferenceExcel = async (rows) => {
  const dataToInsert = { document: 'financial_reference' };

  for (const row of rows) {
    const field = row['Fields']?.trim();
    const value = row['Value'];

    if (field && typeof value !== 'undefined') {
      dataToInsert[field] = Number(value);
    }
  }

  await FinancialReferenceModel.deleteMany({ document: 'financial_reference' });

  await FinancialReferenceModel.create(dataToInsert);
};

const getValueForCalculation = async (questionText, inputValue) => {
  const range = await SurveyRangeValue.findOne({
    questionText,
    min: { $lte: inputValue },
    max: { $gte: inputValue }
  });

  return range ? range.valueForCalculation : null;
};


exports.calculateRetirementProjection = async (userAnswers) => {
  try {
    const financialReferences = await FinancialReferenceModel.findOne({ document: "financial_reference" });

    if (!financialReferences) {
      throw new Error("Financial reference data not found in the database.");
    }

    const retirementAge = financialReferences.retirement_age;
    const SVGGRATE = financialReferences.saving_growth_rate_percent / 100;
    const SALGRATE = financialReferences.salary_growth_rate_percent / 100;
    const SAVERATE = financialReferences.annual_saving_rate_percent / 100;


    const currentAge = await getValueForCalculation("How old are you?", userAnswers["How old are you?"]);
    const currentSalary = await getValueForCalculation("How much do you make in a year ?", userAnswers["How much do you make in a year ?"]);
    const currentSavings = await getValueForCalculation("How much have you saved for retirement so far?", userAnswers["How much have you saved for retirement so far?"]);


    if (currentAge === null || currentSalary === null || currentSavings === null) {
      throw new Error("Missing or invalid inputs for age, salary, or savings.");
    }

    const n = retirementAge - currentAge;

    if (n <= 0) {
      throw new Error("Current age must be less than retirement age.");
    }

    const futureSavings = currentSavings * Math.pow(1 + SVGGRATE, n);

    let futureContributions = 0;
    for (let t = 0; t < n; t++) {
      const salaryAtT = currentSalary * Math.pow(1 + SALGRATE, t);
      const contribution = salaryAtT * SAVERATE;
      const growth = Math.pow(1 + SVGGRATE, n - t - 1);
      futureContributions += contribution * growth;
    }

    const totalRetirementValue = Math.round(futureSavings + futureContributions);

    console.log({
      retirementAge,
      currentAge,
      n,
      currentSalary,
      currentSavings,
      SVGGRATE,
      SALGRATE,
      SAVERATE,
      futureSavings: futureSavings.toFixed(2),
      futureContributions: futureContributions.toFixed(2),
      totalRetirementValue
    });
    return {
      currentAge,
      currentSalary,
      currentSavings,
      projectedRetirementValue: totalRetirementValue
    };
  } catch (error) {
    console.error("Error calculating retirement projection:", error.message);
    throw new Error(`Retirement projection calculation failed: ${error.message}`);
  }
};



exports.parseAndInsertZipCodes = async (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        results.push({
          zipCode: Number(row['Zip Code']),
          placeName: row['Place Name'],
          state: row['State'],
          stateAbbreviation: row['State Abbreviation'],
          county: row['County'],
          latitude: parseFloat(row['Latitude']),
          longitude: parseFloat(row['Longitude']),
        });
      })
      .on('end', async () => {
        try {
          await ZipCodeLocation.deleteMany()
          await ZipCodeLocation.insertMany(results);
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', reject);
  });
};


exports.processLifestyleExcelRows = async (rows) => {
  const formattedData = rows.map(row => {
    return {
      state: row.State,
      budget: {
        min: parseCurrency(row.BudgetMin),
        max: parseCurrency(row.BudgetMax),
        mean: parseCurrency(row.BudgetMean),
      },
      comfort: {
        min: parseCurrency(row.ComfortMin),
        max: parseCurrency(row.ComfortMax),
        mean: parseCurrency(row.ComfortMean),
      },
      luxury: {
        min: parseCurrency(row.LuxuryMin),
        max: parseCurrency(row.LuxuryMax),
        mean: parseCurrency(row.LuxuryMean),
      },
      medianLifestyle: parseCurrency(row.MedianLifestyle)
    };
  });


  await StateLifestyle.deleteMany({});
  return await StateLifestyle.insertMany(formattedData);
};

const parseCurrency = (str) => {
  if (!str) return null;
  return parseFloat(str.toString().replace(/[$,]/g, '')) || null;
};


exports.calculateComfortMean = async (zipcode) => {
  try {
    if (!zipcode) {
      throw new Error("No zip code received.");
    }

    const zipCodeDoc = await ZipCodeLocation.findOne({ zipCode: zipcode });
    if (!zipCodeDoc) {
      throw new Error(`Zip code ${zipcode} not found in database.`);
    }

    const lifestyle = await StateLifestyle.findOne({ state: zipCodeDoc.state });
    if (!lifestyle || !lifestyle.comfort || typeof lifestyle.comfort.mean !== 'number') {
      throw new Error(`Lifestyle data for state '${zipCodeDoc.state}' is incomplete or missing.`);
    }

    return lifestyle.comfort.mean;

  } catch (error) {
    throw new Error(`Error in calculateComfortMean: ${error.message}`);
  }
};



exports.getLifestyleDetails = async (zipcode) => {
  try {
    if (!zipcode) {
      throw new Error("No zip code received.");
    }

    const zipCodeDoc = await ZipCodeLocation.findOne({ zipCode: zipcode });
    if (!zipCodeDoc) {
      throw new Error(`Zip code ${zipcode} not found in database.`);
    }

    const lifestyle = await StateLifestyle.findOne({ state: zipCodeDoc.state });
    if (!lifestyle) {
      throw new Error(`Lifestyle data for state '${zipCodeDoc.state}' not found.`);
    }

    return lifestyle;

  } catch (error) {
    throw new Error(`Error in getLifestyleDetails: ${error.message}`);
  }
};



exports.processSurveyRangeExcel = async (file, uploadDir) => {
  const uploadPath = path.join(uploadDir, file.name);
  await file.mv(uploadPath);

  const workbook = XLSX.readFile(uploadPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  const dataToInsert = rows.map(row => ({
    questionText: row.Question,
    min: parseFloat(row.Min === 'Infinity' ? Infinity : row.Min || 0),
    max: parseFloat(row.max === 'Infinity' ? Infinity : row.max || 0),
    valueForCalculation: Number(row['Calculation Value'])
  }));

  await SurveyRangeValue.deleteMany({});
  await SurveyRangeValue.insertMany(dataToInsert);

  fs.unlinkSync(uploadPath);
};







