import Todo from "../modules/Todo.module.js";
import errorHandler from "../utils/Error.js";

export const createTodo = async (req, res, next) => {
  try {
    const createdTodo = await Todo.create(req.body);
    return res.status(201).json(createdTodo);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return next(errorHandler(403, "Todo not found"));
    }

    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return next(errorHandler(403, "Todo not found"));
    }

    const deleted = await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json(deleted);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
export const findTodo = async (req, res, next) => {
  try {
    const todos = await Todo.find({ userRef: req.params.id });
    if (!todos || todos.length === 0) {
      return next(errorHandler(404, "You don't have any todos"));
    }

    res.status(200).json(todos);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
