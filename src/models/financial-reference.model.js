const mongoose = require('mongoose')

const financialReferenceSchema = new mongoose.Schema({
    document:{type:String,enum:['financial_reference']},
    saving_growth_rate_percent:{type:Number,default:10},
    salary_growth_rate_percent:{type:Number, default:2.5},
    retirement_age:{type:Number,default:67},
    annual_saving_rate_percent:{type:Number,default:10}
},{timestamps:true})

const FinancialReferenceModel = mongoose.model('financial_reference',financialReferenceSchema)

module.exports = FinancialReferenceModel