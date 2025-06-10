const express = require('express');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/tasks.routes');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('../frontend/public'));

// Rutas
app.use('/api', taskRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 