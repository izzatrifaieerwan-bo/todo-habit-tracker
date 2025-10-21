let tasks = [];
let currentCategoryFilter = 'all';

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
    if (editingTaskId !== null) {
        saveTaskEdit();
        return;
    }

    const input = document.getElementById('task-input');
    const date = document.getElementById('task-date');
    const priority = document.getElementById('task-priority');
    const category = document.getElementById('task-category');

    if (input.value.trim() === '') {
        alert('Please enter a task!');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: input.value.trim(),
        date: date.value,
        priority: priority.value,
        category: category.value,
        completed: false
    };

    tasks.push(newTask);
    
    input.value = '';
    date.value = '';
    priority.value = 'low';
    category.value = 'other';
    
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

let editingTaskId = null;  

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    editingTaskId = id;
    
    document.getElementById('task-input').value = task.text;
    document.getElementById('task-date').value = task.date;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-category').value = task.category || 'other';
    
    const addButton = document.getElementById('add-task-btn');
    addButton.textContent = 'Save Changes';
    
    const inputGroup = document.querySelector('#todos-section .input-group');
    inputGroup.classList.add('edit-mode');
    
    if (!document.getElementById('cancel-task-btn')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancel-task-btn';
        cancelBtn.className = 'cancel-btn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = cancelTaskEdit;
        inputGroup.appendChild(cancelBtn);
    }
    
    if (!document.querySelector('#todos-section .edit-mode-label')) {
        const label = document.createElement('div');
        label.className = 'edit-mode-label';
        label.textContent = '✏️ Editing Task';
        inputGroup.insertBefore(label, inputGroup.firstChild);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.getElementById('task-input').focus();
}

function saveTaskEdit() {
    const input = document.getElementById('task-input');
    const date = document.getElementById('task-date');
    const priority = document.getElementById('task-priority');
    const category = document.getElementById('task-category'); 
    
    if (input.value.trim() === '') {
        alert('Please enter a task!');
        return;
    }
    
    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
        task.text = input.value.trim();
        task.date = date.value;
        task.priority = priority.value;
        task.category = category.value;
    
        saveTasks();
        renderTasks();
    }
    
    cancelTaskEdit();
}

function cancelTaskEdit() {
    editingTaskId = null;
    
    document.getElementById('task-input').value = '';
    document.getElementById('task-date').value = '';
    document.getElementById('task-priority').value = 'low';
    document.getElementById('task-category').value = 'other';
    
    const addButton = document.getElementById('add-task-btn');
    addButton.textContent = 'Add Task';
    
    const inputGroup = document.querySelector('#todos-section .input-group');
    inputGroup.classList.remove('edit-mode');
    
    const cancelBtn = document.getElementById('cancel-task-btn');
    if (cancelBtn) {
        cancelBtn.remove();
    }
    
    const label = document.querySelector('#todos-section .edit-mode-label');
    if (label) {
        label.remove();
    }
}

function filterByCategory(category) {
    currentCategoryFilter = category;
    
    const filterButtons = document.querySelectorAll('.category-filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    const activeButton = document.querySelector(`.category-filter-btn.${category}`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    renderTasks();
}

function renderTasks() {
    const tasksList = document.getElementById('tasks-list');

    let filteredTasks = tasks;
    if (currentCategoryFilter !== 'all') {
        filteredTasks = tasks.filter(t => t.category === currentCategoryFilter);
    }

    if (filteredTasks.length === 0 && currentCategoryFilter !== 'all') {
        tasksList.innerHTML = `<div class="no-tasks-filtered">No ${currentCategoryFilter} tasks found.</div>`;
        updateTaskStats();
        return;
    }

    if (tasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
        updateTaskStats();
        return;
    }

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    const tasksHTML = sortedTasks.map(task => {
        const categoryClass = task.category || 'other';
        const categoryLabel = (task.category || 'other').charAt(0).toUpperCase() + (task.category || 'other').slice(1);
        
        return `
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
                        <span class="category-badge category-${categoryClass}">
                            ${categoryLabel}
                        </span>
                        <span class="priority-badge priority-${task.priority}">
                            ${task.priority.toUpperCase()}
                        </span>
                        ${task.date ? `Due: ${formatDate(task.date)}` : 'No due date'}
                    </div>
                </div>
                <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
    }).join('');
    
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