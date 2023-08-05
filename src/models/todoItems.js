const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TodoItem = new Schema(
  {
    title: String,
    date: {
      type: String,
      required: true,
    },
    ItemType: {
      type: String,
      enum: ["plan", "task", null],
      default: null,
    },
    important: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    completed: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    for: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("todoItem", TodoItem);
