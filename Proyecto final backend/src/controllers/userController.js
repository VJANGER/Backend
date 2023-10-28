const User = require('../models/userModel');

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