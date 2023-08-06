const {
  GetAllTodoes,
  NewTodo,
  UpdateById,
  DeleteById,
  GetCount,
  TodoType,
} = require("../controllers/todoItemController");

const router = require("express").Router();

router.get("/", GetAllTodoes);
router.get("/type", TodoType);
router.get("/count", GetCount);
router.post("/new", NewTodo);
router.put("/:id", UpdateById);
router.delete("/:id", DeleteById);

module.exports = { todoRouter: router };
