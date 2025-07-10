const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const todo = new Todo({ ...req.body, userId: req.user._id });
  await todo.save();
  res.status(201).json(todo);
});

router.get('/', auth, async (req, res) => {
  const todos = await Todo.find({ userId: req.user._id });
  res.json(todos);
});

router.put('/:id', auth, async (req, res) => {
  const updated = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );
  res.json(updated);
});

router.delete('/:id', auth, async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id, userId: req.user._id });
  res.sendStatus(204);
});

module.exports = router;
