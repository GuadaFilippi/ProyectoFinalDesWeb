const express = require('express');
const bodyParser = require('body-parser');
const { initializeDataFile, readTasks, writeTasks } = require('./data/dataAccess');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'tasks.json');

// Routes
app.get('/api/tasks', async (req, res) => {
    try {
        const data = await readTasks();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const { title, description, assignedTo } = req.body;
        const data = await readTasks();
        
        const newTask = {
            id: Date.now(),
            title,
            description,
            assignedTo,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        data.tasks.push(newTask);
        await writeTasks(data);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const updates = req.body;
        
        const data = await readTasks();
        const taskIndex = data.tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...updates };
        await writeTasks(data);
        res.json(data.tasks[taskIndex]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const data = await readTasks();
        
        data.tasks = data.tasks.filter(task => task.id !== taskId);
        await writeTasks(data);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Initialize data file and start server
initializeDataFile().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}); 