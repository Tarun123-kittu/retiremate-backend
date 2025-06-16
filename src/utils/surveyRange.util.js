const surveyRangeValueData = [
  // Q5 - Savings
  { questionText: "How much have you saved for retirement so far?", min: 0, max: 50000, valueForCalculation: 40000 },
  { questionText: "How much have you saved for retirement so far?", min: 50001, max: 100000, valueForCalculation: 75000 },
  { questionText: "How much have you saved for retirement so far?", min: 100001, max: 200000, valueForCalculation: 150000 },
  { questionText: "How much have you saved for retirement so far?", min: 200001, max: 300000, valueForCalculation: 250000 },
  { questionText: "How much have you saved for retirement so far?", min: 300001, max: 400000, valueForCalculation: 350000 },
  { questionText: "How much have you saved for retirement so far?", min: 400001, max: 500000, valueForCalculation: 450000 },
  { questionText: "How much have you saved for retirement so far?", min: 500001, max: Infinity, valueForCalculation: 750000 },

  // Q6 - Salary
  { questionText: "How much do you make in a year ?", min: 25000, max: 50000, valueForCalculation: 40000 },
  { questionText: "How much do you make in a year ?", min: 51000, max: 100000, valueForCalculation: 75000 },
  { questionText: "How much do you make in a year ?", min: 100001, max: 150000, valueForCalculation: 125000 },
  { questionText: "How much do you make in a year ?", min: 150001, max: 200000, valueForCalculation: 175000 },
  { questionText: "How much do you make in a year ?", min: 200001, max: 250000, valueForCalculation: 225000 },
  { questionText: "How much do you make in a year ?", min: 250001, max: 350000, valueForCalculation: 300000 },
  { questionText: "How much do you make in a year ?", min: 350001, max: Infinity, valueForCalculation: 450000 },

  // Q1 - Age
  { questionText: "How old are you?", min: 0, max: 39, valueForCalculation: 30 },
  { questionText: "How old are you?", min: 40, max: 49, valueForCalculation: 45 },
  { questionText: "How old are you?", min: 50, max: 59, valueForCalculation: 55 },
  { questionText: "How old are you?", min: 60, max: 65, valueForCalculation: 62 },
  { questionText: "How old are you?", min: 66, max: 79, valueForCalculation: 65 },
  { questionText: "How old are you?", min: 80, max: Infinity, valueForCalculation: 82 }
];

function getValueForCalculation(questionText, inputValue) {
  return (
    surveyRangeValueData.find(entry =>
      entry.questionText === questionText &&
      inputValue >= entry.min &&
      inputValue <= (entry.max ?? Infinity)
    )?.valueForCalculation ?? null
  );
}

module.exports = { getValueForCalculation };