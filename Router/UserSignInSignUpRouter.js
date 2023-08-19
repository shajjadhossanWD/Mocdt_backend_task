const router = require("express").Router();

const { 
    SignUp, 
    SignIn, 
    GetAllData, 
    deleteById, 
    currentUserGet, 
    updateImapPassword
    } = require("../Controller/UserSignUpSigninController");

const auth = require("../Middleware/SignUpSignInMiddleware");
const secureToken = require("../Middleware/SignUpSignInMiddleware");

router.post("/signup", SignUp);
router.post("/signin", SignIn);
router.get('/',secureToken, GetAllData);
router.put("/update-imap-password", auth, updateImapPassword);
router.delete('/:id',secureToken, deleteById);
router.get('/current-user', auth, currentUserGet);

module.exports = router;