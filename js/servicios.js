// Generic service page functionality

// Save button handlers
document.addEventListener('DOMContentLoaded', () => {
    // Save buttons
    const saveButtons = document.querySelectorAll('.btn-save');
    saveButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Mostrar advertencia sobre localStorage
            const mensaje = '💾 DATOS GUARDADOS LOCALMENTE

' +
                          '✅ La información se guardó en tu navegador

' +
                          '⚠️ IMPORTANTE:
' +
                          'Para CONFIRMAR los cambios y que yo los reciba,
' +
                          'debes usar el botón:
' +
                          '"Enviar información por WhatsApp"

' +
                          'Los datos guardados aquí solo están en tu dispositivo.';
            
            alert(mensaje);
            
            // Highlight del botón de WhatsApp por 3 segundos
            const whatsappBtn = document.querySelector('.btn-whatsapp');
            if (whatsappBtn) {
                whatsappBtn.style.animation = 'pulse 1s ease-in-out 3';
                whatsappBtn.style.boxShadow = '0 0 20px rgba(37, 211, 102, 0.8)';
                setTimeout(() => {
                    whatsappBtn.style.animation = '';
                    whatsappBtn.style.boxShadow = '';
                }, 3000);
            }
        });
    });

    // Contact buttons
    const contactButtons = document.querySelectorAll('.btn-contact');
    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.contact-card');
            const name = card.querySelector('h4').textContent;
            alert(`Abriendo WhatsApp para contactar con ${name}...`);
        });
    });

    // Schedule buttons
    const scheduleButtons = document.querySelectorAll('.btn-schedule');
    scheduleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const date = prompt('Ingresa la fecha para la cita (DD/MM/YYYY):');
            if (date) {
                const timeInfo = this.previousElementSibling.querySelector('p');
                timeInfo.textContent = `Programado para: ${date}`;
                alert('✅ Cita agendada correctamente');
            }
        });
    });

    // Auto-calculate totals for budget
    const costInputs = document.querySelectorAll('input[type="number"]');
    costInputs.forEach(input => {
        input.addEventListener('input', calculateTotal);
    });
});

function calculateTotal() {
    const costPerPerson = parseFloat(document.querySelector('input[placeholder="$350"]')?.value || 0);
    const numberOfPeople = parseFloat(document.querySelector('input[placeholder="150"]')?.value || 0);
    const total = costPerPerson * numberOfPeople;

    const totalField = document.querySelector('input[value^="$"]');
    if (totalField) {
        totalField.value = `$${total.toLocaleString('es-MX')}`;
    }
}
