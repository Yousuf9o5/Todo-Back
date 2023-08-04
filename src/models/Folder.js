const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TodoItem = new Schema(
  {
    title: String,
    todoes: {
      type: Array,
      default: [],
    },
  },
  { strict: true, timestamps: true }
);

module.exports = mongoose.model("todoItem", TodoItem);
