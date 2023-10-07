const User = require('../models/userModel');

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
