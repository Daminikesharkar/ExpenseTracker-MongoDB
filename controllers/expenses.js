const Expense = require('../models/expense');
const User = require('../models/user');

exports.showExpensePage = (req,res)=>{
    res.sendFile('addExpense.html', { root: 'views' });
}

exports.getExpense = async (req,res)=>{
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = 2;

    try {
        const totalItems = await Expense.countDocuments({ userId: req.user._id });
        
        const expenses = await Expense.find({userId: req.user._id})
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
        
        return res.status(200).json({
            expenses: expenses,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    } catch (error) {
        res.status(500).json({ error: 'Error getting all products' });
    }
}

exports.addExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body;

        const createdExpense = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user._id
        });

        if (createdExpense) {

            const total_expenses = Number(req.user.totalExpense) + Number(amount);
            await User.findOneAndUpdate({_id:req.user._id},{totalExpense:total_expenses},{new : true});
            // await User.updateOne({ totalExpense: total_expenses }, { _id: req.user._id });

            return res.status(200).json({
                message: 'Expense added successfully',
                expense: createdExpense
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const id = req.params.id;
        const expense = await Expense.findByIdAndDelete(id);

        const newTotalExpense = Number(req.user.totalExpense) - Number(expense.amount);
        await User.update({ totalExpense: newTotalExpense }, { id: req.user._id });

        return res.json({ message: 'Expense deleted successfully', totalExpense: newTotalExpense });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting expense' });
    }
};
