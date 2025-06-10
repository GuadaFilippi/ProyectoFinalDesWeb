const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // Usar ':memory:' para una base de datos en memoria o un archivo para persistencia

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    assignedTo TEXT,
    status TEXT DEFAULT 'pending',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db; 