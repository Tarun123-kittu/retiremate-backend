const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const { 
  uploadFinancialAdvisorData, 
  getFinancialAdvisors, 
  processFinancialReferenceExcel,
  calculateRetirementProjection,
  parseAndInsertZipCodes ,
  processLifestyleExcelRows,
  calculateComfortMean
 } = require('../services/financial.service');
const { errorResponse, successResponse } = require('../utils/responseHandler.util');
const resMessages = require('../constants/resMessages.constants');


exports.uploadFinancialAdvisorFile = async (req, res) => {
  try {
    const file = req.files?.file;

    if (!file) { return res.status(400).json(errorResponse("No file uploaded.")); }

    if (path.extname(file.name) !== '.xlsx') { return res.status(400).json(errorResponse("Only .xlsx files are allowed.")); }

    const match = file.name.match(/^financialAdvisors(\d+)\.xlsx$/);
    if (!match) {
      return res.status(400).json(errorResponse("Invalid filename format. Use: financialAdvisors{number}.xlsx"));
    }

    const fileNo = parseInt(match[1], 10);
    const uploadPath = path.join(__dirname, '../uploads', file.name);

    await file.mv(uploadPath);

    await uploadFinancialAdvisorData(uploadPath, fileNo);

    fs.unlinkSync(uploadPath);

    return res.status(200).json(successResponse("File uploaded and data saved successfully"));
  } catch (error) {
    console.error("ERROR::", error);
    return res.status(500).json(errorResponse(resMessages.generalError.somethingWentWrong, error.message));
  }
};


exports.getFinancialAdvisors = async (req, res) => {
  try {

    const fileNumber = parseInt(req.query.fileNumber) || 1
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 3

    const financialAdvisors = await getFinancialAdvisors(fileNumber, page, limit)

    return res.status(200).json(successResponse('Details fetched successfully.', financialAdvisors))
  } catch (error) {
    console.error("ERROR::", error);
    return res.status(500).json(errorResponse(resMessages.generalError.somethingWentWrong, error.message));
  }
}


exports.uploadFinancialReference = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.files.file;

    if (path.extname(file.name) !== '.xlsx') {
      return res.status(400).json({ success: false, message: 'Only .xlsx files are allowed' });
    }

    const uploadPath = path.join(__dirname, '../uploads', file.name);
    await file.mv(uploadPath);

    const workbook = XLSX.readFile(uploadPath);
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

    await processFinancialReferenceExcel(rows);

    fs.unlinkSync(uploadPath);
    return res.status(200).json({ success: true, message: 'Financial reference data uploaded successfully' });

  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
  }
};


exports.calculateCanRetireAt67 =async (req, res) => {
  try {
    const details = req.body.details;

    const result = await calculateRetirementProjection(details.userRangeAnswers);
    const questionKey = "Where do you currently live? Please enter your zip code";
    const zipCode = details.userAnswers[questionKey];

    const getComfortMean = await calculateComfortMean(zipCode)

    console.log("getConfor---",getComfortMean)
    console.log("saveret --",result.projectedRetirementValue)

    let canRetireAt67 = result.projectedRetirementValue>=getComfortMean? "Yes" :  "No"
   
    let data = {
      projectedSaving:result.projectedRetirementValue,
      savingRequired:getComfortMean,
      savingDefecit:(result.projectedRetirementValue) - getComfortMean,
      canRetireAt67:canRetireAt67
    }


    return res.status(200).json({
      success: true,
      message: "Retirement projection calculated successfully.",
      data
    });

  } catch (error) {
    console.error("Retirement Calculation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate retirement projection.",
      error: error.message
    });
  }
};




exports.uploadZipCodes = async (req, res) => {
  try {
    const file = req.files?.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const uploadDir = path.join(__dirname, '../uploads');
    const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);

    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    await file.mv(filePath);

    await parseAndInsertZipCodes(filePath);

     fs.unlinkSync(filePath);

    res.status(200).json({ success: true, message: 'Zip codes uploaded successfully' });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};




exports.uploadLifestyleData = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.files.file;
    if (path.extname(file.name) !== '.xlsx') {
      return res.status(400).json({ success: false, message: 'Only .xlsx files are allowed' });
    }

    const uploadPath = path.join(__dirname, '../uploads', file.name);
    await file.mv(uploadPath);

    const workbook = XLSX.readFile(uploadPath);
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

    await processLifestyleExcelRows(rows);

    fs.unlinkSync(uploadPath);

    return res.status(200).json({ success: true, message: 'State lifestyle data uploaded successfully' });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
  }
};



