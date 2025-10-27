// ================================
// TOAST.JS - Toast Notification System
// ================================

// Show a toast notification
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Choose icon based on type
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    const icon = icons[type] || icons.info;
    
    // Build toast HTML
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="closeToast(this)">×</button>
    `;
    
    // Add to container
    container.appendChild(toast);
    
    // Auto-remove after duration
    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

// Close toast manually
function closeToast(button) {
    const toast = button.closest('.toast');
    removeToast(toast);
}

// Remove toast with animation
function removeToast(toast) {
    if (!toast) return;
    
    toast.style.animation = 'fadeOut 0.3s ease-out';
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Convenience functions
function successToast(message) {
    showToast(message, 'success');
}

function errorToast(message) {
    showToast(message, 'error');
}

function warningToast(message) {
    showToast(message, 'warning');
}

function infoToast(message) {
    showToast(message, 'info');
}