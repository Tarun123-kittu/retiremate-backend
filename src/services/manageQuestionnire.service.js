const primeQuestionsModel = require("../models/questions-prime.model");
const QuestionsByAgeGroupModel = require("../models/questions-byAgeGroup.model");


exports.processExcelFile = async (data) => {
  try {
    const questionsMap = {};
    const pendingStatements = {};

    for (const row of data) {
      const qid = row['Q#']?.trim();
      const questionText = row['Question']?.trim();
      const optionLabel = row['Option']?.trim();
      const comment = row['Comment']?.trim();
      const typeColumn = row['Type']?.trim().toLowerCase(); 

      if (!qid || !questionText) continue;

      if (qid.startsWith('STMT')) {
        const stmtNum = qid.match(/\d+/)?.[0];
        if (!stmtNum) continue;

        if (!pendingStatements[stmtNum]) pendingStatements[stmtNum] = [];
        pendingStatements[stmtNum].push(questionText);

        const questionKey = `Q${stmtNum}`;
        if (questionsMap[questionKey]) {
          questionsMap[questionKey].system_greeting = pendingStatements[stmtNum];
        }

      } else if (qid.startsWith('Q')) {
        const qNum = qid.match(/\d+/)?.[0];

  
        let type = 'option';
        if (typeColumn === 'range') type = 'range';
        else if (typeColumn === 'text') type = 'text';
      

        if (!questionsMap[qid]) {
          questionsMap[qid] = {
            quiz_no: qNum,
            questionText,
            options: [],
            type, 
            system_greeting: pendingStatements[qNum] || []
          };
        }


        if (optionLabel || comment) {
          questionsMap[qid].options.push({
            value: optionLabel.replace(/[\s-]+/g, '_').toLowerCase(),
            label: optionLabel,
            comment: comment || ''
          });
        }
      }
    }
    return questionsMap;

  } catch (error) {
    console.log("ERROR::", error);
    throw new Error(error.message || 'Failed to process excel file.');
  }
};



exports.processVendorFile = async (questionsMap) => {
  try {
      const newOptionValues = new Set();
      await primeQuestionsModel.deleteMany();
      for (const key of Object.keys(questionsMap)) {
      const { questionText, options, quiz_no, system_greeting ,type} =
      questionsMap[key];

      const existingQuestion = await primeQuestionsModel.findOne({
      questionText,
      type: type,
      });
      if (existingQuestion) {
        const newOptionsJSON = JSON.stringify(options);
        const existingOptionsJSON = JSON.stringify(existingQuestion.options);
        if (newOptionsJSON !== existingOptionsJSON) {
          existingQuestion.options = options;
          await existingQuestion.save();
        }
      } else {
        await primeQuestionsModel.create({
        questionText,
        type: type,
        options,
        quiz_no,
        system_greetings: system_greeting,
      });
      }
      for (const opt of options) {
        if (opt.value) newOptionValues.add(opt.value);
      }}
    const existingValues = await QuestionsByAgeGroupModel.find({
    value: { $in: Array.from(newOptionValues) },
    }).distinct("value");
    const missingValues = [...newOptionValues].filter(
    (v) => !existingValues.includes(v)
    );
    
    if (missingValues.length > 0) {
    const toInsert = missingValues.map((value) => ({
        value,
        questions: [],
      }));
      await QuestionsByAgeGroupModel.insertMany(toInsert);
    }
  } catch (error) {
    console.error('Error in process vendor file function:', error);
    throw new Error(error.message || 'Failed to process vendor file details');
  }
};



exports.processValueFile = async (value, questionsMap) => {

  const allQuestions = await primeQuestionsModel.find();

  const validValues = new Set();
  for (const q of allQuestions) {
    for (const opt of q.options) {
      if (opt.value) validValues.add(opt.value);
    }
  }

  if (!validValues.has(value)) {
    throw new Error(`Invalid file name. No matching value "${value}" found in prime-questions model`);
  }

  const updatedQuestions = [];
  for (const key of Object.keys(questionsMap)) {
    if (key === "__statements") continue;
    const questionNumber = parseInt(key.replace("Q", ""));
    const { questionText, options, type } = questionsMap[key];

    updatedQuestions.push({
      question_number: questionNumber,
      questionText,
      type: type,
      options,
    });
  }

  const existing = await QuestionsByAgeGroupModel.findOne({ value });
  if (existing) {

    existing.questions = updatedQuestions;
    await existing.save();

  } else {

    await QuestionsByAgeGroupModel.create({
      value,
      questions: updatedQuestions,
    });

  }
};
