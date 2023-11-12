const User = require('../models/userModel');
const { sendInactiveUserEmail } = require('../utils/email');
const handlebars = require('express-handlebars');
const multer = require('multer');
const path = require('path');

exports.updateDocuments = async (req, res) => {
  try {
    const user = await User.findById(req.params.uid);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user.documents.length < 3) {
      return res.status(400).json({ message: 'Debes cargar los 3 documentos requeridos' });
    }

    user.role = 'premium';

    await user.save();

    res.status(200).json({ message: 'Usuario actualizado a premium' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
exports.uploadDocument = async (req, res) => {
  const userId = req.params.uid;
  const { originalname, filename } = req.file;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.documents.push({
      name: originalname,
      reference: filename,
    });

    await user.save();

    res.status(201).json({ message: 'Documento subido con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al subir el documento' });
  }
};
exports.uploadDocuments = async (req, res) => {
  try {
    const userId = req.params.uid;
    const documents = req.files.map(file => ({
      name: file.originalname,
      reference: file.path,
    }));

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          status: 'document_uploaded',
          documents: documents,
        },
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar documentos');
  }
};
exports.changeUserRole = async (req, res) => {
  try {
    const userId = req.params.uid;
    const newRole = req.body.role;


    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    user.role = newRole;
    await user.save();

    res.json({ message: 'Rol de usuario actualizado con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el rol del usuario.' });
  }
};
exports.changeUserRole = async (req, res) => {
  try {
    const userId = req.params.uid;
    const newRole = req.body.role;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (req.user.role === 'admin') {
      user.role = newRole;
      await user.save();
      return res.json({ message: 'Rol de usuario actualizado correctamente' });
    } else {
      return res.status(403).json({ error: 'No tienes permiso para cambiar el rol de este usuario' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al cambiar el rol del usuario' });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, 'nombre correo rol');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener usuarios');
  }
};
exports.deleteInactiveUsers = async (req, res) => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const result = await UserModel.deleteMany({ last_connection: { $lt: twoDaysAgo } });
    const deletedUsers = result.deletedCount;
    if (deletedUsers > 0) {
      const inactiveUsers = await UserModel.find({
        last_connection: { $lt: twoDaysAgo },
      });
      inactiveUsers.forEach(user => {
        sendInactiveUserEmail(user.email);
      });
    }

    res.json({ message: `${deletedUsers} usuarios eliminados por inactividad` });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar usuarios inactivos');
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, 'name email role');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener usuarios');
  }
};
exports.deleteInactiveUsers = async (req, res) => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    await UserModel.deleteMany({ last_connection: { $lt: twoDaysAgo } });

    res.send('Usuarios inactivos eliminados');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar usuarios inactivos');
  }
};
exports.adminView = async (req, res) => {
  try {
    const users = await UserModel.find({}, 'name email role');
    res.render('admin-view', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la vista de administración');
  }
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = file.fieldname === 'profileImage' ? 'profiles' : 'documents';
    cb(null, `uploads/${fileType}`);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.uploadDocuments = upload.array('documents', 5);

exports.updateUserDocuments = async (req, res) => {
  try {
    const userId = req.params.uid;
    const documents = req.files.map(file => ({
      name: file.originalname,
      reference: `/uploads/documents/${file.filename}`,
    }));

    await UserModel.findByIdAndUpdate(userId, { $push: { documents } });

    res.status(200).send('Documentos subidos exitosamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al subir documentos');
  }
};