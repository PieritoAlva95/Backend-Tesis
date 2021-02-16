const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('(MongoDB) Base de datos conectada...');
  } catch (error) {
    console.error(error.message);
    // Proceso de salida con fracaso.
    process.exit(1);
  }
};

module.exports = connectDB;
