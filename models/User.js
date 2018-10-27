const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  verifyCode: {
    type: Number,
    required: true
  },
  confirmed: {
    type: Boolean,
    default: false
  }
});

module.exports = User = mongoose.model("users", UserSchema);
