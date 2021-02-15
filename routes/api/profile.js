const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route GET api/profile/me
// @desc Obtener el perfil de los usuarios actuales
// @access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name']);

    if (!profile) {
      return res.status(400).json({ msg: 'No hay perfil para este usuario' });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

// @route POST api/profile
// @desc Crear o actualizar el perfil del usuario
// @access Private
router.post(
  '/',
  auth,
  check('status', 'El estado es necesario').notEmpty(),
  check('skills', 'Se requieren habilidades').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Desestructurar la peticion
    const {
      website,
      skills,
      twitter,
      instagram,
      facebook,
      // Se extiende el resto de los campos que no necesitamos comprobar
      ...rest
    } = req.body;

    // Construir un perfil
    const profileFields = {
      user: req.user.id,
      website:
        website && website !== ''
          ? normalize(website, { forceHttps: true })
          : '',
      skills: Array.isArray(skills)
        ? skills
        : skills.split(',').map((skill) => ' ' + skill.trim()),
      ...rest,
    };

    // Build socialFields object
    const socialFields = { twitter, instagram, facebook };

    // Normalizar los campos sociales para garantizar una url válida
    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0)
        socialFields[key] = normalize(value, { forceHttps: true });
    }

    // Añadir a los campos del perfil
    profileFields.social = socialFields;

    try {
      // Usando la opción upsert (crea un nuevo documento si no se encuentra ninguna coincidencia)
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json(profile);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send('Error del servidor');
    }
  }
);

module.exports = router;
