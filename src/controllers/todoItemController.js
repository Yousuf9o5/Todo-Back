const response = require("../utils/util");
const todoItems = require("../models/todoItems");
const DataValidator = require("../utils/Validator");

async function GetAllTodoes(req, res) {
  try {
    const { completed, important } = req.query;
    let data;

    if ((completed && important) != undefined) {
      data = await todoItems.find({ completed, important });
      return res.status(200).json(response(200, "Done", data));
    }
    data = await todoItems.find();

    return res.status(200).json(response(200, "Done", data));
  } catch (err) {
    return res.status(500).json(response(500, "Server Side Error"));
  }
}

async function TodoType(req, res) {
  try {
    const data = await todoItems.find({
      ItemType: req.query.type,
    });

    return res.status(200).json(response(200, "Done", data));
  } catch (err) {
    return res.status(500).json(response(500, "Server Side Error"));
  }
}

async function NewTodo(req, res) {
  try {
    let { title, date, important, folder } = req.body;

    if (!DataValidator(title, date)) {
      return res.status(400).json(response(400, "Invalid Data"));
    }

    if (new Date(date).getTime() < Date.now()) {
      return res.status(400).json(response(400, "Invalid Date"));
    }
    console.log(date);
    let formattedDate = () => {
      let newDate = date.split("-");
      newDate[2] = (1 + +newDate[2]).toString();
      return newDate.join("-");
    };

    const newItem = new todoItems({
      title,
      date: formattedDate(),
      important: important || false,
      folder: folder || null,
    });

    await newItem.save();

    return res.status(201).json(response(201, "Created", true));
  } catch (err) {
    console.log(err);
    return res.status(500).json(response(500, "Server Side Error"));
  }
}

async function UpdateById(req, res) {
  try {
    let { title, date, important, completed, folder } = req.body;

    let item = await todoItems.findById(req.params.id);
    if (!item) {
      return res.status(404).json(response(404, "Not Found"));
    }

    if (new Date(date).getTime() < Date.now()) {
      return res.status(400).json(response(400, "Invalid Date"));
    }

    let formattedDate = () => {
      let newDate = date.split("-");
      newDate[2] = (1 + +newDate[2]).toString();
      return newDate.join("-");
    };

    item.title = title || item.title;
    item.date = formattedDate() || item.date;
    item.important = important === undefined ? item.important : important;
    item.completed = completed === undefined ? item.completed : completed;
    item.folder = folder || item.folder;

    console.log(item);

    await item.save();

    return res.status(200).json(response(200, "Updated", true));
  } catch (err) {
    console.log(err);
    return res.status(500).json(response(500, "Server Side Error"));
  }
}

async function DeleteById() {
  try {
    await todoItems.findByIdAndDelete(req.params.id);
    return res.status(200).json(response(200, "Deleted", true));
  } catch (err) {
    return res.status(500).json(response(500, "Server Side Error"));
  }
}

module.exports = {
  GetAllTodoes,
  NewTodo,
  UpdateById,
  TodoType,
};
