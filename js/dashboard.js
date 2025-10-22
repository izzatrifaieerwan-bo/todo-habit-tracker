let charts = {
    completion: null,
    category: null,
    priority: null,
    status: null
};

function toggleDashboard() {
    const panel = document.getElementById('dashboard-panel');
    const button = document.querySelector('.dashboard-toggle-btn');
    const isOpen = panel.classList.contains('open');
    
    if (isOpen) {
        // Close dashboard
        panel.classList.remove('open');
        button.classList.remove('active');
        button.innerHTML = '<span id="dashboard-toggle-icon">📊</span> View Statistics';
    } else {
        // Open dashboard
        panel.classList.add('open');
        button.classList.add('active');
        button.innerHTML = '<span id="dashboard-toggle-icon">📊</span> Hide Statistics';
        
        // Update charts when opening
        updateDashboard();
    }
}

function updateDashboard() {
    if (tasks.length === 0) {
        showEmptyDashboard();
        return;
    }
    
    updateCompletionChart();
    updateCategoryChart();
    updatePriorityChart();
    updateStatusChart();
}

function showEmptyDashboard() {
    const chartsGrid = document.querySelector('.charts-grid');
    chartsGrid.innerHTML = '<div class="dashboard-empty">Add some tasks to see statistics! 📊</div>';
}

function updateCompletionChart() {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;
    
    const ctx = document.getElementById('completionChart');
    
    // Destroy existing chart if it exists
    if (charts.completion) {
        charts.completion.destroy();
    }
    
    // Get theme colors
    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? '#e8e8d0' : '#2c3e50';
    
    charts.completion = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{
                data: [completed, pending],
                backgroundColor: [
                    'rgba(80, 200, 120, 0.8)',
                    'rgba(74, 144, 226, 0.8)'
                ],
                borderColor: [
                    'rgba(80, 200, 120, 1)',
                    'rgba(74, 144, 226, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14,
                            family: 'Caveat'
                        },
                        color: textColor,
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = completed + pending;
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function updateCategoryChart() {
    const categories = ['work', 'personal', 'shopping', 'school', 'health', 'other'];
    const categoryCounts = categories.map(cat => 
        tasks.filter(t => (t.category || 'other') === cat).length
    );
    
    const ctx = document.getElementById('categoryChart');
    
    if (charts.category) {
        charts.category.destroy();
    }
    
    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? '#e8e8d0' : '#2c3e50';
    const gridColor = isDark ? 'rgba(232, 232, 208, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    charts.category = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Work', 'Personal', 'Shopping', 'School', 'Health', 'Other'],
            datasets: [{
                label: 'Tasks',
                data: categoryCounts,
                backgroundColor: [
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(241, 196, 15, 0.7)',
                    'rgba(155, 89, 182, 0.7)',
                    'rgba(231, 76, 60, 0.7)',
                    'rgba(149, 165, 166, 0.7)'
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(241, 196, 15, 1)',
                    'rgba(155, 89, 182, 1)',
                    'rgba(231, 76, 60, 1)',
                    'rgba(149, 165, 166, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: textColor,
                        font: {
                            family: 'Caveat',
                            size: 12
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor,
                        font: {
                            family: 'Caveat',
                            size: 12
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function updatePriorityChart() {
    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'low').length;
    
    const ctx = document.getElementById('priorityChart');
    
    if (charts.priority) {
        charts.priority.destroy();
    }
    
    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? '#e8e8d0' : '#2c3e50';
    
    charts.priority = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['High Priority', 'Medium Priority', 'Low Priority'],
            datasets: [{
                data: [highPriority, mediumPriority, lowPriority],
                backgroundColor: [
                    'rgba(231, 76, 60, 0.8)',
                    'rgba(243, 156, 18, 0.8)',
                    'rgba(52, 152, 219, 0.8)'
                ],
                borderColor: [
                    'rgba(231, 76, 60, 1)',
                    'rgba(243, 156, 18, 1)',
                    'rgba(52, 152, 219, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14,
                            family: 'Caveat'
                        },
                        color: textColor,
                        padding: 15
                    }
                }
            }
        }
    });
}

function updateStatusChart() {
    const completed = tasks.filter(t => t.completed).length;
    const overdue = tasks.filter(t => isTaskOverdue(t)).length;
    const pending = tasks.filter(t => !t.completed && !isTaskOverdue(t)).length;
    
    const ctx = document.getElementById('statusChart');
    
    if (charts.status) {
        charts.status.destroy();
    }
    
    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? '#e8e8d0' : '#2c3e50';
    const gridColor = isDark ? 'rgba(232, 232, 208, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    charts.status = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Completed', 'Overdue', 'Pending'],
            datasets: [{
                label: 'Tasks',
                data: [completed, overdue, pending],
                backgroundColor: [
                    'rgba(80, 200, 120, 0.7)',
                    'rgba(231, 76, 60, 0.7)',
                    'rgba(74, 144, 226, 0.7)'
                ],
                borderColor: [
                    'rgba(80, 200, 120, 1)',
                    'rgba(231, 76, 60, 1)',
                    'rgba(74, 144, 226, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: textColor,
                        font: {
                            family: 'Caveat',
                            size: 12
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor,
                        font: {
                            family: 'Caveat',
                            size: 12
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function updateDashboardTheme() {
    const panel = document.getElementById('dashboard-panel');
    if (panel.classList.contains('open')) {
        updateDashboard();
    }
}