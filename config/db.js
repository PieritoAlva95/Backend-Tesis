const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('(MongoDB) Base de datos conectada...');
  } catch (err) {
    console.error(err.message);
    // Proceso de salida con fracaso.
    process.exit(1);
  }
};

module.exports = connectDB;
