const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const Expense = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    amount: {
        type:Number,
        required: true
    },
    description: {
        type:String,
        required: true
    },
    category: {
        type:String,
        required: true
    }

});

module.exports = mongoose.model('Expenses',Expense);


// const sequelize = require('../util/database');
// const Sequelize = require('sequelize');

// const Expense = sequelize.define('expense',{
//     id:{
//         type:Sequelize.INTEGER,
//         allownull:false,
//         autoIncrement:true,
//         primaryKey:true
//     },
//     amount:{
//         type:Sequelize.INTEGER,
//         allownull:false,
//     },
//     description:{
//         type:Sequelize.STRING,
//         allownull:false,
//     },
//     category:{
//         type:Sequelize.STRING,
//         allownull:false,
//     }
// });

// module.exports = Expense;