const UserModel = require('../models/userModel');

exports.editUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await UserModel.findById(userId);
        res.render('editUserView', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving user for editing');
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const { name, email, role } = req.body;
        await UserModel.findByIdAndUpdate(userId, { name, email, role });
        res.redirect('/admin/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user');
    }
};
