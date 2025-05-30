const express = require('express')
const router = express.Router();
const questionnarieController = require('../../controllers/questionnaireController')

router.get('/get-prime-questions',questionnarieController.getPrimeQuestions)
router.get('/get-next-question',questionnarieController.getNextQuestion)

module.exports = router