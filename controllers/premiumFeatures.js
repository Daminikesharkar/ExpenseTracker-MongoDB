const User = require('../models/user');
const Expense = require('../models/expense');
const Downloads = require('../models/download');

const awsservice = require('../services/awsservice');

/* SELECT users.username, SUM(expenses.amount) as total_expenses 
FROM users
JOIN expenses ON users.id = expenses.userId
GROUP BY users.id ORDER BY total_expenses desc; */


// exports.showLeaderboard = (req,res)=>{
//     Users.findAll({
//         attributes: [
//           'id',
//           'username',
//           [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'total_expenses']
//         ],
//         include: [
//           {
//             model: Expense,
//             attributes: []
//           }
//         ],
//         group: ['users.id', 'expenses.userId'],
//         order: sequelize.literal('total_expenses DESC')
//       })

//       .then(users => {
//         const userData = users.map(user => ({
//             id: user.id,
//             username: user.username,
//             total_expenses: user.get('total_expenses')
//           }));
//           console.log(userData);
//           return res.json({userData: userData});
//       })
//       .catch(error => {
//         console.error(error);
//       });
// }
exports.showLeaderboard = async (req, res) => {
    try {
        const users = await User.find({})
        .select('id username totalExpense')
        .sort({ totalExpense: -1 })
        .limit(10);

        const userData = users.map(user => ({
            id: user._id,
            username: user.username,
            total_expenses: user.totalExpense
        }));

        return res.json({ userData: userData });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.downloadFile = async(req,res)=>{
  try {
      const products = await Expense.find({userId: req.user._id,});
           
      const stringifiedProducts = JSON.stringify(products);
      const filename = `Products${req.user._id}/${new Date()}.txt`;

      const fileurl = await awsservice.uploadToS3(stringifiedProducts,filename);

      const newUrl = await Downloads.create({
          downloadUrl:fileurl,
          userId:req.user._id
      })

      return res.status(200).json({
          fileurl: fileurl,
      })

  } catch (error) {
      res.status(500).json({fileurl: '',error: 'Error getting all products'});
  }    
}

exports.downloadedHistory = async (req,res)=>{
  try {
      const history = await Downloads.find({userId:req.user._id});

      return res.status(200).json({
          history: history
      })
      
  } catch (error) {
      res.status(500).json({error: 'Error getting all products'});
  }
}