const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const authController = require('../controllers/authController');



router.post('/forgot-password', async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: 'tu_correo@gmail.com', 
        pass: 'tu_contraseña', 
      },
    });

    const mailOptions = {
      from: 'tu_correo@gmail.com', 
      to: req.body.email, 
      subject: 'Recuperación de Contraseña',
      text: `Hola,\n\nPara restablecer tu contraseña, haz clic en el siguiente enlace: \n\n${token}\n\nEl enlace expirará en 1 hora.\n\nSi no solicitaste esta recuperación, puedes ignorar este correo.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un problema al enviar el correo de recuperación de contraseña.' });
  }
});

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);


module.exports = router;
