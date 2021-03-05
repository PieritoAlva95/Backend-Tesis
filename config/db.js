const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    console.log('(MongoDB) Base de datos conectada...')
  } catch (error) {
    console.error(error.message)
    // Proceso de salida con fracaso.
    process.exit(1)
  }
}

module.exports = connectDB
