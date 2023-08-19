const jwt = require('jsonwebtoken');

//authentication middleware
const TokenMiddleware = async (req, res, next) => {
  let token = req.headers['authorization'];

  if (token && token.startsWith('Bearer ')) {
    try {
      token = token.split(" ")[1];

      if (token === process.env.Secure_token) {
        next();
      } else {
        return res.status(403).json({
          message: "Unauthorized Request!!"
        })
      }

    }
    catch (err) {
      return res.status(401).json({
        message: 'Invalid token'
      });
    }
  } else {
    return res.status(401).json({
      message: 'No token provided'
    });
  }
}

module.exports = TokenMiddleware;