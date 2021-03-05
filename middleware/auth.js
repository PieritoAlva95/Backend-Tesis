const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  // Obtener el token de la cabecera
  const token = req.header('x-auth-token')

  // Comprobar si no hay token
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' })
  }

  //Verificar el token
  try {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'El token no es válido' })
      } else {
        req.user = decoded.user
        next()
      }
    })
  } catch (error) {
    console.error('Algo salio mal con el middleware de autentificación')
    res.status(500).json({ msg: 'Error del servidor' })
  }
}
