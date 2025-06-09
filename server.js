const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const tasksRoutes = require('./routes/tasks.routes');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.use('/api', tasksRoutes);

// Initialize data file and start server
const { initializeDataFile } = require('./data/dataAccess');
initializeDataFile().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}); 