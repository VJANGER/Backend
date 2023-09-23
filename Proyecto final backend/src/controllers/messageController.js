import MessageModel from '../dao/models/messageModel.js';
import { io } from '../app.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find();
    res.json({ status: 'success', payload: messages });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const addMessage = async (req, res) => {
  try {
    const { author, text } = req.body;

    const newMessage = await MessageModel.create({ author, text });

    io.emit('newMessage', newMessage);

    res.json({ status: 'success', payload: newMessage });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
