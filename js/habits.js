let habits = [];

function loadHabits() {
    const savedHabits = localStorage.getItem('habits');
    
    if (savedHabits) {
        habits = JSON.parse(savedHabits);
    }
    
    renderHabits();
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

function addHabit() {
    if (editingHabitId !== null) {
        saveHabitEdit();
        return;
    }
    
    const input = document.getElementById('habit-input');
    
    if (input.value.trim() === '') {
        alert('Please enter a habit!');
        return;
    }
    
    const newHabit = {
        id: Date.now(),
        text: input.value.trim(),
        streak: 0,
        lastChecked: null
    };
    
    habits.push(newHabit);
    
    input.value = '';
    
    saveHabits();
    renderHabits();
}

function checkHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    
    const today = new Date().toDateString();
    
    if (habit.lastChecked === today) {
        habit.streak = 0;           
        habit.lastChecked = null;   
    } 
    
    else {
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        if (habit.lastChecked === yesterdayString) {
            habit.streak++;  
        } 
        
        else {
            habit.streak = 1;
        }
        
        habit.lastChecked = today;
    }
    
    saveHabits();
    renderHabits();
}

function deleteHabit(id) {
    habits = habits.filter(h => h.id !== id);
    
    saveHabits();
    renderHabits();
}

let editingHabitId = null;  

function editHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    
    editingHabitId = id;
    
    document.getElementById('habit-input').value = habit.text;
    
    const addButton = document.getElementById('add-habit-btn');
    addButton.textContent = 'Save Changes';
    
    const inputGroup = document.querySelector('#habits-section .input-group');
    inputGroup.classList.add('edit-mode');
    
    if (!document.getElementById('cancel-habit-btn')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancel-habit-btn';
        cancelBtn.className = 'cancel-btn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = cancelHabitEdit;
        inputGroup.appendChild(cancelBtn);
    }
    
    if (!document.querySelector('#habits-section .edit-mode-label')) {
        const label = document.createElement('div');
        label.className = 'edit-mode-label';
        label.textContent = '✏️ Editing Habit';
        inputGroup.insertBefore(label, inputGroup.firstChild);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.getElementById('habit-input').focus();
}

function saveHabitEdit() {
    const input = document.getElementById('habit-input');
    
    if (input.value.trim() === '') {
        alert('Please enter a habit!');
        return;
    }
    
    const habit = habits.find(h => h.id === editingHabitId);
    if (habit) {
        habit.text = input.value.trim();

        saveHabits();
        renderHabits();
    }
    
    cancelHabitEdit();
}

function cancelHabitEdit() {
    editingHabitId = null;
    
    document.getElementById('habit-input').value = '';
    
    const addButton = document.getElementById('add-habit-btn');
    addButton.textContent = 'Add Habit';
    
    const inputGroup = document.querySelector('#habits-section .input-group');
    inputGroup.classList.remove('edit-mode');
    
    const cancelBtn = document.getElementById('cancel-habit-btn');
    if (cancelBtn) {
        cancelBtn.remove();
    }
    
    const label = document.querySelector('#habits-section .edit-mode-label');
    if (label) {
        label.remove();
    }
}

function renderHabits() {
    const habitsList = document.getElementById('habits-list');

    if (habits.length === 0) {
        habitsList.innerHTML = '<div class="empty-state">No habits yet. Start building one!</div>';
        updateHabitStats();
        return;
    }
    
    const today = new Date().toDateString();
    
    const habitsHTML = habits.map(habit => {
        const isCheckedToday = habit.lastChecked === today;
        
        return `
            <div class="item habit-item ${isCheckedToday ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="item-checkbox" 
                    ${isCheckedToday ? 'checked' : ''} 
                    onchange="checkHabit(${habit.id})"
                />
                <div class="item-content">
                    <div class="item-title">${habit.text}</div>
                    <div class="item-meta">
                        ${habit.lastChecked 
                            ? `Last checked: ${formatHabitDate(habit.lastChecked)}` 
                            : 'Never checked'}
                    </div>
                </div>
                <div class="streak-counter">
                    <div>
                        <div class="streak-number">${habit.streak} 🔥</div>
                        <div class="streak-label">day streak</div>
                    </div>
                </div>
                <button class="edit-btn" onclick="editHabit(${habit.id})">Edit</button>
                <button class="delete-btn" onclick="deleteHabit(${habit.id})">Delete</button>
            </div>
        `;
    }).join('');
    
    habitsList.innerHTML = habitsHTML;
    
    updateHabitStats();
}

function updateHabitStats() {
    const total = habits.length;
    
    const longestStreak = habits.length > 0 
        ? Math.max(...habits.map(h => h.streak)) 
        : 0;
    
    document.getElementById('total-habits').textContent = total;
    document.getElementById('longest-streak').textContent = longestStreak;
}

function formatHabitDate(dateString) {
    const date = new Date(dateString);
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateString === today) {
        return 'Today';
    } else if (dateString === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }
}