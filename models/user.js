const mongoose = require("mongoose");

const UserShema = new mongoose.Schema({
  photo: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "Introduce yourself, describe what genre of books you love",
  },
  password: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("User", UserShema);

module.exports = User;
