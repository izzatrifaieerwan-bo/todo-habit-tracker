// ================================
// TASKS.JS - All task-related functionality
// ================================

// TASKS ARRAY: Stores all our tasks
let tasks = [];

// CURRENT FILTER: Track which category is selected
let currentCategoryFilter = 'all';

// SEARCH TERM: Track current search
let searchTerm = '';

// EDITING STATE: Track which task is being edited
let editingTaskId = null;

// DRAG & DROP STATE
let isDragMode = false;
let customOrder = []; // Store custom task order by IDs
let draggedElement = null;

// ================================
// HELPER: UPDATE DASHBOARD IF OPEN
// ================================
function updateDashboardIfOpen() {
    if (typeof updateDashboard === 'function') {
        const panel = document.getElementById('dashboard-panel');
        if (panel && panel.classList.contains('open')) {
            updateDashboard();
        }
    }
}

// ================================
// LOAD TASKS FROM STORAGE
// ================================
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    const savedOrder = localStorage.getItem('customTaskOrder');

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    
    // Load custom order
    if (savedOrder) {
        customOrder = JSON.parse(savedOrder);
    }

    renderTasks();
}

// ================================
// SAVE TASKS TO STORAGE
// ================================
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Save custom order if in drag mode
    if (isDragMode && customOrder.length > 0) {
        localStorage.setItem('customTaskOrder', JSON.stringify(customOrder));
    }
}

// ================================
// ADD A NEW TASK (or Save Edit)
// ================================
function addTask() {
    // If we're in edit mode, save the edit instead
    if (editingTaskId !== null) {
        saveTaskEdit();
        return;
    }

    // Get values from input fields
    const input = document.getElementById('task-input');
    const date = document.getElementById('task-date');
    const priority = document.getElementById('task-priority');
    const category = document.getElementById('task-category');

    // Validation: Don't add empty tasks
    if (input.value.trim() === '') {
        alert('Please enter a task!');
        return;
    }

    // Create new task object
    const newTask = {
        id: Date.now(),
        text: input.value.trim(),
        date: date.value,
        priority: priority.value,
        category: category.value,
        completed: false
    };

    // Add task to array
    tasks.push(newTask);
    
    // Clear input fields
    input.value = '';
    date.value = '';
    priority.value = 'low';
    category.value = 'other';
    
    // Save and display
    saveTasks();
    renderTasks();
    updateDashboardIfOpen(); // ← NEW: Update dashboard in real-time

    successToast('Task added successfully! 📝');
}

// ================================
// TOGGLE TASK COMPLETION
// ================================
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        // Check status before toggling for toast message
        const wasCompleted = task.completed;
        
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateDashboardIfOpen();
        
        // Show appropriate toast
        if (!wasCompleted) {
            successToast('Task completed! 🎉');
        } else {
            infoToast('Task marked as incomplete');
        }
    }
}

// ================================
// DELETE A TASK
// ================================
function deleteTask(id) {
    // Filter out the task with matching ID (keep all others)
    tasks = tasks.filter(t => t.id !== id);
    
    saveTasks();
    renderTasks();
    updateDashboardIfOpen(); // ← NEW: Update dashboard in real-time

    infoToast('Task deleted');
}

// ================================
// EDIT TASK - Enter Edit Mode
// ================================
function editTask(id) {
    // Find the task to edit
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    // Store the ID of task being edited
    editingTaskId = id;
    
    // Populate input fields with current task data
    document.getElementById('task-input').value = task.text;
    document.getElementById('task-date').value = task.date;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-category').value = task.category || 'other';
    
    // Change button text and styling
    const addButton = document.getElementById('add-task-btn');
    addButton.textContent = 'Save Changes';
    
    // Add edit mode styling
    const inputGroup = document.querySelector('#todos-section .input-group');
    inputGroup.classList.add('edit-mode');
    
    // Add cancel button if it doesn't exist
    if (!document.getElementById('cancel-task-btn')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancel-task-btn';
        cancelBtn.className = 'cancel-btn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = function() {
            cancelTaskEdit();
            infoToast('Edit cancelled');  // ← Show toast when cancel is clicked
        };
        inputGroup.appendChild(cancelBtn);
    }
    
    // Add edit mode label if it doesn't exist
    if (!document.querySelector('#todos-section .edit-mode-label')) {
        const label = document.createElement('div');
        label.className = 'edit-mode-label';
        label.textContent = '✏️ Editing Task';
        inputGroup.insertBefore(label, inputGroup.firstChild);
    }
    
    // Scroll to top so user sees the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Focus on the input field
    document.getElementById('task-input').focus();
}

// ================================
// SAVE EDITED TASK
// ================================
function saveTaskEdit() {
    // Get values from input fields
    const input = document.getElementById('task-input');
    const date = document.getElementById('task-date');
    const priority = document.getElementById('task-priority');
    const category = document.getElementById('task-category');
    
    // Validation
    if (input.value.trim() === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Find the task and update it
    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
        task.text = input.value.trim();
        task.date = date.value;
        task.priority = priority.value;
        task.category = category.value;
        
        // Save and render
        saveTasks();
        renderTasks();
        updateDashboardIfOpen();
    }
    
    // Exit edit mode (this calls cancelTaskEdit)
    cancelTaskEdit();
    
    // Show success toast AFTER canceling edit mode
    successToast('Changes saved! ✏️');
}

// ================================
// CANCEL TASK EDIT
// ================================
function cancelTaskEdit() {
    // Clear editing ID
    editingTaskId = null;
    
    // Clear input fields
    document.getElementById('task-input').value = '';
    document.getElementById('task-date').value = '';
    document.getElementById('task-priority').value = 'low';
    document.getElementById('task-category').value = 'other';
    
    // Reset button text
    const addButton = document.getElementById('add-task-btn');
    addButton.textContent = 'Add Task';
    
    // Remove edit mode styling
    const inputGroup = document.querySelector('#todos-section .input-group');
    inputGroup.classList.remove('edit-mode');
    
    // Remove cancel button
    const cancelBtn = document.getElementById('cancel-task-btn');
    if (cancelBtn) {
        cancelBtn.remove();
    }
    
    // Remove edit mode label
    const label = document.querySelector('#todos-section .edit-mode-label');
    if (label) {
        label.remove();
    }
}

// ================================
// FILTER TASKS BY CATEGORY
// ================================
function filterByCategory(category) {
    // Update current filter
    currentCategoryFilter = category;
    
    // Update active button styling
    const filterButtons = document.querySelectorAll('.category-filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    const activeButton = document.querySelector(`.category-filter-btn.${category}`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Re-render tasks with filter
    renderTasks();
}

// ================================
// RENDER (DISPLAY) TASKS ON PAGE
// ================================
function renderTasks() {
    const tasksList = document.getElementById('tasks-list');

    // Filter by category
    let filteredTasks = tasks;
    if (currentCategoryFilter !== 'all') {
        filteredTasks = tasks.filter(t => t.category === currentCategoryFilter);
    }

    // Filter by search term
    if (searchTerm !== '') {
        filteredTasks = filteredTasks.filter(t => 
            t.text.toLowerCase().includes(searchTerm)
        );
    }

    // Handle empty states
    if (filteredTasks.length === 0 && searchTerm !== '') {
        tasksList.innerHTML = `<div class="no-search-results">No tasks found matching "${searchTerm}"</div>`;
        updateTaskStats();
        return;
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
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '<div class="no-search-results">No matching tasks found.</div>';
        updateTaskStats();
        return;
    }

    // Sort tasks based on mode
    let sortedTasks;

    if (isDragMode && customOrder.length > 0) {
        // Custom manual order
        sortedTasks = [...filteredTasks].sort((a, b) => {
            const indexA = customOrder.indexOf(a.id);
            const indexB = customOrder.indexOf(b.id);
            
            // If both have custom positions, sort by those
            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }
            
            // If only one has a position, it comes first
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            
            // If neither has a position, maintain current order
            return 0;
        });
    } else {
        // Automatic sort: overdue first, then by priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        sortedTasks = [...filteredTasks].sort((a, b) => {
            const aOverdue = isTaskOverdue(a);
            const bOverdue = isTaskOverdue(b);
            
            if (aOverdue && !bOverdue) return -1;
            if (!aOverdue && bOverdue) return 1;
            
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }
    
    // Build HTML for all tasks
    const tasksHTML = sortedTasks.map(task => {
        const categoryClass = task.category || 'other';
        const categoryLabel = (task.category || 'other').charAt(0).toUpperCase() + (task.category || 'other').slice(1);
        const overdue = isTaskOverdue(task);
    
        // Highlight search term in task text
        let displayText = task.text;
        if (searchTerm !== '') {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            displayText = task.text.replace(regex, '<span class="search-highlight">$1</span>');
        }
        
        return `
            <div class="item ${task.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''} priority-${task.priority}" 
                data-id="${task.id}" 
                draggable="${isDragMode}">
                <span class="drag-handle">⋮⋮</span>
                <input 
                    type="checkbox"
                    class="item-checkbox" 
                    ${task.completed ? 'checked' : ''} 
                    onchange="toggleTask(${task.id})"
                />
                <div class="item-content">
                    <div class="item-title">${displayText}</div>
                    <div class="item-meta">
                        ${overdue ? '<span class="overdue-badge">OVERDUE</span>' : ''}
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
    
    // Add or remove drag-mode class
    if (isDragMode) {
        tasksList.classList.add('drag-mode');
    } else {
        tasksList.classList.remove('drag-mode');
    }

    // Insert HTML into the page
    tasksList.innerHTML = tasksHTML;
    
    // Update statistics
    updateTaskStats();

    if (isDragMode) {
        setupDragListeners();
    }
}

// ================================
// UPDATE TASK STATISTICS
// ================================
function updateTaskStats() {
    // Count total, completed, and pending tasks
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;
    
    // Update the numbers on the page
    document.getElementById('total-tasks').textContent = total;
    document.getElementById('completed-tasks').textContent = completed;
    document.getElementById('pending-tasks').textContent = pending;
}

// ================================
// HELPER FUNCTION: FORMAT DATE
// ================================
function formatDate(dateString) {
    // Convert date string to readable format
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// ================================
// HELPER FUNCTION: CHECK IF TASK IS OVERDUE
// ================================
function isTaskOverdue(task) {
    if (!task.date || task.completed) {
        return false;  // No date or already completed = not overdue
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Reset time to midnight
    
    const dueDate = new Date(task.date);
    dueDate.setHours(0, 0, 0, 0);  // Reset time to midnight
    
    return dueDate < today;  // True if due date is in the past
}

// ================================
// SEARCH TASKS
// ================================
function searchTasks() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    
    searchTerm = searchInput.value.toLowerCase().trim();

    // Enable/disable clear button
    clearBtn.disabled = searchTerm === '';

    // Re-render with search filter
    renderTasks();
}

// ================================
// CLEAR SEARCH
// ================================
function clearSearch() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    
    searchInput.value = '';
    searchTerm = '';
    clearBtn.disabled = true;

    // Re-render without search filter
    renderTasks();

    // Focus back on search input
    searchInput.focus();
}

// ================================
// DRAG & DROP FUNCTIONS
// ================================

// Toggle drag mode on/off
function toggleDragMode() {
    isDragMode = !isDragMode;
    
    const toggle = document.getElementById('drag-toggle');
    const container = document.getElementById('drag-toggle-container');
    const helpText = document.getElementById('drag-help-text');
    
    if (isDragMode) {
        toggle.classList.add('active');
        container.classList.add('active');
        helpText.textContent = '(Drag tasks to reorder)';
        
        // Initialize custom order with current task order
        if (customOrder.length === 0) {
            customOrder = tasks.map(t => t.id);
        }
        infoToast('Drag mode enabled ⋮⋮');
    } else {
        toggle.classList.remove('active');
        container.classList.remove('active');
        helpText.textContent = '';
        
        // Clear custom order to return to automatic sorting
        customOrder = [];
        localStorage.removeItem('customTaskOrder');

        infoToast('Auto-sort enabled');
    }
    
    // Re-render with new mode
    renderTasks();
}

// Setup drag event listeners for all task items
function setupDragListeners() {
    const items = document.querySelectorAll('.item');
    
    items.forEach(item => {
        // Drag start
        item.addEventListener('dragstart', handleDragStart);
        
        // Drag over
        item.addEventListener('dragover', handleDragOver);
        
        // Drag enter
        item.addEventListener('dragenter', handleDragEnter);
        
        // Drag leave
        item.addEventListener('dragleave', handleDragLeave);
        
        // Drop
        item.addEventListener('drop', handleDrop);
        
        // Drag end
        item.addEventListener('dragend', handleDragEnd);
    });
}

// Handle drag start
function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    
    // Set data transfer
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

// Handle drag over
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    e.dataTransfer.dropEffect = 'move';
    return false;
}

// Handle drag enter
function handleDragEnter(e) {
    if (this !== draggedElement) {
        this.classList.add('drag-over');
    }
}

// Handle drag leave
function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

// Handle drop
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        // Get IDs
        const draggedId = parseInt(draggedElement.dataset.id);
        const targetId = parseInt(this.dataset.id);
        
        // Find indices in customOrder
        const draggedIndex = customOrder.indexOf(draggedId);
        const targetIndex = customOrder.indexOf(targetId);
        
        // Remove dragged item from its position
        customOrder.splice(draggedIndex, 1);
        
        // Insert at new position
        const newTargetIndex = customOrder.indexOf(targetId);
        customOrder.splice(newTargetIndex, 0, draggedId);
        
        // Save and re-render
        saveTasks();
        renderTasks();
    }
    
    return false;
}

// Handle drag end
function handleDragEnd(e) {
    // Remove all drag styles
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.classList.remove('dragging');
        item.classList.remove('drag-over');
    });
    
    draggedElement = null;
}