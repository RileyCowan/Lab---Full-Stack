var express = require('express');
var router = express.Router();
const db = require('../bin/db');

// Show all tasks
router.get('/', async function(req, res, next) {
  const [rows] = await db.query("SELECT * FROM tasks ORDER BY id DESC");
  res.render('index', { title: 'Task List', tasks: rows });
});

// Add new task
router.post('/add', async function(req, res, next) {
  const task = req.body.task;

  if (!task || task.trim() === "") {
    return res.redirect('/?error=empty');
  }

  await db.query("INSERT INTO tasks (task, completed) VALUES (?, FALSE)", [task]);
  res.redirect('/');
});

// Delete task
router.post('/delete/:id', async function(req, res, next) {
  await db.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
  res.redirect('/');
});

// Mark task complete
router.post('/complete/:id', async function(req, res, next) {
  await db.query("UPDATE tasks SET completed = TRUE WHERE id = ?", [req.params.id]);
  res.redirect('/');
});

// Edit task text
router.post('/edit/:id', async function(req, res, next) {
  const newTask = req.body.task;

  if (!newTask || newTask.trim() === "") {
    return res.redirect('/?error=empty');
  }

  await db.query("UPDATE tasks SET task = ? WHERE id = ?", [newTask, req.params.id]);
  res.redirect('/');
});

module.exports = router;
