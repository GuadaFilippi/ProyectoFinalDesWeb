// DOM Elements
const taskForm = document.getElementById('taskForm');
const tasksList = document.getElementById('tasksList');
const taskTemplate = document.getElementById('taskTemplate');
const filterButtons = document.querySelectorAll('.filter-btn');

// Current filter state
let currentFilter = 'all';

// Fetch all tasks from the server
async function fetchTasks() {
    try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        return data.tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}

// Create a new task
async function createTask(taskData) {
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating task:', error);
        return null;
    }
}

// Update a task
async function updateTask(taskId, updates) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating task:', error);
        return null;
    }
}

// Delete a task
async function deleteTask(taskId) {
    try {
        await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
        return true;
    } catch (error) {
        console.error('Error deleting task:', error);
        return false;
    }
}

// Create task element from template
function createTaskElement(task) {
    const taskElement = taskTemplate.content.cloneNode(true);
    const taskCard = taskElement.querySelector('.task-card');
    
    taskCard.dataset.id = task.id;
    taskCard.dataset.status = task.status;
    
    taskCard.querySelector('.task-title').textContent = task.title;
    taskCard.querySelector('.task-description').textContent = task.description;
    taskCard.querySelector('.assigned-to').textContent = `Asignado a: ${task.assignedTo}`;
    taskCard.querySelector('.task-status').textContent = `Estado: ${task.status === 'pending' ? 'Pendiente' : 'Completada'}`;
    
    const statusBtn = taskCard.querySelector('.status-btn');
    statusBtn.textContent = task.status === 'pending' ? 'Marcar Completada' : 'Marcar Pendiente';
    statusBtn.addEventListener('click', () => toggleTaskStatus(task.id, task.status));
    
    taskCard.querySelector('.delete-btn').addEventListener('click', () => handleDeleteTask(task.id));
    
    return taskCard;
}

// Render tasks based on current filter
async function renderTasks() {
    const tasks = await fetchTasks();
    tasksList.innerHTML = '';
    
    tasks.filter(task => {
        if (currentFilter === 'all') return true;
        return task.status === currentFilter;
    }).forEach(task => {
        tasksList.appendChild(createTaskElement(task));
    });
}

// Toggle task status
async function toggleTaskStatus(taskId, currentStatus) {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const updated = await updateTask(taskId, { status: newStatus });
    if (updated) {
        renderTasks();
    }
}

// Handle task deletion
async function handleDeleteTask(taskId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        const deleted = await deleteTask(taskId);
        if (deleted) {
            renderTasks();
        }
    }
}

// Form submit handler
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const taskData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        assignedTo: document.getElementById('assignedTo').value
    };
    
    const created = await createTask(taskData);
    if (created) {
        taskForm.reset();
        renderTasks();
    }
});

// Filter click handler
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.status;
        renderTasks();
    });
});

// Initial render
renderTasks(); 