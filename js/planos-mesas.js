// Planos de Mesas - Carga desde localStorage
let tables = [];
let guests = [];
let assignments = {};

// Cargar al inicio de la página
document.addEventListener('DOMContentLoaded', () => {
    loadGuestsFromLocalStorage();
    loadTablesFromLocalStorage();
    createTablesFromGuests();
    renderFloorPlan();
    renderAssignments();
});

// Cargar invitados desde localStorage
function loadGuestsFromLocalStorage() {
    const saved = localStorage.getItem('xv-barbara-brittany-guests');
    if (saved) {
        guests = JSON.parse(saved);
        console.log('Invitados cargados:', guests.length);
    } else {
        console.warn('No hay invitados en localStorage');
    }
}

// Cargar mesas desde localStorage
function loadTablesFromLocalStorage() {
    const saved = localStorage.getItem('xv-barbara-brittany-tables');
    if (saved) {
        tables = JSON.parse(saved);
        console.log('Mesas cargadas:', tables.length);
    }
}

// Guardar mesas en localStorage
function saveTablesToLocalStorage() {
    localStorage.setItem('xv-barbara-brittany-tables', JSON.stringify(tables));
}

// Crear mesas automáticamente desde los invitados
function createTablesFromGuests() {
    const mesasAgrupadas = {};
    guests.forEach(guest => {
        if (guest.table) {
            const tableNum = guest.table.replace(/[^0-9]/g, '');
            if (tableNum) {
                if (!mesasAgrupadas[tableNum]) {
                    mesasAgrupadas[tableNum] = [];
                }
                mesasAgrupadas[tableNum].push(guest);
            }
        }
    });

    Object.keys(mesasAgrupadas).forEach((tableNum, index) => {
        const existingTable = tables.find(t => t.number == tableNum);
        if (!existingTable) {
            const guestsInTable = mesasAgrupadas[tableNum];
            const totalPases = guestsInTable.reduce((sum, g) => sum + (g.pases || 1), 0);
            
            const col = index % 5;
            const row = Math.floor(index / 5);
            
            tables.push({
                number: tableNum,
                capacity: totalPases,
                type: 'round',
                x: 10 + (col * 18),
                y: 10 + (row * 25)
            });
        }
    });

    Object.keys(mesasAgrupadas).forEach(tableNum => {
        assignments[tableNum] = mesasAgrupadas[tableNum];
    });

    saveTablesToLocalStorage();
    updateTableSelect();
    console.log('Mesas creadas desde invitados:', tables.length);
}

function addTable() {
    const tableNum = document.getElementById('tableNumber').value;
    const capacity = document.getElementById('tableCapacity').value;
    const tableType = document.getElementById('tableType').value;
    
    const table = { 
        number: tableNum, 
        capacity: capacity, 
        type: tableType,
        x: Math.random() * 70 + 10, 
        y: Math.random() * 70 + 10 
    };
    tables.push(table);
    saveTablesToLocalStorage();
    renderFloorPlan();
    updateTableSelect();
}

function renderFloorPlan() {
    const plan = document.getElementById('floorPlan');
    
    if (tables.length === 0) {
        plan.innerHTML = '<p style="text-align: center; color: #636e72; padding: 20px;">No hay mesas. Agrega invitados con mesa asignada en la sección de Invitados.</p>';
        return;
    }

    plan.innerHTML = tables.map(t => {
        const guestsInTable = assignments[t.number] || [];
        const guestCount = guestsInTable.length;
        const guestNames = guestsInTable.map(g => g.name).join(', ');
        
        return '<div class="table-item ' + (t.type || 'round') + '" ' +
               'style="left: ' + t.x + '%; top: ' + t.y + '%;" ' +
               'draggable="true" ' +
               'ondragstart="drag(event, ' + t.number + ')" ' +
               'title="' + guestNames + '">' +
               '<div class="table-number">Mesa ' + t.number + '</div>' +
               '<div class="table-capacity">' + t.capacity + ' lugares</div>' +
               '<div class="table-guests">' + guestCount + ' invitados</div>' +
               '</div>';
    }).join('');
}

function updateTableSelect() {
    const select = document.getElementById('selectTable');
    if (tables.length === 0) {
        select.innerHTML = '<option>Primero agrega mesas...</option>';
    } else {
        select.innerHTML = tables.map(t =>
            '<option value="' + t.number + '">Mesa ' + t.number + ' (' + t.capacity + ' personas)</option>'
        ).join('');
    }
}

function assignGuest() {
    const tableNum = document.getElementById('selectTable').value;
    const guest = document.getElementById('guestName').value;
    if (!guest) return alert('Ingresa un nombre');
    if (!assignments[tableNum]) assignments[tableNum] = [];
    assignments[tableNum].push({ name: guest, pases: 1 });
    document.getElementById('guestName').value = '';
    renderAssignments();
    renderFloorPlan();
}

function renderAssignments() {
    let html = '';
    const sortedTables = Object.keys(assignments).sort((a, b) => parseInt(a) - parseInt(b));
    
    sortedTables.forEach(tableNum => {
        const guestsInTable = assignments[tableNum];
        if (guestsInTable.length > 0) {
            html += '<div class="mesa-group">';
            html += '<h4><i class="fas fa-chair"></i> Mesa ' + tableNum + ' (' + guestsInTable.length + ' invitados)</h4>';
            html += guestsInTable.map(g => {
                const pases = g.pases > 1 ? ' (' + g.pases + ' pases)' : '';
                return '<span class="guest-chip">' + g.name + pases + '</span>';
            }).join('');
            html += '</div>';
        }
    });
    
    document.getElementById('assignedList').innerHTML = html || '<p style="text-align: center; color: #999;">No hay invitados asignados a mesas</p>';
}

function drag(event, tableNum) {
    event.dataTransfer.setData("tableNum", tableNum);
}

document.getElementById('floorPlan').addEventListener('dragover', (e) => e.preventDefault());
document.getElementById('floorPlan').addEventListener('drop', function(e) {
    e.preventDefault();
    const tableNum = e.dataTransfer.getData("tableNum");
    const table = tables.find(t => t.number == tableNum);
    if (table) {
        const rect = this.getBoundingClientRect();
        table.x = ((e.clientX - rect.left) / rect.width) * 100;
        table.y = ((e.clientY - rect.top) / rect.height) * 100;
        saveTablesToLocalStorage();
        renderFloorPlan();
    }
});
