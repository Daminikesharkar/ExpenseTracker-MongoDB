const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Downloads = new Schema({
  downloadUrl: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
});

module.exports = mongoose.model("Downloads", Downloads);


// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Downloads = sequelize.define('downloads',{
//     id: {
//         type :Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull:false
//     },
//     downloadUrl:{
//         type: Sequelize.STRING(),
//         unique:true,
//         validate:{isUrl:true},
//         notEmpty:true,
//         allowNull: false,
//     }
// })
// module.exports=Downloads;