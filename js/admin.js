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

    // Actualizar con fecha real desde Supabase/dataLoader
    if (typeof dataLoader !== 'undefined') {
        dataLoader.loadData().then(data => {
            if (data?.fechas?.evento) {
                const [year, month, day] = data.fechas.evento.split('-').map(Number);
                const eventDate = new Date(year, month - 1, day).getTime();
                updateDisplay(eventDate);
            }
        }).catch(error => console.error('Error cargando fecha:', error));
    }
}

// Save tasks to localStorage
function saveTasks() {
    const checkboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    const tasks = {};
    checkboxes.forEach(checkbox => {
        tasks[checkbox.id] = checkbox.checked;
    });
    localStorage.setItem('xv-barbara-brittany-tasks', JSON.stringify(tasks));
    if (typeof DATA_MANAGER !== 'undefined') DATA_MANAGER._pushSection('xv-barbara-brittany-tasks', tasks);
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

// Load guest statistics from JSON and localStorage
async function loadGuestStats() {
    try {
        const eventoResponse = await fetch('data/data.json');
        const eventoData = await eventoResponse.json();

        // Load estimated count from JSON
        const estimado = eventoData.invitados?.numeroEstimado || 300;
        const estimadoEl = document.getElementById('totalInvitadosEstimado');
        if (estimadoEl) {
            estimadoEl.textContent = estimado;
        }

        // Load actual confirmations from localStorage
        const guests = JSON.parse(localStorage.getItem('xv-barbara-brittany-guests') || '[]');
        const confirmados = guests.filter(g => g.status === 'confirmado').length;
        const confirmadosEl = document.getElementById('confirmadosCount');
        if (confirmadosEl) {
            confirmadosEl.textContent = confirmados;
        }
    } catch (error) {
        console.error('Error loading guest stats:', error);
    }
}

// Load service contacts from JSON
async function loadServiceContacts() {
    try {
        // Cargar datos consolidados
        const response = await fetch('data/data.json');
        const data = await response.json();

        // Actualizar Salón
        if (data.ubicaciones?.salon) {
            const salon = data.ubicaciones.salon;
            document.getElementById('salonInfo').textContent = salon.nombre || 'Pendiente de contratar';
            document.getElementById('salonTel').textContent = salon.telefono || '---';
        }

        // Actualizar Banquete
        if (data.servicios?.banquete) {
            const banquete = data.servicios.banquete;
            if (banquete.activo && banquete.contacto) {
                document.getElementById('banqueteInfo').textContent = 'Foro 7 / Producciones LUZEL';
                document.getElementById('banqueteTel').textContent = data.administrador?.telefono || '477-920-3776';
            } else {
                document.getElementById('banqueteInfo').textContent = 'Pendiente de contratar';
                document.getElementById('banqueteTel').textContent = '---';
            }
        }

        // Actualizar Fotografía
        if (data.servicios?.fotografia) {
            const fotografia = data.servicios.fotografia;
            if (fotografia.activo) {
                document.getElementById('fotografiaInfo').textContent = data.administrador?.nombre || 'Producciones Foro 7';
                document.getElementById('fotografiaTel').textContent = data.administrador?.telefono || '477-920-3776';
            } else {
                document.getElementById('fotografiaInfo').textContent = 'Pendiente de contratar';
                document.getElementById('fotografiaTel').textContent = '---';
            }
        }

        // Actualizar Música
        if (data.servicios?.musica) {
            const musica = data.servicios.musica;
            if (musica.activo && musica.costoTotal) {
                document.getElementById('musicaInfo').textContent = 'Foro 7';
                document.getElementById('musicaTel').textContent = data.administrador?.telefono || '477-920-3776';
            } else {
                document.getElementById('musicaInfo').textContent = 'Pendiente de contratar';
                document.getElementById('musicaTel').textContent = '---';
            }
        }

    } catch (error) {
        console.error('Error cargando contactos de servicios:', error);
    }
}

// Handle checkbox changes
document.addEventListener('DOMContentLoaded', () => {
    updateDaysRemaining();
    loadTasks();
    loadGuestStats();
    loadServiceContacts();

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
