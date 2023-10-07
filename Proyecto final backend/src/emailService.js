const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'tucorreo@gmail.com',
    pass: 'tucontraseña',
  },
});

module.exports = {
  sendResetEmail: async (toEmail, token) => {
    const mailOptions = {
      from: 'tucorreo@gmail.com',
      to: toEmail,
      subject: 'Recuperación de contraseña',
      text: `Haga clic en el siguiente enlace para restablecer su contraseña: http://localhost:3000/reset-password?token=${token}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Correo electrónico de restablecimiento enviado a: ${toEmail}`);
    } catch (error) {
      console.error(`Error al enviar el correo electrónico de restablecimiento: ${error.message}`);
    }
  },
};
