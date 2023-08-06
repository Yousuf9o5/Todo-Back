const response = require("../utils/util");
const todoItems = require("../models/todoItems");
const DataValidator = require("../utils/Validator");

async function GetAllTodoes(req, res) {
  try {
    const { completed, important, email } = req.query;
    let data;

    if ((completed && important) != undefined) {
      data = await todoItems.find({ completed, important, for: email });
      return res.status(200).json(response(200, "Done", data));
    }
    data = await todoItems.find({ for: email, completed: false });

    return res.status(200).json(response(200, "Done", data));
  } catch (err) {
    return res.status(500).json(response(500, "Server Side Error"));
  }
}

async function TodoType(req, res) {
  try {
    const data = await todoItems.find({
      ItemType: req.query.type,
      for: req.query.email,
    });

    return res.status(200).json(response(200, `Done`, data));
  } catch (err) {
    return res.status(500).json(response(500, "Server Side Error"));
  }
}

async function NewTodo(req, res) {
  try {
    let email = req.query.email;
    let { title, date, important, folder, type } = req.body;
    if (!DataValidator(title, date)) {
      return res.status(400).json(response(400, "Invalid Data"));
    }

    console.log(req.body);

    const dateChecker = () => {
      let today = new Date(Date.now());
      let comingDate = date.split("-");
      let splitToday = [
        today.getFullYear(),
        today.getMonth() + 1,
        today.getUTCDate(),
      ];

      return splitToday.every((item, i) => {
        return item > comingDate[i] ? true : false;
      });
    };

    if (dateChecker()) {
      return res.status(400).json(response(400, "Invalid Date"));
    }

    const newItem = new todoItems({
      title,
      date: date,
      important: important || false,
      ItemType: type || null,
      folder: folder || null,
      for: email,
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
      if (!date) {
        return;
      }
      let newDate = date.split("-");
      newDate[2] = (1 + +newDate[2]).toString();
      return newDate.join("-");
    };

    item.title = title || item.title;
    item.date = formattedDate() || item.date;
    item.important = important === undefined ? item.important : important;
    item.completed = completed === undefined ? item.completed : completed;
    item.folder = folder || item.folder;

    await item.save();

    return res.status(200).json(response(200, "Updated", true));
  } catch (err) {
    console.log(err);
    return res.status(500).json(response(500, "Server Side Error"));
  }
}

async function GetCount(req, res) {
  try {
    const completed = await todoItems.countDocuments({ completed: "true" });
    const important = await todoItems.countDocuments({ important: "true" });
    const task = await todoItems.countDocuments({ ItemType: "task" });
    const plan = await todoItems.countDocuments({ ItemType: "plan" });

    return res
      .status(200)
      .json(response(200, "Done", { completed, important, task, plan }));
  } catch (err) {
    console.log(err);
    return res.status(500).json(response(500, "Server Side Error"));
  }
}

async function DeleteById(req, res) {
  try {
    await todoItems.deleteOne({ _id: req.params.id });
    return res.status(200).json(response(200, "Deleted", true));
  } catch (err) {
    console.log(err);
    return res.status(500).json(response(500, "Server Side Error"));
  }
}

module.exports = {
  GetAllTodoes,
  NewTodo,
  UpdateById,
  TodoType,
  DeleteById,
  GetCount,
};
