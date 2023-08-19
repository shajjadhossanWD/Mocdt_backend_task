const jwt = require('jsonwebtoken');
const LoginUser = require('../Model/UserSignUpSignInModel');

//authentication middleware
const UserMiddleware = async (req, res, next) => {
  let token = req.headers['authorization'];

  if (token && token.startsWith('Bearer ')) {
    try {
      token = token.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET); //verify token
      console.log(decoded);
      //check if user still exists
      const id = decoded._id || decoded.id;
      req.user = await LoginUser.findById(id);
      console.log(req.user);
      next();
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

module.exports = UserMiddleware;