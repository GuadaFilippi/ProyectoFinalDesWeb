const db = require('../models/db');

exports.getAllTasks = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

exports.createTask = (taskData) => {
  return new Promise((resolve, reject) => {
    const { title, description, assignedTo } = taskData;
    db.run(
      'INSERT INTO tasks (title, description, assignedTo) VALUES (?, ?, ?)',
      [title, description, assignedTo],
      function (err) {
        if (err) reject(err);
        resolve({ id: this.lastID, ...taskData });
      }
    );
  });
};

exports.updateTask = (taskId, taskData) => {
  return new Promise((resolve, reject) => {
    const { title, description, assignedTo, status } = taskData;
    db.run(
      'UPDATE tasks SET title = ?, description = ?, assignedTo = ?, status = ? WHERE id = ?',
      [title, description, assignedTo, status, taskId],
      function (err) {
        if (err) reject(err);
        resolve({ id: taskId, ...taskData });
      }
    );
  });
};

exports.deleteTask = (taskId) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM tasks WHERE id = ?', taskId, function (err) {
      if (err) reject(err);
      resolve({ message: 'Task deleted successfully' });
    });
  });
}; 