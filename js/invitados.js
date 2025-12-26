// Guest Management System
let guests = [];
let editingGuestIndex = null;
let memberCounter = 0;

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
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px;">No hay invitados registrados</td></tr>';
        return;
    }

    tbody.innerHTML = guestsToRender.map((guest, index) => {
        // Determinar estado de invitación
        let invitationStatus = '';
        if (guest.invitacionEnviada) {
            const fecha = new Date(guest.fechaEnvio).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' });
            invitationStatus = `<span style="color: #00b894; font-size: 0.85rem;"><i class="fas fa-check-circle"></i> ${fecha}</span>`;
        } else if (!guest.phone) {
            invitationStatus = `<span style="color: #636e72; font-size: 0.85rem;"><i class="fas fa-exclamation-triangle"></i> Sin tel.</span>`;
        } else {
            invitationStatus = `<button class="btn-icon" onclick="sendInvitation(${guest.id})" title="Enviar invitación QR" style="background: #00b894; color: white;">
                <i class="fab fa-whatsapp"></i>
            </button>`;
        }

        // Mostrar miembros si existen
        let membersInfo = '';
        if (guest.members && guest.members.length > 0) {
            const membersList = guest.members.map(m => `${m.nombre} (${m.tipo})`).join(', ');
            membersInfo = `
            <tr id="members-${guest.id}" style="display: none; background: #f8f9fa;">
                <td colspan="9" style="padding: 15px 20px;">
                    <div style="display: flex; align-items: start; gap: 10px;">
                        <i class="fas fa-users" style="color: #6c5ce7; margin-top: 3px;"></i>
                        <div>
                            <strong style="color: #6c5ce7; display: block; margin-bottom: 5px;">Miembros:</strong>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${guest.members.map(m => `
                                    <span style="background: ${m.tipo === 'adulto' ? '#e3f2fd' : m.tipo === 'niño' ? '#fff3e0' : '#f3e5f5'};
                                          padding: 5px 12px; border-radius: 15px; font-size: 0.9rem;
                                          color: ${m.tipo === 'adulto' ? '#1976d2' : m.tipo === 'niño' ? '#f57c00' : '#7b1fa2'};">
                                        ${m.nombre} <span style="font-size: 0.8rem; opacity: 0.8;">(${m.tipo})</span>
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </td>
            </tr>`;
        }

        const toggleBtn = guest.members && guest.members.length > 0
            ? `<button class="btn-icon" onclick="toggleMembers(${guest.id})" title="Ver miembros" style="background: #6c5ce7; color: white; margin-left: 5px;">
                    <i class="fas fa-users" id="icon-${guest.id}"></i>
                </button>`
            : '';

        return `
        <tr data-status="${guest.status}" data-category="${guest.category}">
            <td><strong>${guest.name}</strong> ${toggleBtn}</td>
            <td><span class="badge badge-${getCategoryColor(guest.category)}">${getCategoryLabel(guest.category)}</span></td>
            <td>${guest.pases}</td>
            <td>${guest.menu}</td>
            <td>${guest.table || '-'}</td>
            <td><span class="status-badge ${getStatusClass(guest.status)}">${getStatusLabel(guest.status)}</span></td>
            <td>${guest.phone || '-'}</td>
            <td style="text-align: center;">${invitationStatus}</td>
            <td class="actions">
                <button class="btn-icon" onclick="editGuest(${guest.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" onclick="deleteGuest(${guest.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
        ${membersInfo}
        `;
    }).join('');
}

// Toggle members visibility
function toggleMembers(guestId) {
    const membersRow = document.getElementById(`members-${guestId}`);
    const icon = document.getElementById(`icon-${guestId}`);

    if (membersRow.style.display === 'none') {
        membersRow.style.display = 'table-row';
        icon.className = 'fas fa-users-slash';
    } else {
        membersRow.style.display = 'none';
        icon.className = 'fas fa-users';
    }
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
    document.getElementById('membersList').innerHTML = '';
    memberCounter = 0;
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

    // Load members
    loadMembersIntoForm(guest.members || []);

    document.getElementById('guestModal').classList.add('active');
}

// Delete guest
function deleteGuest(guestId) {
    if (confirm('¿Estás seguro de eliminar este invitado?')) {
        guests = guests.filter(g => g.id !== guestId);
        saveGuests();
    }
}

// Add member field
function addMemberField() {
    memberCounter++;
    const membersList = document.getElementById('membersList');
    const memberDiv = document.createElement('div');
    memberDiv.className = 'member-row';
    memberDiv.id = `member-${memberCounter}`;
    memberDiv.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px; align-items: center;';

    memberDiv.innerHTML = `
        <input type="text"
               class="member-name"
               placeholder="Nombre completo"
               style="flex: 2; padding: 10px; border: 2px solid var(--border); border-radius: 8px;">
        <select class="member-type"
                style="flex: 1; padding: 10px; border: 2px solid var(--border); border-radius: 8px;">
            <option value="adulto">Adulto</option>
            <option value="niño">Niño</option>
            <option value="bebé">Bebé</option>
        </select>
        <button type="button"
                class="btn-icon"
                onclick="removeMemberField(${memberCounter})"
                title="Eliminar"
                style="background: #d63031; color: white;">
            <i class="fas fa-trash"></i>
        </button>
    `;

    membersList.appendChild(memberDiv);
}

// Remove member field
function removeMemberField(id) {
    const memberDiv = document.getElementById(`member-${id}`);
    if (memberDiv) {
        memberDiv.remove();
    }
}

// Get members from form
function getMembersFromForm() {
    const members = [];
    const memberRows = document.querySelectorAll('.member-row');

    memberRows.forEach(row => {
        const name = row.querySelector('.member-name').value.trim();
        const type = row.querySelector('.member-type').value;

        if (name) {
            members.push({ nombre: name, tipo: type });
        }
    });

    return members;
}

// Load members into form
function loadMembersIntoForm(members) {
    const membersList = document.getElementById('membersList');
    membersList.innerHTML = '';
    memberCounter = 0;

    if (members && members.length > 0) {
        members.forEach(member => {
            memberCounter++;
            const memberDiv = document.createElement('div');
            memberDiv.className = 'member-row';
            memberDiv.id = `member-${memberCounter}`;
            memberDiv.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px; align-items: center;';

            memberDiv.innerHTML = `
                <input type="text"
                       class="member-name"
                       value="${member.nombre}"
                       placeholder="Nombre completo"
                       style="flex: 2; padding: 10px; border: 2px solid var(--border); border-radius: 8px;">
                <select class="member-type"
                        style="flex: 1; padding: 10px; border: 2px solid var(--border); border-radius: 8px;">
                    <option value="adulto" ${member.tipo === 'adulto' ? 'selected' : ''}>Adulto</option>
                    <option value="niño" ${member.tipo === 'niño' ? 'selected' : ''}>Niño</option>
                    <option value="bebé" ${member.tipo === 'bebé' ? 'selected' : ''}>Bebé</option>
                </select>
                <button type="button"
                        class="btn-icon"
                        onclick="removeMemberField(${memberCounter})"
                        title="Eliminar"
                        style="background: #d63031; color: white;">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            membersList.appendChild(memberDiv);
        });
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
        notes: document.getElementById('guestNotes').value,
        members: getMembersFromForm()
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

// Send invitation via WhatsApp with QR code
function sendInvitation(guestId) {
    const guest = guests.find(g => g.id === guestId);
    if (!guest) return;

    if (!guest.phone) {
        alert('⚠️ Este invitado no tiene teléfono registrado.\n\nAgrega un número de teléfono para poder enviar la invitación.');
        return;
    }

    // Generar URL personalizada para el QR
    const baseURL = 'https://barbara-brittany.invitados.org';
    const qrURL = `${baseURL}?invitado=${encodeURIComponent(guest.name)}&pases=${guest.pases}`;

    // Crear lista de miembros si existe
    let membersText = '';
    if (guest.members && guest.members.length > 0) {
        membersText = '\n\n👥 Invitación para:\n';
        guest.members.forEach(member => {
            const emoji = member.tipo === 'adulto' ? '👤' : member.tipo === 'niño' ? '👶' : '🍼';
            membersText += `${emoji} ${member.nombre}\n`;
        });
    }

    // Crear mensaje personalizado
    const message = `🎉 ¡Hola ${guest.name}!

Estás cordialmente invitado(a) a celebrar los XV años de Barbara Brittany${membersText}
📅 Fecha: 11 de abril de 2026
⏰ Ceremonia Religiosa: 4:00 PM
📍 Parroquia San Juan Bautista de la Salle

🎊 Recepción: 6:30 PM
📍 Quinta Palomares${guest.table ? `\n\n🪑 Mesa asignada: ${guest.table}` : ''}

📊 Total: ${guest.pases} ${guest.pases === 1 ? 'pase' : 'pases'}

👇 Haz clic en el siguiente enlace para ver tu invitación personalizada y confirmar tu asistencia:

${qrURL}

¡Te esperamos! 💖✨`;

    // Abrir WhatsApp
    const whatsappNumber = guest.phone.replace(/\D/g, ''); // Remover caracteres no numéricos
    const whatsappURL = `https://wa.me/52${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');

    // Marcar como enviado
    const guestIndex = guests.findIndex(g => g.id === guestId);
    if (guestIndex >= 0) {
        guests[guestIndex].invitacionEnviada = true;
        guests[guestIndex].fechaEnvio = new Date().toISOString();
        saveGuests();

        // Mostrar confirmación
        setTimeout(() => {
            if (confirm('✅ Invitación enviada\n\n¿La invitación se envió correctamente por WhatsApp?')) {
                console.log(`Invitación confirmada para ${guest.name}`);
            }
        }, 1000);
    }
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
