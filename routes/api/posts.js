const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');

const Post = require('../../models/Post');
const User = require('../../models/User');

// @route POST api/posts
// @desc Crear un post
// @access Private
router.post(
  '/',
  auth,
  check('text', 'El texto es obligatorio').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error del servidor');
    }
  }
);

// @route GET api/posts
// @desc Obtener todos los Posts
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

// @route GET api/posts/:id
// @desc Obtener el post por ID
// @access Private
router.get('/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post no encontrado' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route DELETE api/posts/:id
// @desc Borrar un Post por el ID
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post no encontrado' });
    }

    // Comprobar usuario
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Usuario no autorizado' });
    }

    await post.remove();

    res.json({ msg: 'Post eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route PUT api/posts/like/:id
// @desc Agregar interesados en el post
// @access Private
router.put('/like/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Comprobar si ya se ha agregado al intteresado
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Ya se agrego al usuario' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    return res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// @route PUT api/posts/unlike/:id
// @desc Quitar interesados en el post
// @access Private
router.put('/unlike/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Comprobar si el usuario ha sido agrgado
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res
        .status(400)
        .json({ msg: 'El usuario aun no ha sido agregado' });
    }

    // Quitar el usuario interesado
    post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
