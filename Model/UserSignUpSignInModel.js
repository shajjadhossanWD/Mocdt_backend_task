const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const UserSignUpSignInSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
    imapPassword: {
      type: String
    },
  },
  {
    timestamps: true,
  }
);

UserSignUpSignInSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSignUpSignInSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  if (!this.password) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const model = mongoose.model("UserSignUpSignin", UserSignUpSignInSchema);
module.exports = model;
