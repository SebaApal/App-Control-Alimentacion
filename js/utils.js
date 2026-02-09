/**
 * CalorieTracker - Utility Functions
 * Funciones de utilidad generales
 */

// Date formatting utilities
const Utils = {
    /**
     * Format date to display string
     * @param {Date} date 
     * @returns {string}
     */
    formatDate(date) {
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (this.isSameDay(date, today)) {
            return `Hoy, ${date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}`;
        } else if (this.isSameDay(date, yesterday)) {
            return `Ayer, ${date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}`;
        }
        
        return date.toLocaleDateString('es-AR', options);
    },

    /**
     * Check if two dates are the same day
     * @param {Date} date1 
     * @param {Date} date2 
     * @returns {boolean}
     */
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    },

    /**
     * Get date string for storage key (YYYY-MM-DD)
     * @param {Date} date 
     * @returns {string}
     */
    getDateKey(date) {
        return date.toISOString().split('T')[0];
    },

    /**
     * Parse date from storage key
     * @param {string} dateKey 
     * @returns {Date}
     */
    parseDateKey(dateKey) {
        return new Date(dateKey + 'T00:00:00');
    },

    /**
     * Get start of week (Monday)
     * @param {Date} date 
     * @returns {Date}
     */
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    },

    /**
     * Get dates for the last N days
     * @param {number} days 
     * @returns {Date[]}
     */
    getLastNDays(days) {
        const dates = [];
        const today = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(date);
        }
        return dates;
    },

    /**
     * Generate unique ID
     * @returns {string}
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Debounce function
     * @param {Function} func 
     * @param {number} wait 
     * @returns {Function}
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Clamp a value between min and max
     * @param {number} value 
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Round to specified decimal places
     * @param {number} value 
     * @param {number} decimals 
     * @returns {number}
     */
    round(value, decimals = 1) {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    },

    /**
     * Calculate percentage
     * @param {number} value 
     * @param {number} total 
     * @returns {number}
     */
    percentage(value, total) {
        if (total === 0) return 0;
        return Math.min(Math.round((value / total) * 100), 100);
    },

    /**
     * Show toast notification
     * @param {string} message 
     * @param {string} type - 'success', 'error', 'warning'
     */
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'success' ? '<path d="M20 6L9 17l-5-5"/>' : 
                  type === 'error' ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' :
                  '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'}
            </svg>
            <span>${message}</span>
        `;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },

    /**
     * Get meal type label in Spanish
     * @param {string} mealType 
     * @returns {string}
     */
    getMealLabel(mealType) {
        const labels = {
            breakfast: 'Desayuno',
            lunch: 'Almuerzo',
            dinner: 'Cena',
            snack: 'Snack'
        };
        return labels[mealType] || mealType;
    },

    /**
     * Get activity level label
     * @param {string} level 
     * @returns {string}
     */
    getActivityLabel(level) {
        const labels = {
            sedentary: 'Sedentario',
            light: 'Ligero',
            moderate: 'Moderado',
            intense: 'Intenso',
            very_intense: 'Muy Intenso'
        };
        return labels[level] || level;
    },

    /**
     * Get goal label
     * @param {string} goal 
     * @returns {string}
     */
    getGoalLabel(goal) {
        const labels = {
            deficit: 'Perder peso',
            maintenance: 'Mantener peso',
            surplus: 'Ganar masa'
        };
        return labels[goal] || goal;
    },

    /**
     * Get random food image placeholder
     * @param {string} foodName 
     * @returns {string}
     */
    getFoodImage(foodName) {
        // Use a simple hash to get consistent colors for the same food
        const hash = foodName.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        
        const hue = Math.abs(hash) % 360;
        return `linear-gradient(135deg, hsl(${hue}, 60%, 80%) 0%, hsl(${hue + 30}, 50%, 70%) 100%)`;
    }
};

// Make Utils available globally
window.Utils = Utils;
