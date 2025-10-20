function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    const sections = document.querySelectorAll('.content-section');

    tabs.forEach(tab => tab.classList.remove('active'));
    sections.forEach(section => section.classList.remove('active'));

    if (tabName === 'todos') {
        document.getElementById('todos-tab').classList.add('active');
        document.getElementById('todos-section').classList.add('active');
    } else if (tabName === 'habits') {
        document.getElementById('habits-tab').classList.add('active');
        document.getElementById('habits-section').classList.add('active');
    }
}

function setupEventListeners() {
    document.getElementById('todos-tab').addEventListener('click', function() {
        switchTab('todos');
    });
    
    document.getElementById('habits-tab').addEventListener('click', function() {
        switchTab('habits');
    });
    document.getElementById('add-task-btn').addEventListener('click', addTask);
    
    document.getElementById('add-habit-btn').addEventListener('click', addHabit);
    
    document.getElementById('task-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });
    
    document.getElementById('habit-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addHabit();
        }
    });
}

function initApp() {
    console.log('App is starting...');

    loadTasks();
    loadHabits();

    setupEventListeners();
    
    console.log('App loaded successfully!');
}

document.addEventListener('DOMContentLoaded', initApp);