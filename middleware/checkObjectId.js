const mongoose = require('mongoose');
// Middleware para comprobar si ID del objeto es válido
const checkObjectId = (idToCheck) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck]))
    return res.status(400).json({ msg: 'ID no valido' });
  next();
};

module.exports = checkObjectId;
