const mongoose = require("mongoose");

const GoogleAccount = mongoose.Schema({
  googleID: {
    type: String,
    unique: true,
  },
  fullname: String,
  email: {
    type: String,
    unique: true,
  },
  profilePic: String,
  todoes: {
    type: Array,
    default: [],
  },
  folders: {
    type: Array,
    default: [],
  },
  token: String,
});

module.exports = mongoose.model("google-account", GoogleAccount);
