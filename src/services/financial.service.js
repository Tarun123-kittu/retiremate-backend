const XLSX = require('xlsx');
const FinancialAdvisor = require('../models/financial-advisors.model');
const FinancialReferenceModel = require('../models/financial-reference.model')

const { getValueForCalculation } = require('../utils/surveyRange.util');
const csv = require('csv-parser');
const fs = require('fs');
const ZipCodeLocation = require('../models/zipcode-locations.mode');
const StateLifestyle = require('../models/retirementLifestylecost.model');


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




exports.calculateRetirementProjection = async (userAnswers)=> {
  const retirementAge = 67;
  const SVGGRATE = 0.10;   
  const SALGRATE = 0.025;  
  const SAVERATE = 0.10;  

  const currentAge = getValueForCalculation("How old are you?", userAnswers["How old are you?"]);
  const currentSalary = getValueForCalculation("How much do you make in a year ?", userAnswers["How much do you make in a year ?"]);
  const currentSavings = getValueForCalculation("How much have you saved for retirement so far?", userAnswers["How much have you saved for retirement so far?"]);

  if (currentAge === null || currentSalary === null || currentSavings === null) {
    throw new Error("Missing or invalid inputs for age, salary, or savings.");
  }

  const n = retirementAge - currentAge;

  const futureSavings = currentSavings * Math.pow(1 + SVGGRATE, n);

  let futureContributions = 0;
  for (let t = 0; t < n; t++) {
    const salaryAtT = currentSalary * Math.pow(1 + SALGRATE, t);
    const contribution = salaryAtT * SAVERATE;
    const growth = Math.pow(1 + SVGGRATE, n - t - 1);
    futureContributions += contribution * growth;
  }

  const totalRetirementValue = Math.round(futureSavings + futureContributions);

  return {
    currentAge,
    currentSalary,
    currentSavings,
    projectedRetirementValue: totalRetirementValue
  };
}



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




exports.calculateComfortMean = async(zipcode)=>{
  try{
  if(!zipcode){
    throw "No zip code received"
  }
  const zipCode = await ZipCodeLocation.findOne({zipCode:zipcode})
  if(!zipCode){
    throw  "Zip code not found"
  }

  let getComMean = await StateLifestyle.findOne({state:zipCode.state})

  return getComMean.comfort.mean

  }catch(error){
    throw error
  }
}


