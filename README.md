# Classroom Whiteboard - To-Do & Habit Tracker

A unique productivity web application designed to look and feel like an actual classroom whiteboard. Manage your tasks and build lasting habits in a warm, familiar environment that combines nostalgia with functionality.

![Project Screenshot](assets/screenshot.png)
<!-- Add a screenshot of your beautiful whiteboard design! -->

## Features

### Task Management
- Create tasks with custom descriptions
- Set due dates for better planning
- Assign priority levels (High, Medium, Low) with color coding
- **Edit existing tasks** with visual feedback (highlighted edit mode)
- Mark tasks as complete with checkboxes
- Delete tasks when no longer needed
- Automatic priority-based sorting
- Compact vertical statistics (total, completed, pending)

### Habit Tracking
- Build and track daily habits
- **Edit habit descriptions** without losing streak progress
- Streak counter with fire emoji to maintain motivation
- Daily check-in system with automatic date tracking
- Automatic streak calculation (increases for consecutive days)
- View your longest streak achievement
- Delete habits as needed
- Compact vertical statistics (active habits, longest streak)

### Data Persistence
- All data saved locally in your browser using localStorage
- Tasks and habits persist across sessions
- No account, login, or server required
- Edit history preserved automatically
- Works completely offline

### User Experience
- Clean, intuitive whiteboard interface
- Both To-Do List and Habits visible simultaneously
- Vertical divider line separating sections
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Visual feedback for all interactions
- Enter key support for quick task/habit entry

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or server required!
- Works completely offline after first load

### How to Use
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start adding tasks and habits on your digital whiteboard!

## Technologies Used

- **HTML5** - Semantic structure and content
- **CSS3** - Advanced styling with gradients, shadows, and animations
- **JavaScript (ES6)** - Modern syntax with arrow functions and template literals
- **LocalStorage API** - Client-side data persistence
- **Google Fonts (Caveat)** - Handwritten font for authentic classroom feel

## Project Structure
```
todo-habit-tracker/
├── index.html          # Main HTML file with whiteboard structure
├── css/
│   └── styles.css      # Complete styling (whiteboard, frame, tray, content)
├── js/
│   ├── app.js          # Main app initialization and event listeners
│   ├── tasks.js        # Task CRUD operations and rendering
│   └── habits.js       # Habit management and streak calculation
├── assets/
│   └── images/         # Screenshots and icons
└── README.md           # Project documentation
```

## How It Works

### Tasks
1. Enter a task description in the input field
2. Optionally set a due date using the date picker
3. Choose a priority level from the dropdown (Low/Medium/High)
4. Click **"Add Task"** or press **Enter**
5. Tasks appear with color-coded priority markers
6. **Click "Edit"** to modify any task details - form highlights in yellow
7. Check the checkbox to mark as complete (adds strikethrough)
8. Click **"Delete"** to remove tasks permanently

### Habits
1. Enter a habit you want to build (e.g., "Drink 8 glasses of water")
2. Click **"Add Habit"** or press **Enter**
3. **Click "Edit"** to change the habit name (preserves your streak!)
4. Check the box daily to maintain your streak
5. Streaks automatically increase when checked on consecutive days
6. If you miss a day, the streak resets on next check-in
7. Uncheck to reset streak to 0 (useful if checked by mistake)
8. Your longest streak is displayed at the top

### Editing Tasks & Habits
1. Click the **green "Edit"** button on any task or habit
2. The input form at the top fills with current values
3. Form highlights in yellow to indicate edit mode
4. An "Editing Task/Habit" label appears
5. Modify the information as needed
6. Click **"Save Changes"** (green button) to update
7. Or click **"Cancel"** (gray button) to discard changes
8. Form returns to normal state after saving or canceling

### Statistics
- **Tasks:** Total tasks, Completed count, Pending count
- **Habits:** Active habits count, Longest streak achieved
- All statistics update in real-time as you interact with the app

## Design Philosophy

This app captures the essence of a productive classroom environment:
- **Familiar & Comfortable**: The whiteboard design evokes memories of focused learning
- **Playful Yet Professional**: Handwritten fonts and marker colors add personality without sacrificing functionality
- **Organized Creativity**: Clear structure encourages consistency while maintaining a creative, friendly atmosphere
- **Tactile Digital Experience**: Frame, tray, and markers create depth and realism

The goal is to make productivity feel less like work and more like being in an inspiring classroom setting.

## Author

Created as a portfolio project to demonstrate:
- Advanced CSS techniques (gradients, shadows, 3D effects)
- Vanilla JavaScript proficiency (no frameworks)
- Creative UI/UX design
- Data persistence with localStorage
- Responsive web design
- Clean, organized code structure

## Learning Resources

This project demonstrates proficiency in:
- **Semantic HTML5** - Proper structure and accessibility
- **Advanced CSS3** - Flexbox, Grid, gradients, shadows, animations
- **Modern JavaScript (ES6+)** - Arrow functions, template literals, array methods
- **DOM Manipulation** - Creating, updating, and removing elements dynamically
- **Event Handling** - Click events, keyboard events, form submissions
- **Data Management** - CRUD operations with localStorage
- **Responsive Design** - Mobile-friendly layouts with media queries
- **UI/UX Design** - Creating intuitive, visually appealing interfaces