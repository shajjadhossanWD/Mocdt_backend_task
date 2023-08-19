const User = require("../Model/UserSignUpSignInModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.SignUp = async (req, res) => {
  const email = await User.findOne({ email: req.body.email });

  console.log(email)

  if (email) {
    return res.status(400).json({
      message: "Email  already used!!",
    });
  } else {
      const data = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        imapPassword: req.body.imapPassword,
      });
      const result = await data.save();
      const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET, {
        expiresIn: "72h",
      });

      return res.status(200).json({
        message: "Signup Successfully!",
        token: token,
        result: result,
      });
   
  }
};


exports.SignIn = async (req, res) => {
  const email = await User.findOne({ email: req.body.email });

  if (email) {
    const matchPassword = await email.matchPassword(req.body.password);

    if (matchPassword) {
      const token = jwt.sign({ _id: email._id }, process.env.JWT_SECRET, {
        expiresIn: "72h",
      });
      return res.status(200).json({
        message: "Signin Successfull!",
        token: token,
        result: {
          email: req.body.email,
          password: req.body.password,
        },
      });
    } else {
      return res.status(400).json({
        message: "Invalid Password!",
      });
    }
  } else {
    return res.status(400).json({
      message: "Email does not exists, Please signup first!",
    });
  }
};


exports.GetAllData = async (req, res) => {
  const data = await User.find({});

  return res.status(200).json({
    message: "All list token User!!",
    result: data,
  });
};


exports.deleteById = async (req, res) => {
  const data = await User.findById(req.params.id);
  const result = await data.remove();
  return res.status(200).json({
    message: "Deleted",
    result: result,
  });
};



exports.currentUserGet = async (req, res) => {
  try {
    const data = await User.findById(req.user.id);
    console.log(data)
    return res.status(200).json({
      message: "Get Current User!!",
      result: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

exports.updateImapPassword = async (req, res) => {
  try {
    const userId = req.user.id; 

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.imapPassword = req.body.imapPassword;

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "IMAP password updated successfully",
      result: updatedUser,
    });
  } catch (error) {
    console.error("Error updating IMAP password:", error);
    return res.status(500).json({
      message: "An error occurred while updating IMAP password",
    });
  }
};



 


