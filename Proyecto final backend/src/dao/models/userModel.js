import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  documents: [documentSchema],
  last_connection: {type: Date, default: Date.now},
});

const UserModel = mongoose.model('User', userSchema);

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reference: { type: String, required: true },
});

export default UserModel;