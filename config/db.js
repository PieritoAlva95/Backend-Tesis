const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    console.log(`(MongoDB) Base de datos conectada...`.cyan.underline)
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold)
    // Proceso de salida con fracaso.
    process.exit(1)
  }
}

module.exports = connectDB
