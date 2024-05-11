const express = require('express');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const mongoose = require('mongoose');

require('dotenv').config();


const mainRoutes = require('./routes/main');
const premiumRoutes = require('./routes/premium');
const resetPasswordRoutes = require('./routes/password');
// const sequelize = require('./util/database');

// const User = require('./models/user');
// const Expense = require('./models/expense');
// const Order = require('./models/order');
// const Downloads = require('./models/download');
// const forgetpassword = require('./models/password');

const app = express();

const accessLogStream = fs.createWriteStream('access.log', { flags: 'a' });
app.use(morgan(':method :url :status :response-time ms', { stream: accessLogStream }));

app.use(express.urlencoded({extended: false }));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());

// User.hasMany(Expense);
// Expense.belongsTo(User,{constraints:true, onDelete:'CASCADE'});

// User.hasMany(Order);
// Order.belongsTo(User,{constraints:true, onDelete:'CASCADE'})

// User.hasMany(Downloads);
// Downloads.belongsTo(User,{constraints:true, onDelete:'CASCADE'});

// User.hasMany(forgetpassword);
// forgetpassword.belongsTo(User,{constraints:true, onDelete:'CASCADE'});

// sequelize.sync({ alter: true })
// sequelize.sync();

app.use(mainRoutes);
app.use(premiumRoutes);
app.use(resetPasswordRoutes);

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.0epflzs.mongodb.net/expensetracker?retryWrites=true&w=majority&appName=Cluster0`)
    .then(()=>{
        app.listen(process.env.Port || 3000,()=>{
            console.log(`server is live on port ${process.env.Port}`);
        })
    })
    .catch((error)=>{
        console.log('Failed to connect to the server',error);
    })
