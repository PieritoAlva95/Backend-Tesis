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
    check('names', 'Los nombres son requeridos').not().isEmpty(),
    check('lastNames', 'Los apellidos son requeridos').not().isEmpty(),
    check('isAdmin', 'El atributo es necesario').not().isEmpty(),
    check('mobileNumber', 'El numero de telefono es requerido')
      .not()
      .isEmpty()
      .isLength({ min: 10, max: 10 }),
    check('identityDocument', 'La cedula es requerida')
      .not()
      .isEmpty()
      .isLength({ min: 10, max: 10 }),
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

    const {
      names,
      lastNames,
      identityDocument,
      mobileNumber,
      email,
      password,
      isAdmin,
    } = req.body

    try {
      // Ver si el usuario existe
      let user = await User.findOne({ email })

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'El usuario ya existe' }] })
      }

      user = new User({
        names,
        lastNames,
        identityDocument,
        mobileNumber,
        email,
        password,
        isAdmin,
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
