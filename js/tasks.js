let tasks = [];

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById('task-input');
    const date = document.getElementById('task-date');
    const priority = document.getElementById('task-priority');
    if (input.value.trim() === '') {
        alert('Please enter a task!');
        return;  
    }

    const newTask = {
        id: Date.now(),              
        text: input.value.trim(),    
        date: date.value,            
        priority: priority.value,    
        completed: false             
    };
    
    tasks.push(newTask);
    
    input.value = '';
    date.value = '';
    priority.value = 'low';
    
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        task.completed = !task.completed;  
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    
    saveTasks();
    renderTasks();
}

function renderTasks() {
    const tasksList = document.getElementById('tasks-list');
    
    if (tasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
        updateTaskStats();
        return;
    }
    
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const sortedTasks = [...tasks].sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    const tasksHTML = sortedTasks.map(task => `
        <div class="item ${task.completed ? 'completed' : ''} priority-${task.priority}">
            <input 
                type="checkbox" 
                class="item-checkbox" 
                ${task.completed ? 'checked' : ''} 
                onchange="toggleTask(${task.id})"
            />
            <div class="item-content">
                <div class="item-title">${task.text}</div>
                <div class="item-meta">
                    <span class="priority-badge priority-${task.priority}">
                        ${task.priority.toUpperCase()}
                    </span>
                    ${task.date ? `Due: ${formatDate(task.date)}` : 'No due date'}
                </div>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `).join('');
    
    tasksList.innerHTML = tasksHTML;
    
    updateTaskStats();
}

function updateTaskStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;
    
    document.getElementById('total-tasks').textContent = total;
    document.getElementById('completed-tasks').textContent = completed;
    document.getElementById('pending-tasks').textContent = pending;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}