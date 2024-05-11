const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    paymentId: {
        type: String
    },
    orderId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Order',Order);


// const sequelize = require('../util/database');
// const Sequelize = require('sequelize');

// const Order = sequelize.define('orders',{
//     id:{
//         type:Sequelize.INTEGER,
//         allownull:false,
//         autoIncrement:true,
//         primaryKey:true
//     },
//     paymentId:{
//         type:Sequelize.STRING,
//         allownull:true,
//     },
//     orderId:{
//         type:Sequelize.STRING,
//         allownull:false,
//     },
//     status:{
//         type:Sequelize.STRING,
//         allownull:false,
//     }
// });

// module.exports = Order;