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
    
    loadTasks();
    loadHabits();

    setupEventListeners();
    
    console.log('Whiteboard ready!');
}

document.addEventListener('DOMContentLoaded', initApp);