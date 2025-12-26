// Calculate days remaining
function updateDaysRemaining() {
    // Función helper para actualizar el DOM
    function updateDisplay(eventDate) {
        const today = new Date().getTime();
        const difference = eventDate - today;
        const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

        const daysElement = document.getElementById('daysRemaining');
        if (daysElement) {
            daysElement.textContent = days > 0 ? days : '¡Hoy!';
        }
    }

    // Fecha por defecto
    const defaultDate = new Date(2026, 3, 11).getTime(); // 11 de abril de 2026
    updateDisplay(defaultDate);

    // Actualizar con fecha real desde JSON
    fetch('data/evento.json')
        .then(response => response.json())
        .then(data => {
            if (data.fechas?.evento) {
                const [year, month, day] = data.fechas.evento.split('-').map(Number);
                const eventDate = new Date(year, month - 1, day).getTime();
                updateDisplay(eventDate); // Actualizar con fecha del JSON
            }
        })
        .catch(error => console.error('Error cargando fecha:', error));
}

// Save tasks to localStorage
function saveTasks() {
    const checkboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    const tasks = {};
    checkboxes.forEach(checkbox => {
        tasks[checkbox.id] = checkbox.checked;
    });
    localStorage.setItem('xv-barbara-brittany-tasks', JSON.stringify(tasks));
    updateTasksCount();
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('xv-barbara-brittany-tasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        Object.keys(tasks).forEach(taskId => {
            const checkbox = document.getElementById(taskId);
            if (checkbox) {
                checkbox.checked = tasks[taskId];
                if (tasks[taskId]) {
                    checkbox.parentElement.style.opacity = '0.6';
                    checkbox.parentElement.querySelector('label').style.textDecoration = 'line-through';
                }
            }
        });
    }
    updateTasksCount();
}

// Update tasks count
function updateTasksCount() {
    const checkboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    const total = checkboxes.length;
    const completed = Array.from(checkboxes).filter(cb => cb.checked).length;

    // Update dashboard stat if it exists
    const statValue = document.querySelector('.stat-card:nth-child(4) .stat-value');
    if (statValue) {
        statValue.textContent = `${completed}/${total}`;
    }
}

// Handle checkbox changes
document.addEventListener('DOMContentLoaded', () => {
    updateDaysRemaining();
    loadTasks();

    const checkboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskItem = this.parentElement;
            const label = taskItem.querySelector('label');

            if (this.checked) {
                taskItem.style.opacity = '0.6';
                label.style.textDecoration = 'line-through';
            } else {
                taskItem.style.opacity = '1';
                label.style.textDecoration = 'none';
            }

            saveTasks();
        });
    });
});

// Update days remaining every hour
setInterval(updateDaysRemaining, 3600000);
