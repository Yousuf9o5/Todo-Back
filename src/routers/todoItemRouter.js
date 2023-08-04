const {
  GetAllTodoes,
  NewTodo,
  UpdateById,
} = require("../controllers/todoItemController");

const router = require("express").Router();

router.get("/", GetAllTodoes);
router.post("/new", NewTodo);
router.put("/:id", UpdateById);

module.exports = { todoRouter: router };
