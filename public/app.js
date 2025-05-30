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
        const result = await response.json();
        if (result) {
            showNotification('Tarea creada exitosamente', 'success');
        }
        return result;
    } catch (error) {
        console.error('Error creating task:', error);
        showNotification('Error al crear la tarea', 'error');
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
        const result = await response.json();
        if (result) {
            showNotification('Tarea actualizada exitosamente', 'success');
        }
        return result;
    } catch (error) {
        console.error('Error updating task:', error);
        showNotification('Error al actualizar la tarea', 'error');
        return null;
    }
}

// Delete a task
async function deleteTask(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            showNotification('Tarea eliminada exitosamente', 'success');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Error al eliminar la tarea', 'error');
        return false;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Create task element from template
function createTaskElement(task) {
    const taskElement = taskTemplate.content.cloneNode(true);
    const taskCard = taskElement.querySelector('.task-card');
    
    taskCard.dataset.id = task.id;
    taskCard.dataset.status = task.status;
    
    taskCard.querySelector('.task-title').innerHTML = `
        <i class="fas fa-thumbtack"></i> ${task.title}
    `;
    taskCard.querySelector('.task-description').textContent = task.description;
    taskCard.querySelector('.assigned-to').innerHTML = `
        <i class="fas fa-user"></i> ${task.assignedTo}
    `;
    
    const statusBadge = taskCard.querySelector('.task-status');
    statusBadge.classList.add(task.status);
    statusBadge.innerHTML = `
        <i class="fas ${task.status === 'pending' ? 'fa-clock' : 'fa-check-circle'}"></i>
        ${task.status === 'pending' ? 'Pendiente' : 'Completada'}
    `;
    
    const statusBtn = taskCard.querySelector('.status-btn');
    statusBtn.innerHTML = `
        <i class="fas ${task.status === 'pending' ? 'fa-check' : 'fa-undo'}"></i>
        ${task.status === 'pending' ? 'Marcar Completada' : 'Marcar Pendiente'}
    `;
    statusBtn.addEventListener('click', () => toggleTaskStatus(task.id, task.status));
    
    taskCard.querySelector('.delete-btn').addEventListener('click', () => handleDeleteTask(task.id));
    
    // Agregar animación de entrada
    taskCard.style.opacity = '0';
    taskCard.style.transform = 'translateY(20px)';
    setTimeout(() => {
        taskCard.style.opacity = '1';
        taskCard.style.transform = 'translateY(0)';
    }, 50);
    
    return taskCard;
}

// Render tasks based on current filter
async function renderTasks() {
    const tasks = await fetchTasks();
    tasksList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'all') return true;
        return task.status === currentFilter;
    });

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>No hay tareas ${currentFilter !== 'all' ? 'en este estado' : ''}</p>
            </div>
        `;
        return;
    }
    
    filteredTasks.forEach(task => {
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
    const taskCard = document.querySelector(`[data-id="${taskId}"]`);
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        // Agregar animación de salida
        taskCard.style.opacity = '0';
        taskCard.style.transform = 'translateY(20px)';
        
        setTimeout(async () => {
            const deleted = await deleteTask(taskId);
            if (deleted) {
                renderTasks();
            }
        }, 300);
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

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: white;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    }
    
    .notification.success {
        background: #dcfce7;
        color: #166534;
    }
    
    .notification.error {
        background: #fee2e2;
        color: #991b1b;
    }
    
    .notification.fade-out {
        animation: slideOut 0.3s ease forwards;
    }
    
    .empty-state {
        text-align: center;
        padding: 2rem;
        color: #64748b;
    }
    
    .empty-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initial render
renderTasks(); 