// Sistema de Invitación Personalizada con QR
// Leer parámetros de URL al cargar la página
function initPersonalizedInvitation() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('invitado');
    const guestPases = urlParams.get('pases');

    if (guestName && guestPases) {
        // Mostrar sección de bienvenida personalizada
        const welcomeSection = document.getElementById('personalizedWelcome');
        const welcomeText = document.getElementById('guestWelcomeText');
        const passesText = document.getElementById('guestPassesText');

        if (welcomeSection && welcomeText && passesText) {
            welcomeText.textContent = `${guestName}, estás cordialmente invitado(a) a celebrar mis XV años`;
            passesText.innerHTML = `<i class="fas fa-ticket-alt"></i> ${guestPases} ${guestPases == 1 ? 'pase asignado' : 'pases asignados'}`;
            welcomeSection.style.display = 'block';
        }

        // Auto-completar formulario RSVP
        const nameInput = document.getElementById('name');
        const guestsInput = document.getElementById('guests');

        if (nameInput) nameInput.value = guestName;
        if (guestsInput) guestsInput.value = guestPases;

        // Guardar datos del QR en localStorage para tracking
        saveQRConfirmation(guestName, guestPases, 'visited');
    }
}

// Guardar confirmaciones en localStorage
function saveQRConfirmation(guestName, pases, status = 'visited') {
    const confirmations = JSON.parse(localStorage.getItem('xv-barbara-brittany-confirmations') || '[]');

    // Verificar si ya existe
    const existingIndex = confirmations.findIndex(c => c.name === guestName);

    const confirmation = {
        name: guestName,
        pases: pases,
        status: status,
        timestamp: new Date().toISOString(),
        url: window.location.href
    };

    if (existingIndex >= 0) {
        confirmations[existingIndex] = confirmation;
    } else {
        confirmations.push(confirmation);
    }

    localStorage.setItem('xv-barbara-brittany-confirmations', JSON.stringify(confirmations));
}

// Inicializar invitación personalizada al cargar la página
document.addEventListener('DOMContentLoaded', initPersonalizedInvitation);

// Countdown Timer - Carga la fecha desde evento.json
let eventoDataForCountdown = null;

async function loadEventDataForCountdown() {
    try {
        if (window.EVENTO_DATA) {
            eventoDataForCountdown = window.EVENTO_DATA;
            return;
        }
        const response = await fetch('data/data.json');
        eventoDataForCountdown = await response.json();
    } catch (error) {
        console.error('Error cargando fecha del evento:', error);
    }
}

function updateCountdown() {
    if (!eventoDataForCountdown || !eventoDataForCountdown.fechas) {
        // Si no hay datos aún, usar fecha por defecto temporalmente
        const eventDate = new Date(2026, 3, 11, 16, 0, 0).getTime();
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        }
        return;
    }

    // Construir fecha desde JSON
    const fechaEvento = eventoDataForCountdown.fechas.evento; // "2026-04-11"
    const horaEvento = eventoDataForCountdown.fechas.horaMisa || "16:00"; // "16:00"

    const [year, month, day] = fechaEvento.split('-').map(Number);
    const [hours, minutes] = horaEvento.split(':').map(Number);

    const eventDate = new Date(year, month - 1, day, hours, minutes, 0).getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        const countdownEl = document.getElementById('countdown');
        if (countdownEl) {
            countdownEl.innerHTML = '<p style="text-align: center; font-size: 1.5rem; color: var(--gold);">¡El evento ya comenzó! 🎉</p>';
        }
        return;
    }

    const daysLeft = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.textContent = String(daysLeft).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hoursLeft).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutesLeft).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(secondsLeft).padStart(2, '0');
}

// Cargar datos y luego iniciar countdown
loadEventDataForCountdown().then(() => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
});

// Helper function para formatear fecha desde JSON
function formatDateFromJSON(dateStr) {
    const [year, month, day] = dateStr.split('-');
    const fecha = new Date(year, month - 1, day);
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-MX', opciones);
    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
}

// Helper function para formatear fecha corta
function formatShortDateFromJSON(dateStr) {
    const [year, month, day] = dateStr.split('-');
    const fecha = new Date(year, month - 1, day);
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getFullYear();
}

// Helper para formato de calendario (YYYYMMDDTHHMMSS)
function getCalendarDate(dateStr, timeStr) {
    const [year, month, day] = dateStr.split('-');
    const [hours, minutes] = timeStr.split(':');
    return year + month + day + 'T' + hours + minutes + '00';
}

// Add to Calendar - Carga desde JSON
function addToCalendar(type) {
    if (!eventoDataForCountdown) {
        alert('Cargando datos del evento...');
        return;
    }

    const nombre = eventoDataForCountdown.quinceañera?.nombre || 'Barbara Brittany';
    const fechaEvento = eventoDataForCountdown.fechas?.evento || '2026-04-11';
    const horaMisa = eventoDataForCountdown.fechas?.horaMisa || '16:00';
    const horaRecepcion = eventoDataForCountdown.fechas?.horaRecepcion || '18:30';
    const iglesiaLugar = eventoDataForCountdown.ubicaciones?.iglesia?.nombre || 'La Joya, León, Guanajuato';
    const salonLugar = eventoDataForCountdown.ubicaciones?.salon?.nombre || 'La Joya, León, Guanajuato';

    const title = type === 'ceremony'
        ? 'XV Años ' + nombre + ' - Ceremonia'
        : 'XV Años ' + nombre + ' - Recepción';

    const location = type === 'ceremony' ? iglesiaLugar : salonLugar;

    const startTime = type === 'ceremony'
        ? getCalendarDate(fechaEvento, horaMisa)
        : getCalendarDate(fechaEvento, horaRecepcion);

    // Calcular endTime (1 hora después para ceremonia, hasta las 2am para recepción)
    const endTime = type === 'ceremony'
        ? getCalendarDate(fechaEvento, String(parseInt(horaMisa.split(':')[0]) + 1).padStart(2, '0') + ':00')
        : getNextDayDate(fechaEvento) + 'T020000';

    const googleCalendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
        encodeURIComponent(title) +
        '&dates=' + startTime + '/' + endTime +
        '&details=' + encodeURIComponent('XV Años de ' + nombre) +
        '&location=' + encodeURIComponent(location);

    window.open(googleCalendarUrl, '_blank');
}

// Helper para obtener fecha del día siguiente
function getNextDayDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    const fecha = new Date(year, month - 1, day);
    fecha.setDate(fecha.getDate() + 1);
    return fecha.getFullYear() +
           String(fecha.getMonth() + 1).padStart(2, '0') +
           String(fecha.getDate()).padStart(2, '0');
}

// RSVP Form Submission - Carga desde JSON
function submitRSVP(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const guests = formData.get('guests');
    const attendance = formData.get('attendance');
    const message = formData.get('message') || 'Sin mensaje';

    // Guardar confirmación en localStorage
    saveQRConfirmation(name, guests, attendance === 'si' ? 'confirmed' : 'declined');

    const nombre = eventoDataForCountdown?.quinceañera?.nombre || 'Barbara Brittany';
    const fechaEvento = eventoDataForCountdown?.fechas?.evento || '2026-04-11';
    const fechaFormateada = formatShortDateFromJSON(fechaEvento);
    const whatsappNumber = eventoDataForCountdown?.contacto?.whatsappFormat || '524779203776';

    const whatsappMessage = `
✨ CONFIRMACIÓN XV AÑOS - ${nombre.toUpperCase()} ✨

👤 Nombre: ${name}
📱 Teléfono: ${phone}
👥 Invitados: ${guests}
✅ Asistencia: ${attendance === 'si' ? 'Sí asistiré' : 'No podré asistir'}
💬 Mensaje: ${message}

📅 Fecha: ${fechaFormateada}
    `.trim();

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    const successMsg = document.getElementById('successMessage');
    if (successMsg) {
        successMsg.style.display = 'block';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 5000);
    }

    event.target.reset();
}

// Social Sharing - Carga desde JSON
function shareWhatsApp() {
    const nombre = eventoDataForCountdown?.quinceañera?.nombre || 'Barbara Brittany';
    const fechaEvento = eventoDataForCountdown?.fechas?.evento || '2026-04-11';
    const fechaFormateada = formatShortDateFromJSON(fechaEvento);
    const text = `¡Estás invitado a mis XV años! 👑✨ - ${nombre} - ${fechaFormateada}`;
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
}

function shareFacebook() {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

function shareTwitter() {
    const nombre = eventoDataForCountdown?.quinceañera?.nombre || 'Barbara Brittany';
    const fechaEvento = eventoDataForCountdown?.fechas?.evento || '2026-04-11';
    const fechaFormateada = formatShortDateFromJSON(fechaEvento);
    const text = `¡Estás invitado a mis XV años! 👑✨ - ${nombre} - ${fechaFormateada}`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('¡Enlace copiado al portapapeles!');
    }).catch(() => {
        prompt('Copia este enlace:', url);
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
