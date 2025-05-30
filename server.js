const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'tasks.json');

// Ensure data directory and file exist
async function initializeDataFile() {
    try {
        await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
        try {
            await fs.access(DATA_FILE);
        } catch {
            await fs.writeFile(DATA_FILE, JSON.stringify({ tasks: [] }));
        }
    } catch (error) {
        console.error('Error initializing data file:', error);
    }
}

// Routes
app.get('/api/tasks', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Error reading tasks' });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const { title, description, assignedTo } = req.body;
        const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
        
        const newTask = {
            id: Date.now(),
            title,
            description,
            assignedTo,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        data.tasks.push(newTask);
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Error creating task' });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const updates = req.body;
        
        const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
        const taskIndex = data.tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...updates };
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        res.json(data.tasks[taskIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Error updating task' });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
        
        data.tasks = data.tasks.filter(task => task.id !== taskId);
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});

// Initialize data file and start server
initializeDataFile().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}); 