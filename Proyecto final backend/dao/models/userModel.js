import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  role: { type: String, default: 'usuario' }, // Rol por defecto 'usuario'
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
