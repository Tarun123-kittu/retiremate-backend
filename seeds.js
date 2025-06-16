const mongoose = require('mongoose');
const Question = require('./src/models/questions-prime.model');
const QuestionsByAgeGroupModel = require('./src/models/questions-byAgeGroup.model');

const MONGODB_URI = 'mongodb://localhost:27017/Retiremate';

const lessThan40Data = [
    {
        
        question_number: 1,
        questionText: "Are you retired?",
        type: 'question',
        options: [
            { label: 'Yes, not working', comment: 'Wonderful! Let’s focus on maximizing income and minimizing stress.' },
            { label: 'No, working full-time', comment: 'Let’s prepare your retirement timeline and secure your financial future.' },
            { label: 'Working part-time', comment: 'Part-time work offers flexibility—let’s plan around this mixed income.' }
        ]
    },
    {
        question_number: 2,
        questionText: "Where do you currently live? Please enter your zip code",
        type: 'statement',
        options: [
             { label: '(Free Text)', comment: 'This helps tailor advice based on cost of living, taxes, and healthcare access in your area.' },
        ],
    },
    {
        question_number: 3,
        questionText: "Do you own or rent?",
        type: 'question',
        options: [
            { label: 'Own', comment: 'Owning a home gives you equity options in retirement planning.' },
            { label: 'Rent', comment: 'Renting offers flexibility—let’s look for affordable retirement locations.' }
        ]
    },
    {
        question_number: 4,
        questionText: "What is your retirement goal today?",
        type: 'question',
        options: [
            { label: 'I am not sure; I just want to explore discreet expert retirement advice', comment: 'No worries—we’ll guide you step-by-step toward smart retirement decisions.' },
            { label: 'I am interested in finding places I can afford in retirement', comment: 'Great! We’ll help you identify affordable, retirement-friendly locations.' },
            { label: 'I am interested in knowing about money management for retirement', comment: 'Smart move—let’s ensure your money lasts as long as you do.' }
        ]
    },
    {
        question_number: 5,
        questionText: "How much have you saved for retirement so far?",
        type: 'question',
        options: [
            { label: 'Less than $50,000', comment: 'It’s great that you’ve started saving—this is the perfect decade to ramp it up and set strong goals.' },
            { label: '$50,000 – $200,000', comment: 'You’re on your way! Consider reviewing your annual savings rate to stay on track for retirement.' },
            { label: '$200,000 – $500,000', comment: 'You’ve made solid progress—now it’s time to project future needs and adjust accordingly.' },
            { label: 'Over $500,000', comment: 'Impressive! Keep diversifying and consider tax-efficient strategies as you build further.' }
        ]
    },
    {
        question_number: 6,
        questionText: "Are you regularly contributing to a retirement account like a 401(k) or IRA?",
        type: 'question',
        options: [
            { label: 'Yes, every paycheck', comment: 'Great habit! Consistency is the key to compounding returns.' },
            { label: 'Occasionally', comment: 'Consider automating your contributions to stay disciplined.' },
            { label: "Not currently", comment: "This is a critical time to start—it's not too late to make up ground." },
            { label: 'I don’t have a retirement account', comment: 'Opening an account now can help you benefit from tax advantages and long-term growth.' }
        ]
    },
    {
        question_number: 7,
        questionText: "Have you estimated how much you’ll need annually in retirement?",
        type: 'question',
        options: [
            { label: 'Yes, I have a detailed plan', comment: 'Excellent! That gives you a clearer picture of what to aim for.' },
            { label: 'I have a rough estimate', comment: 'Good start—refining the numbers can improve your planning accuracy.' },
            { label: 'No, but I plan to soon', comment: 'Make it a priority—it helps you measure your readiness.' },
            { label: 'Not at all', comment: 'Knowing your target retirement income is foundational to sound planning.' }
        ]
    },
    {
        question_number: 8,
        questionText: "Are you maximizing employer contributions to your retirement plan (e.g., 401(k) match)?",
        type: 'question',
        options: [
            { label: 'Yes, I contribute enough to get the full match', comment: 'Smart move! You\'re effectively earning free money.' },
            { label: 'I contribute but not enough for full match', comment: 'Try to increase contributions gradually to capture the full match.' },
            { label: 'My employer doesn’t offer a match', comment: 'In that case, consider contributing more independently.' },
            { label: 'I’m not sure', comment: 'It may be worth checking your HR benefits to confirm.' }
        ]
    },
    {
        question_number: 9,
        questionText: "Do you have a plan to eliminate high-interest debt before retirement?",
        type: 'question',
        options: [
            { label: 'Yes, I’m actively working on it', comment: 'That\'s a strong financial move—paying off debt boosts retirement readiness.' },
            { label: 'I’ve started, but it’s slow progress', comment: 'Keep at it—every bit of progress adds flexibility later.' },
            { label: 'No plan yet', comment: 'Consider working with a financial coach to build a realistic plan.' },
            { label: 'I don’t have high-interest debt', comment: 'That\'s great! You’re in a good position to focus on savings growth.' }
        ]
    },
    {
        question_number: 10,
        questionText: "How would you describe your current investment strategy?",
        type: 'question',
        options: [
            { label: 'Growth-focused, aggressive', comment: 'At your age, growth strategies can still be beneficial—just monitor the risk.' },
            { label: 'Balanced mix of growth and safety', comment: 'That’s a smart approach for this phase of life.' },
            { label: 'Conservative, mostly low-risk', comment: 'Consider if your risk level aligns with your long-term goals.' },
            { label: 'I’m not sure / No strategy yet', comment: 'A review with a financial advisor might help you build confidence in your strategy.' }
        ]
    },
    {
        question_number: 11,
        questionText: "Do you have insurance that protects your income if you’re unable to work?",
        type: 'question',
        options: [
            { label: 'Yes, disability or critical illness coverage', comment: 'That’s excellent protection during your prime earning years.' },
            { label: 'I think it’s included with work benefits', comment: 'Confirm the coverage details with HR so you know what you’re relying on.' },
            { label: 'No, but I’m considering it', comment: 'It’s a smart safeguard—especially with financial goals ahead.' },
            { label: 'No and not planning to', comment: 'This could be a gap worth evaluating—life can be unpredictable.' }
        ]
    },
    {
        question_number: 12,
        questionText: "Have you checked your projected Social Security benefits?",
        type: 'question',
        options: [
            { label: 'Yes, using SSA.gov or similar tools', comment: 'Great! Tracking this gives you a clearer income picture.' },
            { label: 'No, but I know how to', comment: 'Make sure to do it soon—it’s quick and very informative.' },
            { label: 'No, and I’m not sure how', comment: 'Consider checking SSA.gov—it’s easy and secure.' },
            { label: 'I don’t expect to rely on Social Security', comment: 'Smart to plan conservatively, but it’s still good to know your expected benefits.' }
        ]
    },
    {
        question_number: 13,
        questionText: "Have you considered long-term care insurance or planning?",
        type: 'question',
        options: [
            { label: 'Yes, I have a policy or plan', comment: 'That’s wise—planning early can save significantly on premiums.' },
            { label: 'It’s on my radar', comment: 'Consider looking into it before your mid-50s, when rates rise.' },
            { label: 'I haven’t thought about it yet', comment: 'This is a good time to start thinking about it—costs can surprise you.' },
            { label: 'I don’t think I’ll need it', comment: 'Many people underestimate this need—worth a second look.' }
        ]
    },
    {
        question_number: 14,
        questionText: "Have you created a will or assigned beneficiaries for your major accounts?",
        type: 'question',
        options: [
            { label: 'Yes, all done', comment: 'Well done—you’ve given your family a valuable gift of clarity.' },
            { label: 'Partially done (some accounts only)', comment: 'Great start! Aim to complete the rest soon.' },
            { label: 'No, but I plan to', comment: 'Don’t delay—life happens, and preparation gives peace of mind.' },
            { label: 'Not at all', comment: 'This should be a priority—it ensures your wishes are followed.' }
        ]
    }
];

const questionsData_40_49 = [
    {
        question_number: 1,
        questionText: "Are you retired?",
        type: 'question',
        options: [
            { label: 'Yes, not working', comment: 'Great—now it’s about making your retirement assets last.' },
            { label: 'No, working full-time', comment: 'Time to maximize earnings and build a solid nest egg.' },
            { label: 'Working part-time', comment: 'Let’s plan for a flexible income strategy in retirement.' }
        ]
    },
    {
        question_number: 2,
        questionText: "Where do you currently live? Please enter your zip code",
        type: 'statement',
        options: [
            { label: '(Free Text)', comment: 'This helps tailor advice based on cost of living, taxes, and healthcare access in your area.' },
        ],
    },
    {
        question_number: 3,
        questionText: "Do you own or rent?",
        type: 'question',
        options: [
            { label: 'Own', comment: 'Owning gives you financial leverage—let’s plan how to use it wisely.' },
            { label: 'Rent', comment: 'Flexibility is valuable—let’s consider affordable retirement locations.' }
        ]
    },
    {
        question_number: 4,
        questionText: "What is your retirement goal today?",
        type: 'question',
        options: [
            { label: 'I am not sure; I just want to explore discreet expert retirement advice', comment: 'That’s fine—we’ll guide you toward clarity and confidence.' },
            { label: 'I am interested in finding places I can afford in retirement', comment: 'We can help you identify budget-friendly retirement spots.' },
            { label: 'I am interested in knowing about money management for retirement', comment: 'Let’s get smart about protecting and growing your savings.' }
        ]
    },
    {
        question_number: 5,
        questionText: "How much have you saved for retirement so far?",
        type: 'question',
        options: [
            { label: 'Less than $50,000', comment: 'Now’s a critical time to start growing your savings more aggressively.' },
            { label: '$50,000 – $200,000', comment: 'Good progress—let’s stay focused on steady contributions and returns.' },
            { label: '$200,000 – $500,000', comment: 'Solid footing—now is a good time to reevaluate your goals and strategy.' },
            { label: 'Over $500,000', comment: 'Excellent! Let’s look at tax optimization and long-term sustainability.' }
        ]
    },
    {
        question_number: 6,
        questionText: "Are you regularly contributing to a retirement account like a 401(k) or IRA?",
        type: 'question',
        options: [
            { label: 'Yes, every paycheck', comment: 'Great! This habit will serve you well over the next 15–25 years.' },
            { label: 'Occasionally', comment: 'Try setting up automated contributions to stay consistent.' },
            { label: 'Not currently', comment: 'This is a pivotal time—get started now to make the most of compounding.' },
            { label: 'I don’t have a retirement account', comment: 'Opening one now can still deliver big benefits.' }
        ]
    },
    {
        question_number: 7,
        questionText: "Have you estimated how much you’ll need annually in retirement?",
        type: 'question',
        options: [
            { label: 'Yes, I have a detailed plan', comment: 'Perfect—time to make sure you’re on track.' },
            { label: 'I have a rough estimate', comment: 'Good start—refining it now can guide smarter decisions.' },
            { label: 'No, but I plan to soon', comment: 'The sooner you do, the better your planning will be.' },
            { label: 'Not at all', comment: 'Let’s work on building your retirement income target.' }
        ]
    },
    {
        question_number: 8,
        questionText: "Are you maximizing employer contributions to your retirement plan (e.g., 401(k) match)?",
        type: 'question',
        options: [
            { label: 'Yes, I contribute enough to get the full match', comment: 'Well done—you’re not leaving money on the table.' },
            { label: 'I contribute but not enough for full match', comment: 'Let’s explore how to gradually increase your contribution.' },
            { label: 'My employer doesn’t offer a match', comment: 'In that case, maximizing your own savings is even more important.' },
            { label: 'I’m not sure', comment: 'Let’s double-check—this could be a major missed opportunity.' }
        ]
    },
    {
        question_number: 9,
        questionText: "Do you have a plan to eliminate high-interest debt before retirement?",
        type: 'question',
        options: [
            { label: 'Yes, I’m actively working on it', comment: 'That’s a key move for long-term financial stability.' },
            { label: 'I’ve started, but it’s slow progress', comment: 'You’re on the right track—consistency will pay off.' },
            { label: 'No plan yet', comment: 'Let’s create a clear strategy to reduce debt and free up savings.' },
            { label: 'I don’t have high-interest debt', comment: 'Excellent! You can now focus more on asset growth.' }
        ]
    },
    {
        question_number: 10,
        questionText: "How would you describe your current investment strategy?",
        type: 'question',
        options: [
            { label: 'Growth-focused, aggressive', comment: 'Still a valid approach—just start reviewing risk as you get older.' },
            { label: 'Balanced mix of growth and safety', comment: 'Smart balance—keep monitoring as you near retirement.' },
            { label: 'Conservative, mostly low-risk', comment: 'That’s fine—just make sure it aligns with your goals and timeline.' },
            { label: 'I’m not sure / No strategy yet', comment: 'Now’s a great time to build or refine your approach.' }
        ]
    },
    {
        question_number: 11,
        questionText: "Do you have insurance that protects your income if you’re unable to work?",
        type: 'question',
        options: [
            { label: 'Yes, disability or critical illness coverage', comment: 'That’s excellent protection during your prime earning years.' },
            { label: 'I think it’s included with work benefits', comment: 'Confirm the coverage details with HR so you know what you’re relying on.' },
            { label: 'No, but I’m considering it', comment: 'It’s a smart safeguard—especially with financial goals ahead.' },
            { label: 'No and not planning to', comment: 'This could be a gap worth evaluating—life can be unpredictable.' }
        ]
    },
    {
        question_number: 12,
        questionText: "Have you checked your projected Social Security benefits?",
        type: 'question',
        options: [
            { label: 'Yes, using SSA.gov or similar tools', comment: 'Great! Tracking this gives you a clearer income picture.' },
            { label: 'No, but I know how to', comment: 'Make sure to do it soon—it’s quick and very informative.' },
            { label: 'No, and I’m not sure how', comment: 'Consider checking SSA.gov—it’s easy and secure.' },
            { label: 'I don’t expect to rely on Social Security', comment: 'Smart to plan conservatively, but it’s still good to know your expected benefits.' }
        ]
    },
    {
        question_number: 13,
        questionText: "Have you considered long-term care insurance or planning?",
        type: 'question',
        options: [
            { label: 'Yes, I have a policy or plan', comment: 'That’s wise—planning early can save significantly on premiums.' },
            { label: 'It’s on my radar', comment: 'Consider looking into it before your mid-50s, when rates rise.' },
            { label: 'I haven’t thought about it yet', comment: 'This is a good time to start thinking about it—costs can surprise you.' },
            { label: 'I don’t think I’ll need it', comment: 'Many people underestimate this need—worth a second look.' }
        ]
    },
    {
        question_number: 14,
        questionText: "Have you created a will or assigned beneficiaries for your major accounts?",
        type: 'question',
        options: [
            { label: 'Yes, all done', comment: 'Well done—you’ve given your family a valuable gift of clarity.' },
            { label: 'Partially done (some accounts only)', comment: 'Great start! Aim to complete the rest soon.' },
            { label: 'No, but I plan to', comment: 'Don’t delay—life happens, and preparation gives peace of mind.' },
            { label: 'Not at all', comment: 'This should be a priority—it ensures your wishes are followed.' }
        ]
    }
];

const questionsData_50_59 = [
    {
        question_number: 1,
        questionText: "Are you retired?",
        type: 'question',
        options: [
            { label: 'Yes, not working', comment: 'Wonderful! Let’s focus on maximizing income and minimizing stress.' },
            { label: 'No, working full-time', comment: 'Let’s prepare your retirement timeline and secure your financial future.' },
            { label: 'Working part-time', comment: 'Part-time work offers flexibility—let’s plan around this mixed income.' }
        ]
    },
    {
        question_number: 2,
        questionText: "Where do you currently live? Please be as specific as possible (Address, Zip Code, Neighborhood, City, or State)",
        type: 'statement',
        options: [
             { label: '(Free Text)', comment: 'This helps tailor advice based on cost of living, taxes, and healthcare access in your area.' },
        ],
    },
    {
        question_number: 3,
        questionText: "Do you own or rent?",
        type: 'question',
        options: [
            { label: 'Own', comment: 'Owning a home gives you equity options in retirement planning.' },
            { label: 'Rent', comment: 'Renting offers flexibility—let’s look for affordable retirement locations.' },
            { label: 'Other', comment: 'Let’s understand your housing situation to build an accurate plan.' }
        ]
    },
    {
        question_number: 4,
        questionText: "What is your retirement goal today?",
        type: 'question',
        options: [
            { label: 'I am not sure; I just want to explore discreet expert retirement advice', comment: 'No worries—we’ll guide you step-by-step toward smart retirement decisions.' },
            { label: 'I am interested in finding places I can afford in retirement', comment: 'Great! We’ll help you identify affordable, retirement-friendly locations.' },
            { label: 'I am interested in knowing about money management for retirement', comment: 'Smart move—let’s ensure your money lasts as long as you do.' }
        ]
    },
    {
        question_number: 5,
        questionText: "How much have you saved for retirement so far?",
        type: 'question',
        options: [
            { label: 'Less than $100,000', comment: 'You still have time—catch-up contributions and disciplined investing can help close the gap.' },
            { label: '$100,000 – $300,000', comment: 'You’re building momentum—now is the time to fine-tune your plan and avoid large setbacks.' },
            { label: '$300,000 – $700,000', comment: 'You\'re making strong progress—now focus on preserving and optimizing that wealth.' },
            { label: 'Over $700,000', comment: 'Excellent work! Be sure your income strategy and estate planning are equally solid.' }
        ]
    },
    {
        question_number: 6,
        questionText: "Have you estimated how long your retirement savings will last?",
        type: 'question',
        options: [
            { label: 'Yes, I’ve modeled it out', comment: 'Excellent! That clarity helps you make confident decisions about retirement timing and spending.' },
            { label: 'I have a rough idea', comment: 'A good beginning—fine-tuning those numbers will increase your confidence.' },
            { label: 'No, not really', comment: 'Now is the time to get serious—consider using online tools or talking to an advisor.' },
            { label: 'I don\'t know where to start', comment: 'No worries—there are simple calculators that can help you take the first step.' }
        ]
    },
    {
        question_number: 7,
        questionText: "Are you taking advantage of catch-up contributions in your 401(k) or IRA?",
        type: 'question',
        options: [
            { label: 'Yes, every year', comment: 'Great! Catch-up contributions can significantly boost your nest egg in this decade.' },
            { label: 'I just started', comment: 'Good move—stay consistent to maximize this opportunity.' },
            { label: 'Not yet, but planning to', comment: 'You still have time—adding even a bit more can make a big difference.' },
            { label: 'I wasn’t aware of this', comment: 'This is worth exploring—those extra contributions are designed for your stage of life.' }
        ]
    },
    {
        question_number: 8,
        questionText: "Do you plan to retire at 60, 65, 67—or work longer?",
        type: 'question',
        options: [
            { label: 'I plan to retire before 60', comment: 'Early retirement is exciting—make sure your savings can support a longer retirement.' },
            { label: 'Between 60 and 65', comment: 'That’s a common window—refining your income plan will help ease the transition.' },
            { label: 'At 67', comment: 'Delaying to full retirement age increases your Social Security benefits.' },
            { label: 'Later than 67', comment: 'Working longer can ease pressure on savings and increase your future security.' }
        ]
    },
    {
        question_number: 9,
        questionText: "Have you considered delaying Social Security for higher benefits?",
        type: 'question',
        options: [
            { label: 'Yes, I plan to delay', comment: 'Smart move—delaying can increase your monthly benefit significantly.' },
            { label: 'Maybe—I’m still deciding', comment: 'Take time to weigh the pros and cons—it depends on your income needs and health.' },
            { label: 'No, I plan to take it as early as possible', comment: 'That’s okay—just make sure you understand the long-term trade-offs.' },
            { label: 'I’m not sure how it works', comment: 'Understanding your claiming strategy is key—SSA.gov has great tools to help.' }
        ]
    },
	  {
        question_number: 10,
        questionText: "Do you know your expected monthly expenses in retirement?",
        type: 'question',
        options: [
            { label: 'Yes, I’ve calculated them', comment: 'That’s excellent—knowing your budget is crucial for peace of mind.' },
            { label: 'I have an estimate', comment: 'A rough estimate is helpful, but refining it will improve your planning.' },
            { label: 'Not really', comment: 'Start tracking your current spending—it’s a helpful baseline.' },
            { label: 'I haven’t thought about it', comment: 'Creating a retirement budget now can prevent surprises later.' }
        ]
    },
    {
        question_number: 11,
        questionText: "Have you factored healthcare and Medicare premiums into your retirement budget?",
        type: 'question',
        options: [
            { label: 'Yes, fully accounted for', comment: 'Great! Healthcare is one of the biggest retirement costs.' },
            { label: 'Partially considered', comment: 'Good first step—be sure to understand Medicare Parts B, D, and supplemental options.' },
            { label: 'No, not yet', comment: 'Consider this soon—it can significantly impact your expenses.' },
            { label: 'I didn’t realize I should', comment: 'Health costs can add up—factoring them in now helps avoid financial stress later.' }
        ]
    },
    {
        question_number: 12,
        questionText: "Do you plan to downsize, relocate, or stay in your current home?",
        type: 'question',
        options: [
            { label: 'Stay in current home', comment: 'Make sure your home is affordable and accessible for your retirement years.' },
            { label: 'Downsize locally', comment: 'Downsizing can free up equity and reduce expenses.' },
            { label: 'Relocate to a new city/state', comment: 'Relocating can be a great lifestyle shift—just factor in taxes and healthcare access.' },
            { label: 'Still deciding', comment: 'Exploring options now gives you time to plan wisely and avoid rushed decisions.' }
        ]
    },
    {
        question_number: 13,
        questionText: "Are your investments too aggressive, too conservative, or appropriately balanced?",
        type: 'question',
        options: [
            { label: 'Too aggressive', comment: 'Consider dialing back risk as you approach retirement to protect your savings.' },
            { label: 'Too conservative', comment: 'You may want to shift toward more growth if your plan falls short.' },
            { label: 'Balanced for my age', comment: 'Well done—balance is key for sustainable withdrawals.' },
            { label: 'I’m not sure', comment: 'A portfolio review can give you confidence and uncover opportunities.' }
        ]
    },
    {
        question_number: 14,
        questionText: "Do you have a retirement income strategy (withdrawal plan, annuities, etc.)?",
        type: 'question',
        options: [
            { label: 'Yes, a full income plan', comment: 'Excellent—structured income planning brings predictability to retirement.' },
            { label: 'Working on it', comment: 'You’re on the right path—just make sure it aligns with your budget and goals.' },
            { label: 'Not yet', comment: 'Now is a good time to start—it can reduce your stress later.' },
            { label: 'I don’t know what that means', comment: 'This is essential—consider meeting with a planner or using retirement tools online.' }
        ]
    },
    {
        question_number: 15,
        questionText: "Have you updated or reviewed your will, trust, and beneficiary designations in the last 5 years?",
        type: 'question',
        options: [
            { label: 'Yes, recently updated', comment: 'Fantastic—your legacy planning is up to date.' },
            { label: 'Partially updated', comment: 'Good start—make sure everything aligns with your current wishes.' },
            { label: 'No, not yet', comment: 'Consider prioritizing this—it protects your family and assets.' },
            { label: 'I don’t have any of those', comment: 'Creating these documents is a gift of clarity for your loved ones.' }
        ]
    }
];

const questionsData_60_65 = [
  {
    question_number: 1,
    questionText: "Are you retired?",
    type: 'question',
    options: [
      { label: 'Yes, not working', comment: 'Wonderful! Let’s focus on maximizing income and minimizing stress.' },
      { label: 'No, working full-time', comment: 'Let’s prepare your retirement timeline and secure your financial future.' },
      { label: 'Working part-time', comment: 'Part-time work offers flexibility—let’s plan around this mixed income.' }
    ]
  },
  {
    question_number: 2,
    questionText: "Where do you currently live? Please be as specific as possible (Address, Zip Code, Neighborhood, City, or State)",
    type: 'statement',
    options: [
          { label: '(Free Text)', comment: 'This helps tailor advice based on cost of living, taxes, and healthcare access in your area.' },
    ],
  },
  {
    question_number: 3,
    questionText: "Do you own or rent?",
    type: 'question',
    options: [
      { label: 'Own', comment: 'Owning a home gives you equity options in retirement planning.' },
      { label: 'Rent', comment: 'Renting offers flexibility—let’s look for affordable retirement locations.' },
      { label: 'Other', comment: 'Let’s understand your housing situation to build an accurate plan.' }
    ]
  },
  {
    question_number: 4,
    questionText: "What is your retirement goal today?",
    type: 'question',
    options: [
      { label: 'I am not sure; I just want to explore discreet expert retirement advice', comment: 'No worries—we’ll guide you step-by-step toward smart retirement decisions.' },
      { label: 'I am interested in finding places I can afford in retirement', comment: 'Great! We’ll help you identify affordable, retirement-friendly locations.' },
      { label: 'I am interested in knowing about money management for retirement', comment: 'Smart move—let’s ensure your money lasts as long as you do.' }
    ]
  },
  {
    question_number: 5,
    questionText: "How much have you saved for retirement so far?",
    type: 'question',
    options: [
      { label: 'Less than $100,000', comment: 'You still have time—catch-up contributions and disciplined investing can help close the gap.' },
      { label: '$100,000 – $300,000', comment: 'You’re building momentum—now is the time to fine-tune your plan and avoid large setbacks.' },
      { label: '$300,000 – $700,000', comment: 'You\'re making strong progress—now focus on preserving and optimizing that wealth.' },
      { label: 'Over $700,000', comment: 'Excellent work! Be sure your income strategy and estate planning are equally solid.' }
    ]
  },
  {
    question_number: 6,
    questionText: "Have you estimated how long your retirement savings will last?",
    type: 'question',
    options: [
      { label: 'Yes, I’ve modeled it out', comment: 'Excellent! That clarity helps you make confident decisions about retirement timing and spending.' },
      { label: 'I have a rough idea', comment: 'A good beginning—fine-tuning those numbers will increase your confidence.' },
      { label: 'No, not really', comment: 'Now is the time to get serious—consider using online tools or talking to an advisor.' },
      { label: 'I don’t know where to start', comment: 'No worries—there are simple calculators that can help you take the first step.' }
    ]
  },
  {
    question_number: 7,
    questionText: "Are you taking advantage of catch-up contributions in your 401(k) or IRA?",
    type: 'question',
    options: [
      { label: 'Yes, every year', comment: 'Great! Catch-up contributions can significantly boost your nest egg in this decade.' },
      { label: 'I just started', comment: 'Good move—stay consistent to maximize this opportunity.' },
      { label: 'Not yet, but planning to', comment: 'You still have time—adding even a bit more can make a big difference.' },
      { label: 'I wasn’t aware of this', comment: 'This is worth exploring—those extra contributions are designed for your stage of life.' }
    ]
  },
  {
    question_number: 8,
    questionText: "Do you plan to retire at 60, 65, 67—or work longer?",
    type: 'question',
    options: [
      { label: 'I plan to retire before 60', comment: 'Early retirement is exciting—make sure your savings can support a longer retirement.' },
      { label: 'Between 60 and 65', comment: 'That’s a common window—refining your income plan will help ease the transition.' },
      { label: 'At 67', comment: 'Delaying to full retirement age increases your Social Security benefits.' },
      { label: 'Later than 67', comment: 'Working longer can ease pressure on savings and increase your future security.' }
    ]
  },
  {
    question_number: 9,
    questionText: "Have you considered delaying Social Security for higher benefits?",
    type: 'question',
    options: [
      { label: 'Yes, I plan to delay', comment: 'Smart move—delaying can increase your monthly benefit significantly.' },
      { label: 'Maybe—I’m still deciding', comment: 'Take time to weigh the pros and cons—it depends on your income needs and health.' },
      { label: 'No, I plan to take it as early as possible', comment: 'That’s okay—just make sure you understand the long-term trade-offs.' },
      { label: 'I’m not sure how it works', comment: 'Understanding your claiming strategy is key—SSA.gov has great tools to help.' }
    ]
  },
  {
    question_number: 10,
    questionText: "Do you know your expected monthly expenses in retirement?",
    type: 'question',
    options: [
      { label: 'Yes, I’ve calculated them', comment: 'That’s excellent—knowing your budget is crucial for peace of mind.' },
      { label: 'I have an estimate', comment: 'A rough estimate is helpful, but refining it will improve your planning.' },
      { label: 'Not really', comment: 'Start tracking your current spending—it’s a helpful baseline.' },
      { label: 'I haven’t thought about it', comment: 'Creating a retirement budget now can prevent surprises later.' }
    ]
  },
  {
    question_number: 11,
    questionText: "Have you factored healthcare and Medicare premiums into your retirement budget?",
    type: 'question',
    options: [
      { label: 'Yes, fully accounted for', comment: 'Great! Healthcare is one of the biggest retirement costs.' },
      { label: 'Partially considered', comment: 'Good first step—be sure to understand Medicare Parts B, D, and supplemental options.' },
      { label: 'No, not yet', comment: 'Consider this soon—it can significantly impact your expenses.' },
      { label: 'I didn’t realize I should', comment: 'Health costs can add up—factoring them in now helps avoid financial stress later.' }
    ]
  },
  {
    question_number: 12,
    questionText: "Do you plan to downsize, relocate, or stay in your current home?",
    type: 'question',
    options: [
      { label: 'Stay in current home', comment: 'Make sure your home is affordable and accessible for your retirement years.' },
      { label: 'Downsize locally', comment: 'Downsizing can free up equity and reduce expenses.' },
      { label: 'Relocate to a new city/state', comment: 'Relocating can be a great lifestyle shift—just factor in taxes and healthcare access.' },
      { label: 'Still deciding', comment: 'Exploring options now gives you time to plan wisely and avoid rushed decisions.' }
    ]
  },
  {
    question_number: 13,
    questionText: "Are your investments too aggressive, too conservative, or appropriately balanced?",
    type: 'question',
    options: [
      { label: 'Too aggressive', comment: 'Consider dialing back risk as you approach retirement to protect your savings.' },
      { label: 'Too conservative', comment: 'You may want to shift toward more growth if your plan falls short.' },
      { label: 'Balanced for my age', comment: 'Well done—balance is key for sustainable withdrawals.' },
      { label: 'I’m not sure', comment: 'A portfolio review can give you confidence and uncover opportunities.' }
    ]
  },
  {
    question_number: 14,
    questionText: "Do you have a retirement income strategy (withdrawal plan, annuities, etc.)?",
    type: 'question',
    options: [
      { label: 'Yes, a full income plan', comment: 'Excellent—structured income planning brings predictability to retirement.' },
      { label: 'Working on it', comment: 'You’re on the right path—just make sure it aligns with your budget and goals.' },
      { label: 'Not yet', comment: 'Now is a good time to start—it can reduce your stress later.' },
      { label: 'I don’t know what that means', comment: 'This is essential—consider meeting with a planner or using retirement tools online.' }
    ]
  },
  {
    question_number: 15,
    questionText: "Have you updated or reviewed your will, trust, and beneficiary designations in the last 5 years?",
    type: 'question',
    options: [
      { label: 'Yes, recently updated', comment: 'Fantastic—your legacy planning is up to date.' },
      { label: 'Partially updated', comment: 'Good start—make sure everything aligns with your current wishes.' },
      { label: 'No, not yet', comment: 'Consider prioritizing this—it protects your family and assets.' },
      { label: 'I don’t have any of those', comment: 'Creating these documents is a gift of clarity for your loved ones.' }
    ]
  }
];

const questionsData_66_79 = [
    {
        question_number: 1,
        questionText: "Are you retired?",
        type: 'question',
        options: [
            { label: 'Yes, not working', comment: 'Wonderful! Let’s focus on maximizing income and minimizing stress.' },
            { label: 'No, working full-time', comment: 'Let’s prepare your retirement timeline and secure your financial future.' },
            { label: 'Working part-time', comment: 'Part-time work offers flexibility—let’s plan around this mixed income.' }
        ]
    },
    {
        question_number: 2,
        questionText: "Where do you currently live? Please be as specific as possible (Address, Zip Code, Neighborhood, City, or State)",
        type: 'statement',
        options: [
              { label: '(Free Text)', comment: 'This helps tailor advice based on cost of living, taxes, and healthcare access in your area.' },
        ],
    },
    {
        question_number: 3,
        questionText: "Do you own or rent?",
        type: 'question',
        options: [
            { label: 'Own', comment: 'Owning a home gives you equity options in retirement planning.' },
            { label: 'Rent', comment: 'Renting offers flexibility—let’s look for affordable retirement locations.' },
            { label: 'Other', comment: 'Let’s understand your housing situation to build an accurate plan.' }
        ]
    },
    {
        question_number: 4,
        questionText: "What is your retirement goal today?",
        type: 'question',
        options: [
            { label: 'I am not sure; I just want to explore discreet expert retirement advice', comment: 'No worries—we’ll guide you step-by-step toward smart retirement decisions.' },
            { label: 'I am interested in finding places I can afford in retirement', comment: 'Great! We’ll help you identify affordable, retirement-friendly locations.' },
            { label: 'I am interested in knowing about money management for retirement', comment: 'Smart move—let’s ensure your money lasts as long as you do.' }
        ]
    },
    {
        question_number: 5,
        questionText: "How much have you saved for retirement so far?",
        type: 'question',
        options: [
            { label: 'Less than $100,000', comment: 'You still have time—catch-up contributions and disciplined investing can help close the gap.' },
            { label: '$100,000 – $300,000', comment: 'You’re building momentum—now is the time to fine-tune your plan and avoid large setbacks.' },
            { label: '$300,000 – $700,000', comment: "You're making strong progress—now focus on preserving and optimizing that wealth." },
            { label: 'Over $700,000', comment: 'Excellent work! Be sure your income strategy and estate planning are equally solid.' }
        ]
    },
    {
        question_number: 6,
        questionText: "Have you estimated how long your retirement savings will last?",
        type: 'question',
        options: [
            { label: 'Yes, I’ve modeled it out', comment: 'Excellent! That clarity helps you make confident decisions about retirement timing and spending.' },
            { label: 'I have a rough idea', comment: 'A good beginning—fine-tuning those numbers will increase your confidence.' },
            { label: 'No, not really', comment: 'Now is the time to get serious—consider using online tools or talking to an advisor.' },
            { label: "I don't know where to start", comment: 'No worries—there are simple calculators that can help you take the first step.' }
        ]
    },
    {
        question_number: 7,
        questionText: "Are you taking advantage of catch-up contributions in your 401(k) or IRA?",
        type: 'question',
        options: [
            { label: 'Yes, every year', comment: 'Great! Catch-up contributions can significantly boost your nest egg in this decade.' },
            { label: 'I just started', comment: 'Good move—stay consistent to maximize this opportunity.' },
            { label: 'Not yet, but planning to', comment: 'You still have time—adding even a bit more can make a big difference.' },
            { label: 'I wasn’t aware of this', comment: 'This is worth exploring—those extra contributions are designed for your stage of life.' }
        ]
    },
    {
        question_number: 8,
        questionText: "Do you plan to retire at 60, 65, 67—or work longer?",
        type: 'question',
        options: [
            { label: 'I plan to retire before 60', comment: 'Early retirement is exciting—make sure your savings can support a longer retirement.' },
            { label: 'Between 60 and 65', comment: 'That’s a common window—refining your income plan will help ease the transition.' },
            { label: 'At 67', comment: 'Delaying to full retirement age increases your Social Security benefits.' },
            { label: 'Later than 67', comment: 'Working longer can ease pressure on savings and increase your future security.' }
        ]
    },
    {
        question_number: 9,
        questionText: "Have you considered delaying Social Security for higher benefits?",
        type: 'question',
        options: [
            { label: 'Yes, I plan to delay', comment: 'Smart move—delaying can increase your monthly benefit significantly.' },
            { label: 'Maybe—I’m still deciding', comment: 'Take time to weigh the pros and cons—it depends on your income needs and health.' },
            { label: 'No, I plan to take it as early as possible', comment: 'That’s okay—just make sure you understand the long-term trade-offs.' },
            { label: 'I’m not sure how it works', comment: 'Understanding your claiming strategy is key—SSA.gov has great tools to help.' }
        ]
    },
    {
        question_number: 10,
        questionText: "Do you know your expected monthly expenses in retirement?",
        type: 'question',
        options: [
            { label: 'Yes, I’ve calculated them', comment: 'That’s excellent—knowing your budget is crucial for peace of mind.' },
            { label: 'I have an estimate', comment: 'A rough estimate is helpful, but refining it will improve your planning.' },
            { label: 'Not really', comment: 'Start tracking your current spending—it’s a helpful baseline.' },
            { label: 'I haven’t thought about it', comment: 'Creating a retirement budget now can prevent surprises later.' }
        ]
    },
    {
        question_number: 11,
        questionText: "Have you factored healthcare and Medicare premiums into your retirement budget?",
        type: 'question',
        options: [
            { label: 'Yes, fully accounted for', comment: 'Great! Healthcare is one of the biggest retirement costs.' },
            { label: 'Partially considered', comment: 'Good first step—be sure to understand Medicare Parts B, D, and supplemental options.' },
            { label: 'No, not yet', comment: 'Consider this soon—it can significantly impact your expenses.' },
            { label: 'I didn’t realize I should', comment: 'Health costs can add up—factoring them in now helps avoid financial stress later.' }
        ]
    },
    {
        question_number: 12,
        questionText: "Do you plan to downsize, relocate, or stay in your current home?",
        type: 'question',
        options: [
            { label: 'Stay in current home', comment: 'Make sure your home is affordable and accessible for your retirement years.' },
            { label: 'Downsize locally', comment: 'Downsizing can free up equity and reduce expenses.' },
            { label: 'Relocate to a new city/state', comment: 'Relocating can be a great lifestyle shift—just factor in taxes and healthcare access.' },
            { label: 'Still deciding', comment: 'Exploring options now gives you time to plan wisely and avoid rushed decisions.' }
        ]
    },
    {
        question_number: 13,
        questionText: "Are your investments too aggressive, too conservative, or appropriately balanced?",
        type: 'question',
        options: [
            { label: 'Too aggressive', comment: 'Consider dialing back risk as you approach retirement to protect your savings.' },
            { label: 'Too conservative', comment: 'You may want to shift toward more growth if your plan falls short.' },
            { label: 'Balanced for my age', comment: 'Well done—balance is key for sustainable withdrawals.' },
            { label: 'I’m not sure', comment: 'A portfolio review can give you confidence and uncover opportunities.' }
        ]
    },
    {
        question_number: 14,
        questionText: "Do you have a retirement income strategy (withdrawal plan, annuities, etc.)?",
        type: 'question',
        options: [
            { label: 'Yes, a full income plan', comment: 'Excellent—structured income planning brings predictability to retirement.' },
            { label: 'Working on it', comment: 'You’re on the right path—just make sure it aligns with your budget and goals.' },
            { label: 'Not yet', comment: 'Now is a good time to start—it can reduce your stress later.' },
            { label: 'I don’t know what that means', comment: 'This is essential—consider meeting with a planner or using retirement tools online.' }
        ]
    },
    {
        question_number: 15,
        questionText: "Have you updated or reviewed your will, trust, and beneficiary designations in the last 5 years?",
        type: 'question',
        options: [
            { label: 'Yes, recently updated', comment: 'Fantastic—your legacy planning is up to date.' },
            { label: 'Partially updated', comment: 'Good start—make sure everything aligns with your current wishes.' },
            { label: 'No, not yet', comment: 'Consider prioritizing this—it protects your family and assets.' },
            { label: 'I don’t have any of those', comment: 'Creating these documents is a gift of clarity for your loved ones.' }
        ]
    }
];

const questionsData_80_plus = [
  {
    question_number: 1,
    questionText: "Are you retired?",
    type: 'option',
    options: [
      { label: 'Yes, not working', comment: 'Wonderful! Let’s focus on maximizing income and minimizing stress.' },
      { label: 'No, working full-time', comment: 'Let’s prepare your retirement timeline and secure your financial future.' },
      { label: 'Working part-time', comment: 'Part-time work offers flexibility—let’s plan around this mixed income.' }
    ]
  },
  {
    question_number: 2,
    questionText: "Where do you currently live? Please be as specific as possible (Address, Zip Code, Neighborhood, City, or State)",
    type: 'text',
    options: [
         { label: '(Free Text)', comment: 'This helps tailor advice based on cost of living, taxes, and healthcare access in your area.' },
    ],
  },
  {
    question_number: 3,
    questionText: "Do you own or rent?",
    type: 'option',
    options: [
      { label: 'Own', comment: 'Owning a home gives you equity options in retirement planning.' },
      { label: 'Rent', comment: 'Renting offers flexibility—let’s look for affordable retirement locations.' },
      { label: 'Other', comment: 'Let’s understand your housing situation to build an accurate plan.' }
    ]
  },
  {
    question_number: 4,
    questionText: "What is your retirement goal today?",
    type: 'question',
    options: [
      { label: 'I am not sure; I just want to explore discreet expert retirement advice', comment: 'No worries—we’ll guide you step-by-step toward smart retirement decisions.' },
      { label: 'I am interested in finding places I can afford in retirement', comment: 'Great! We’ll help you identify affordable, retirement-friendly locations.' },
      { label: 'I am interested in knowing about money management for retirement', comment: 'Smart move—let’s ensure your money lasts as long as you do.' }
    ]
  },
  {
    question_number: 5,
    questionText: "How much have you saved for retirement so far?",
    type: 'question',
    options: [
      { label: 'Less than $100,000', comment: 'You still have time—catch-up contributions and disciplined investing can help close the gap.' },
      { label: '$100,000 – $300,000', comment: 'You’re building momentum—now is the time to fine-tune your plan and avoid large setbacks.' },
      { label: '$300,000 – $700,000', comment: "You're making strong progress—now focus on preserving and optimizing that wealth." },
      { label: 'Over $700,000', comment: 'Excellent work! Be sure your income strategy and estate planning are equally solid.' }
    ]
  },
  {
    question_number: 6,
    questionText: "Have you estimated how long your retirement savings will last?",
    type: 'question',
    options: [
      { label: 'Yes, I’ve modeled it out', comment: 'Excellent! That clarity helps you make confident decisions about retirement timing and spending.' },
      { label: 'I have a rough idea', comment: 'A good beginning—fine-tuning those numbers will increase your confidence.' },
      { label: 'No, not really', comment: 'Now is the time to get serious—consider using online tools or talking to an advisor.' },
      { label: "I don't know where to start", comment: 'No worries—there are simple calculators that can help you take the first step.' }
    ]
  },
  {
    question_number: 7,
    questionText: "Are you taking advantage of catch-up contributions in your 401(k) or IRA?",
    type: 'question',
    options: [
      { label: 'Yes, every year', comment: 'Great! Catch-up contributions can significantly boost your nest egg in this decade.' },
      { label: 'I just started', comment: 'Good move—stay consistent to maximize this opportunity.' },
      { label: 'Not yet, but planning to', comment: 'You still have time—adding even a bit more can make a big difference.' },
      { label: 'I wasn’t aware of this', comment: 'This is worth exploring—those extra contributions are designed for your stage of life.' }
    ]
  },
  {
    question_number: 8,
    questionText: "Do you plan to retire at 60, 65, 67—or work longer?",
    type: 'question',
    options: [
      { label: 'I plan to retire before 60', comment: 'Early retirement is exciting—make sure your savings can support a longer retirement.' },
      { label: 'Between 60 and 65', comment: 'That’s a common window—refining your income plan will help ease the transition.' },
      { label: 'At 67', comment: 'Delaying to full retirement age increases your Social Security benefits.' },
      { label: 'Later than 67', comment: 'Working longer can ease pressure on savings and increase your future security.' }
    ]
  },
  {
    question_number: 9,
    questionText: "Have you considered delaying Social Security for higher benefits?",
    type: 'question',
    options: [
      { label: 'Yes, I plan to delay', comment: 'Smart move—delaying can increase your monthly benefit significantly.' },
      { label: 'Maybe—I’m still deciding', comment: 'Take time to weigh the pros and cons—it depends on your income needs and health.' },
      { label: 'No, I plan to take it as early as possible', comment: 'That’s okay—just make sure you understand the long-term trade-offs.' },
      { label: 'I’m not sure how it works', comment: 'Understanding your claiming strategy is key—SSA.gov has great tools to help.' }
    ]
  },
  {
    question_number: 10,
    questionText: "Do you know your expected monthly expenses in retirement?",
    type: 'question',
    options: [
      { label: 'Yes, I’ve calculated them', comment: 'That’s excellent—knowing your budget is crucial for peace of mind.' },
      { label: 'I have an estimate', comment: 'A rough estimate is helpful, but refining it will improve your planning.' },
      { label: 'Not really', comment: 'Start tracking your current spending—it’s a helpful baseline.' },
      { label: 'I haven’t thought about it', comment: 'Creating a retirement budget now can prevent surprises later.' }
    ]
  },
  {
    question_number: 11,
    questionText: "Have you factored healthcare and Medicare premiums into your retirement budget?",
    type: 'question',
    options: [
      { label: 'Yes, fully accounted for', comment: 'Great! Healthcare is one of the biggest retirement costs.' },
      { label: 'Partially considered', comment: 'Good first step—be sure to understand Medicare Parts B, D, and supplemental options.' },
      { label: 'No, not yet', comment: 'Consider this soon—it can significantly impact your expenses.' },
      { label: 'I didn’t realize I should', comment: 'Health costs can add up—factoring them in now helps avoid financial stress later.' }
    ]
  },
  {
    question_number: 12,
    questionText: "Do you plan to downsize, relocate, or stay in your current home?",
    type: 'question',
    options: [
      { label: 'Stay in current home', comment: 'Make sure your home is affordable and accessible for your retirement years.' },
      { label: 'Downsize locally', comment: 'Downsizing can free up equity and reduce expenses.' },
      { label: 'Relocate to a new city/state', comment: 'Relocating can be a great lifestyle shift—just factor in taxes and healthcare access.' },
      { label: 'Still deciding', comment: 'Exploring options now gives you time to plan wisely and avoid rushed decisions.' }
    ]
  },
  {
    question_number: 13,
    questionText: "Are your investments too aggressive, too conservative, or appropriately balanced?",
    type: 'question',
    options: [
      { label: 'Too aggressive', comment: 'Consider dialing back risk as you approach retirement to protect your savings.' },
      { label: 'Too conservative', comment: 'You may want to shift toward more growth if your plan falls short.' },
      { label: 'Balanced for my age', comment: 'Well done—balance is key for sustainable withdrawals.' },
      { label: 'I’m not sure', comment: 'A portfolio review can give you confidence and uncover opportunities.' }
    ]
  },
  {
    question_number: 14,
    questionText: "Do you have a retirement income strategy (withdrawal plan, annuities, etc.)?",
    type: 'question',
    options: [
      { label: 'Yes, a full income plan', comment: 'Excellent—structured income planning brings predictability to retirement.' },
      { label: 'Working on it', comment: 'You’re on the right path—just make sure it aligns with your budget and goals.' },
      { label: 'Not yet', comment: 'Now is a good time to start—it can reduce your stress later.' },
      { label: 'I don’t know what that means', comment: 'This is essential—consider meeting with a planner or using retirement tools online.' }
    ]
  },
  {
    question_number: 15,
    questionText: "Have you updated or reviewed your will, trust, and beneficiary designations in the last 5 years?",
    type: 'question',
    options: [
      { label: 'Yes, recently updated', comment: 'Fantastic—your legacy planning is up to date.' },
      { label: 'Partially updated', comment: 'Good start—make sure everything aligns with your current wishes.' },
      { label: 'No, not yet', comment: 'Consider prioritizing this—it protects your family and assets.' },
      { label: 'I don’t have any of those', comment: 'Creating these documents is a gift of clarity for your loved ones.' }
    ]
  }
];

// Common prime question
const seedPrimeQuestion = async () => {
    const exists = await Question.findOne({ questionText: 'How old are you?' });

    if (!exists) {
        await Question.create({
            quiz_no:1,
            questionText: 'How old are you?',
            type: 'question',
            options: [
                { value: 'less_than_40', label: 'Less than 40', comment: 'Great! Starting early gives you the best chance to plan ahead.'},
                { value: '40_49', label: '40-49', comment: 'You’re in your prime planning years—let’s make the most of it.' },
                { value: '50_59', label: '50-59', comment: 'You’re approaching retirement age—perfect time to finalize your plan.' },
                { value: '60_65', label: '60-65', comment: 'You may already be retired or very close—let’s refine your strategy.' },
                { value: '66_79', label: '66-79', comment: 'You\'re likely enjoying retirement—let’s make sure your plan is sustainable.' },
                { value: '80+', label: '80+', comment: 'Your experience is valuable—let’s ensure comfort and legacy planning.' }
            ],
            system_greetings: [
                'Welcome to Retiremate !!',
                'I am John, your trusted advisor on retirement planning',
                'I am going to guide you over a simple conversation'
            ]
          
        });
        console.log('Seeded: "How old are you?"');
    } else {
        console.log('Skipped: "How old are you?" already exists.');
    }
};

// Group seeding function
const seedGroupedQuestions = async (value, questionsData) => {
    const exists = await QuestionsByAgeGroupModel.findOne({ value });

    if (!exists) {
        await QuestionsByAgeGroupModel.create({ value, questions: questionsData });
        console.log(`Seeded group: ${value}`);
    } else {
        console.log(`Skipped group: ${value} already exists.`);
    }
};

// Entry point
const seed = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        await seedPrimeQuestion();

        await seedGroupedQuestions('less_than_40', lessThan40Data);
        await seedGroupedQuestions('40_49', questionsData_40_49);
        await seedGroupedQuestions('50_59', questionsData_50_59);
        await seedGroupedQuestions('60_65', questionsData_60_65);
        await seedGroupedQuestions('66_79', questionsData_66_79);
        await seedGroupedQuestions('80+', questionsData_80_plus);

        console.log(' All seeding completed successfully.');
    } catch (error) {
        console.error(' Error during seeding:', error);
    } finally {
        mongoose.connection.close();
    }
};

seed();
