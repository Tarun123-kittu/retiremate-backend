const express = require('express')
const router = express.Router();
const questionnarieController = require('../../controllers/questionnaireController')
const manageQuestionnire = require("../../controllers/manageQuestionnaire.controller")
const financialAdvisorController = require('../../controllers/financial.controller')

//questionnaire
router.get('/get-prime-questions',questionnarieController.getPrimeQuestions)
router.post('/get-next-question',questionnarieController.getNextQuestion)

//mangage questionnaire
router.post('/upload-file',manageQuestionnire.uploadFile)

//financial advisors
router.post('/upload-financial-advisor-file',financialAdvisorController.uploadFinancialAdvisorFile)
router.get('/get-financial-advisors',financialAdvisorController.getFinancialAdvisors)
router.post('/upload-financial-reference',financialAdvisorController.uploadFinancialReference)
router.post('/calculate-can-retire-at-67',financialAdvisorController.calculateCanRetireAt67)
router.post('/upload-zipcodes',financialAdvisorController.uploadZipCodes);
router.post('/upload-lifestyle-data',financialAdvisorController.uploadLifestyleData)



module.exports = router