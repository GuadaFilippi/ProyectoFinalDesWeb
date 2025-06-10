const express = require('express');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/tasks.routes');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('../frontend/public'));

// Rutas
app.use('/api', taskRoutes);

// Add SQLite database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database ' + err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 