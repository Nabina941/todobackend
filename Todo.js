const express = require('express');
const Todo = require('../models/Todo');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const todo = new Todo({ user: req.userId, title, description, dueDate });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, description, dueDate },
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
