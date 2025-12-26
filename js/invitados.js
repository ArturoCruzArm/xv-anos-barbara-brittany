// Guest Management System
let guests = [];
let editingGuestIndex = null;

// Load guests from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadGuests();
    updateStatistics();
    setupEventListeners();
});

// Load guests from localStorage
function loadGuests() {
    const saved = localStorage.getItem('xv-barbara-brittany-guests');
    if (saved) {
        guests = JSON.parse(saved);
        renderGuestsTable();
        updateStatistics();
    }
}

// Save guests to localStorage
function saveGuests() {
    localStorage.setItem('xv-barbara-brittany-guests', JSON.stringify(guests));
    renderGuestsTable();
    updateStatistics();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', filterGuests);

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterGuests();
        });
    });

    // Form submission
    document.getElementById('guestForm').addEventListener('submit', handleFormSubmit);
}

// Render guests table
function renderGuestsTable(filteredGuests = null) {
    const tbody = document.getElementById('guestsTableBody');
    const guestsToRender = filteredGuests || guests;

    if (guestsToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No hay invitados registrados</td></tr>';
        return;
    }

    tbody.innerHTML = guestsToRender.map((guest, index) => `
        <tr data-status="${guest.status}" data-category="${guest.category}">
            <td><strong>${guest.name}</strong></td>
            <td><span class="badge badge-${getCategoryColor(guest.category)}">${getCategoryLabel(guest.category)}</span></td>
            <td>${guest.pases}</td>
            <td>${guest.menu}</td>
            <td>${guest.table || '-'}</td>
            <td><span class="status-badge ${getStatusClass(guest.status)}">${getStatusLabel(guest.status)}</span></td>
            <td>${guest.phone || '-'}</td>
            <td class="actions">
                <button class="btn-icon" onclick="editGuest(${guest.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" onclick="deleteGuest(${guest.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Filter guests
function filterGuests() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

    let filtered = guests;

    // Apply status filter
    if (activeFilter !== 'all') {
        filtered = filtered.filter(g => g.status === activeFilter);
    }

    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(g =>
            g.name.toLowerCase().includes(searchTerm) ||
            (g.phone && g.phone.includes(searchTerm))
        );
    }

    renderGuestsTable(filtered);
}

// Update statistics
function updateStatistics() {
    const total = guests.length;
    const confirmed = guests.filter(g => g.status === 'confirmado').length;
    const pending = guests.filter(g => g.status === 'pendiente').length;
    const declined = guests.filter(g => g.status === 'no-asistira').length;

    document.getElementById('totalInvitados').textContent = total;
    document.getElementById('confirmados').textContent = confirmed;
    document.getElementById('pendientes').textContent = pending;
    document.getElementById('noAsistiran').textContent = declined;

    // Update category counts
    const categories = {
        familia: guests.filter(g => g.category === 'familia').length,
        padrinos: guests.filter(g => g.category === 'padrinos').length,
        amigos: guests.filter(g => g.category === 'amigos').length,
        conocidos: guests.filter(g => g.category === 'conocidos').length
    };

    document.getElementById('catFamilia').textContent = categories.familia;
    document.getElementById('catPadrinos').textContent = categories.padrinos;
    document.getElementById('catAmigos').textContent = categories.amigos;
    document.getElementById('catConocidos').textContent = categories.conocidos;
}

// Open add guest modal
function openAddGuestModal() {
    editingGuestIndex = null;
    document.getElementById('modalTitle').textContent = 'Agregar Invitado';
    document.getElementById('guestForm').reset();
    document.getElementById('guestModal').classList.add('active');
}

// Close modal
function closeGuestModal() {
    document.getElementById('guestModal').classList.remove('active');
    editingGuestIndex = null;
}

// Edit guest
function editGuest(guestId) {
    const guest = guests.find(g => g.id === guestId);
    if (!guest) return;

    editingGuestIndex = guestId;
    document.getElementById('modalTitle').textContent = 'Editar Invitado';

    // Fill form
    document.getElementById('guestName').value = guest.name;
    document.getElementById('guestPhone').value = guest.phone || '';
    document.getElementById('guestCategory').value = guest.category;
    document.getElementById('guestPases').value = guest.pases;
    document.getElementById('guestMenu').value = guest.menu;
    document.getElementById('guestTable').value = guest.table || '';
    document.getElementById('guestStatus').value = guest.status;
    document.getElementById('guestEmail').value = guest.email || '';
    document.getElementById('guestNotes').value = guest.notes || '';

    document.getElementById('guestModal').classList.add('active');
}

// Delete guest
function deleteGuest(guestId) {
    if (confirm('¿Estás seguro de eliminar este invitado?')) {
        guests = guests.filter(g => g.id !== guestId);
        saveGuests();
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    const guestData = {
        id: editingGuestIndex || Date.now(),
        name: document.getElementById('guestName').value,
        phone: document.getElementById('guestPhone').value,
        category: document.getElementById('guestCategory').value,
        pases: parseInt(document.getElementById('guestPases').value),
        menu: document.getElementById('guestMenu').value,
        table: document.getElementById('guestTable').value,
        status: document.getElementById('guestStatus').value,
        email: document.getElementById('guestEmail').value,
        notes: document.getElementById('guestNotes').value
    };

    if (editingGuestIndex) {
        // Update existing guest
        const index = guests.findIndex(g => g.id === editingGuestIndex);
        guests[index] = guestData;
    } else {
        // Add new guest
        guests.push(guestData);
    }

    saveGuests();
    closeGuestModal();
    alert('✅ Invitado guardado correctamente');
}

// Helper functions
function getCategoryColor(category) {
    const colors = {
        familia: 'purple',
        padrinos: 'orange',
        amigos: 'blue',
        conocidos: 'teal'
    };
    return colors[category] || 'purple';
}

function getCategoryLabel(category) {
    const labels = {
        familia: 'Familia',
        padrinos: 'Padrinos',
        amigos: 'Amigos',
        conocidos: 'Conocidos'
    };
    return labels[category] || category;
}

function getStatusClass(status) {
    const classes = {
        confirmado: 'confirmed',
        pendiente: 'pending',
        'no-asistira': 'declined'
    };
    return classes[status] || 'pending';
}

function getStatusLabel(status) {
    const labels = {
        confirmado: 'Confirmado',
        pendiente: 'Pendiente',
        'no-asistira': 'No Asistirá'
    };
    return labels[status] || status;
}

// Export functions
function exportToExcel() {
    alert('📊 Función de exportar a Excel próximamente.\n\nPor ahora puedes copiar la tabla manualmente.');
}

function exportToPDF() {
    alert('📄 Función de exportar a PDF próximamente.\n\nPor ahora puedes usar Ctrl+P para imprimir.');
}

function printList() {
    window.print();
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('guestModal');
    if (event.target === modal) {
        closeGuestModal();
    }
}
