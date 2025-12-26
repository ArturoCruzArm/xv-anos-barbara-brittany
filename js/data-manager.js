// Sistema Centralizado de Gestión de Datos
// Funciona completamente del lado del cliente con localStorage

const DATA_MANAGER = {
    // Claves de localStorage
    KEYS: {
        GUESTS: 'xv-barbara-brittany-guests',
        TABLES: 'xv-barbara-brittany-tables',
        TABLE_ASSIGNMENTS: 'xv-barbara-brittany-table-assignments',
        BUDGET: 'xv-barbara-brittany-budget',
        TASKS: 'xv-barbara-brittany-tasks',
        SUPPLIERS: 'xv-barbara-brittany-suppliers',
        NOTES: 'xv-barbara-brittany-notes'
    },

    // Exportar todos los datos a JSON
    exportAll: function() {
        const data = {
            timestamp: new Date().toISOString(),
            event: 'XV Años Barbara Brittany - 11 Abril 2026',
            data: {}
        };

        // Exportar todos los datos de localStorage
        for (let key in this.KEYS) {
            const storageKey = this.KEYS[key];
            const value = localStorage.getItem(storageKey);
            data.data[storageKey] = value ? JSON.parse(value) : null;
        }

        return JSON.stringify(data, null, 2);
    },

    // Importar datos desde JSON
    importAll: function(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            if (!data.data) {
                throw new Error('Formato de datos inválido');
            }

            let imported = 0;
            for (let key in data.data) {
                if (data.data[key] !== null) {
                    localStorage.setItem(key, JSON.stringify(data.data[key]));
                    imported++;
                }
            }

            return { success: true, imported: imported };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Exportar datos de una sección específica
    exportSection: function(sectionKey) {
        const key = this.KEYS[sectionKey];
        if (!key) return null;

        const value = localStorage.getItem(key);
        const data = {
            timestamp: new Date().toISOString(),
            section: sectionKey,
            data: value ? JSON.parse(value) : []
        };

        return JSON.stringify(data, null, 2);
    },

    // Importar datos de una sección específica
    importSection: function(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            if (!data.section || !data.data) {
                throw new Error('Formato de datos inválido');
            }

            const key = this.KEYS[data.section];
            if (!key) {
                throw new Error('Sección desconocida: ' + data.section);
            }

            localStorage.setItem(key, JSON.stringify(data.data));
            return { success: true, section: data.section };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Limpiar todos los datos
    clearAll: function() {
        if (confirm('⚠️ ADVERTENCIA: Esto borrará TODOS los datos guardados.\n\n¿Estás seguro?')) {
            for (let key in this.KEYS) {
                localStorage.removeItem(this.KEYS[key]);
            }
            alert('✅ Todos los datos han sido borrados');
            location.reload();
        }
    },

    // Enviar backup por WhatsApp
    sendViaWhatsApp: function(jsonData, fileName = 'backup') {
        const date = new Date().toLocaleDateString('es-MX');
        const message = `📊 *Backup XV Años Barbara Brittany*\n📅 Fecha: ${date}\n📝 Archivo: ${fileName}.json\n\n⬇️ Copia el siguiente JSON y guárdalo en un archivo seguro:\n\n\`\`\`json\n${jsonData}\n\`\`\``;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    },

    // Descargar como archivo
    downloadJSON: function(jsonData, fileName = 'xv-barbara-brittany-backup') {
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
};

// Crear botones de backup en la página
function addBackupButtons() {
    // Verificar si ya existen
    if (document.getElementById('backup-section')) return;

    const container = document.querySelector('.admin-container') || document.querySelector('.container');
    if (!container) return;

    const backupSection = document.createElement('div');
    backupSection.id = 'backup-section';
    backupSection.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9998;
        display: flex;
        gap: 10px;
        flex-direction: column;
    `;

    backupSection.innerHTML = `
        <button onclick="openBackupModal()" class="backup-btn" title="Gestionar Datos">
            <i class="fas fa-database"></i>
        </button>
    `;

    container.appendChild(backupSection);

    // Agregar estilos
    const style = document.createElement('style');
    style.textContent = `
        .backup-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 1.5rem;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
        }
        .backup-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
        }
        .backup-modal {
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            align-items: center;
            justify-content: center;
        }
        .backup-modal.active {
            display: flex;
        }
        .backup-content {
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        .backup-title {
            font-size: 1.8rem;
            margin-bottom: 20px;
            color: #333;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .backup-actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .action-btn {
            padding: 15px 20px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            justify-content: center;
        }
        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .btn-export { background: #00b894; color: white; }
        .btn-import { background: #0984e3; color: white; }
        .btn-whatsapp { background: #25D366; color: white; }
        .btn-download { background: #6c5ce7; color: white; }
        .btn-clear { background: #d63031; color: white; }
        .import-area {
            margin-top: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .import-area textarea {
            width: 100%;
            min-height: 200px;
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
        }
    `;
    document.head.appendChild(style);

    // Crear modal de backup
    createBackupModal();
}

function createBackupModal() {
    const modal = document.createElement('div');
    modal.id = 'backupModal';
    modal.className = 'backup-modal';
    modal.innerHTML = `
        <div class="backup-content">
            <h2 class="backup-title">
                <i class="fas fa-database"></i> Gestión de Datos
            </h2>
            <p style="color: #636e72; margin-bottom: 20px;">
                Exporta tus datos para hacer backup o impórtalos para restaurar información guardada
            </p>

            <div class="backup-actions">
                <button class="action-btn btn-export" onclick="exportData()">
                    <i class="fas fa-file-export"></i> Exportar Todo
                </button>
                <button class="action-btn btn-whatsapp" onclick="sendBackupWhatsApp()">
                    <i class="fab fa-whatsapp"></i> Enviar por WhatsApp
                </button>
                <button class="action-btn btn-download" onclick="downloadBackup()">
                    <i class="fas fa-download"></i> Descargar JSON
                </button>
                <button class="action-btn btn-clear" onclick="DATA_MANAGER.clearAll()">
                    <i class="fas fa-trash"></i> Borrar Todo
                </button>
            </div>

            <div class="import-area">
                <h3 style="margin-bottom: 15px;"><i class="fas fa-file-import"></i> Importar Datos</h3>
                <textarea id="importJSON" placeholder="Pega aquí el JSON de backup..."></textarea>
                <button class="action-btn btn-import" onclick="importData()" style="width: 100%; margin-top: 15px;">
                    <i class="fas fa-upload"></i> Importar Datos
                </button>
            </div>

            <button onclick="closeBackupModal()" style="margin-top: 20px; padding: 10px 20px; border: 2px solid #ddd; background: white; border-radius: 8px; cursor: pointer; width: 100%;">
                Cerrar
            </button>
        </div>
    `;
    document.body.appendChild(modal);

    // Cerrar al hacer click fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeBackupModal();
    });
}

function openBackupModal() {
    document.getElementById('backupModal').classList.add('active');
}

function closeBackupModal() {
    document.getElementById('backupModal').classList.remove('active');
}

function exportData() {
    const data = DATA_MANAGER.exportAll();
    document.getElementById('importJSON').value = data;
    alert('✅ Datos exportados. Puedes copiar el JSON o usar los botones de "Enviar" o "Descargar"');
}

function importData() {
    const json = document.getElementById('importJSON').value.trim();
    if (!json) {
        alert('❌ Por favor pega el JSON de backup primero');
        return;
    }

    const result = DATA_MANAGER.importAll(json);
    if (result.success) {
        alert(`✅ Datos importados correctamente!\n\nSecciones importadas: ${result.imported}\n\nLa página se recargará.`);
        location.reload();
    } else {
        alert(`❌ Error al importar datos:\n\n${result.error}`);
    }
}

function sendBackupWhatsApp() {
    const data = DATA_MANAGER.exportAll();
    DATA_MANAGER.sendViaWhatsApp(data, 'xv-barbara-brittany-completo');
}

function downloadBackup() {
    const data = DATA_MANAGER.exportAll();
    DATA_MANAGER.downloadJSON(data, 'xv-barbara-brittany-backup');
    alert('✅ Archivo descargado. Guárdalo en un lugar seguro!');
}

// Inicializar cuando la página carga
document.addEventListener('DOMContentLoaded', () => {
    addBackupButtons();
});
