const { readTasks, writeTasks } = require('../data/dataAccess');

async function getTasks(req, res) {
    try {
        const data = await readTasks();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createTask(req, res) {
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
}

async function updateTask(req, res) {
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
}

async function deleteTask(req, res) {
    try {
        const taskId = parseInt(req.params.id);
        const data = await readTasks();
        
        data.tasks = data.tasks.filter(task => task.id !== taskId);
        await writeTasks(data);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
}; 