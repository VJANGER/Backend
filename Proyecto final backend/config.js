require('dotenv').config();

module.exports = {
  dbUri: process.env.DB_URI,
  secretKey: process.env.SECRET_KEY
};
