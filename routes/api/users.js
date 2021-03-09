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
    check('names').not().isEmpty(),
    check('lastNames').not().isEmpty(),
    check('mobileNumber').not().isEmpty().isLength({ min: 10, max: 10 }),
    check('identityDocument').not().isEmpty().isLength({ min: 10, max: 10 }),
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ msg: 'Los datos ingresados no son validos' })
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
        return res.status(400).json({ msg: 'El usuario ya existe' })
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
          res.json({
            _id: user._id,
            names: user.names,
            lastNames: user.lastNames,
            email: user.email,
            isAdmin: user.isAdmin,
            token: token,
          })
        }
      )
    } catch (error) {
      console.error(error.message)
      res.status(500).send({ msg: 'Error del servidor' })
    }
  }
)

module.exports = router
