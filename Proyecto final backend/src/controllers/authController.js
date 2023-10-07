const ResetToken = require('../models/resetTokenModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { sendResetEmail } = require('../services/emailService');
const User = require('../models/userModel');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const sendEmail = require('../utils/sendEmail');

const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const setPasswordResetFields = (user) => {
  const token = generatePasswordResetToken();
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora de expiración
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    setPasswordResetFields(user);
    await user.save();

    const resetURL = `http://tu-sitio-web.com/reset-password/${user.resetPasswordToken}`;

    const message = `Recibiste este correo porque solicitaste un restablecimiento de contraseña para tu cuenta. Haz clic en el siguiente enlace para continuar:\n\n${resetURL}\n\n`;
    await sendEmail({
      email: user.email,
      subject: 'Solicitud de Restablecimiento de Contraseña',
      message,
    });

    return res.json({ message: 'Correo de restablecimiento de contraseña enviado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al solicitar el restablecimiento de contraseña' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'El token es inválido o ha expirado' });
    }

    const hashedPassword = await promisify(bcrypt.hash)(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
};



function generateResetToken(user) {
  const secretKey = 'tuclaveprivada';
  const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
  return token;
}


exports.requestPasswordReset = async (req, res) => {
  try {
    const email = req.body.email;
    const resetToken = generateResetToken(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al solicitar el restablecimiento de contraseña.' });
  }
};


exports.requestPasswordReset = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const token = generateResetToken();

    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    const resetToken = new ResetToken({
      user: user._id,
      token,
      expires,
    });

    await resetToken.save();

    await sendResetEmail(user.email, token);

    res.json({ message: 'Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al solicitar el restablecimiento de contraseña.' });
  }
};

exports.resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      const resetToken = await ResetToken.findOne({ token });

      if (!resetToken) {
        return res.status(404).json({ error: 'Token no válido.' });
      }
        if (resetToken.expires < new Date()) {
        return res.status(400).json({ error: 'El token ha expirado.' });
      }

      const user = await User.findById(resetToken.user);

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
      user.password = newPassword;
      await user.save();
      await resetToken.remove();

      res.json({ message: 'Contraseña restablecida con éxito.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al restablecer la contraseña.' });
    }
  };
