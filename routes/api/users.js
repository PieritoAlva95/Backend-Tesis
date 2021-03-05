const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')

// @route POST api/users
// @desc Ruta para registrar usuario
// @access Public
router.post(
  '/',
  [
    check('name', 'El nombre es requerido').not().isEmpty(),
    check('email', 'Por favor, incluya un correo electrónico válido').isEmail(),
    check(
      'password',
      'Por favor, introduzca una contraseña con 6 o más caracteres'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      // Ver si el usuario existe
      let user = await User.findOne({ email })

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'El usuario ya existe' }] })
      }

      user = new User({
        name,
        email,
        password,
      })

      // Cifrar la contraseña
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)

      // Guardar el usuario en la base de datos
      await user.save()

      // Devolver jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (error) {
      console.error(error.message)
      res.status(500).send('Error del servidor')
    }
  }
)

module.exports = router
