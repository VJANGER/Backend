import UserModel from '../models/userModel.js';

export const registerUser = async (req, res) => {
  try {
    const newUser = await UserModel.create(req.body);

    res.redirect('/login');
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    req.session.user = user;

    res.redirect('/products');
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy();

  res.redirect('/login');
};
