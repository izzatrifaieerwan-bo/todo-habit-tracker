function setupEventListeners() {
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
    console.log('Whiteboard app starting...');

    loadTheme();
    
    loadTasks();
    loadHabits();

    setupEventListeners();
    
    console.log('Whiteboard ready!');
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}
loadTheme();

document.addEventListener('DOMContentLoaded', initApp);