/**
 * DataLoader — Supabase backend para XV Años Barbara Brittany
 * Carga y guarda datos en eventos_config (JSONB) en lugar de data.json local
 */

const SUPABASE_URL  = 'https://nzpujmlienzfetqcgsxz.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56cHVqbWxpZW56ZmV0cWNnc3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODYzMzYsImV4cCI6MjA5MDI2MjMzNn0.xl3lsb-KYj5tVLKTnzpbsdEGoV9ySnswH4eyRuyEH1s';
const BARBARA_SLUG  = 'xv-anos-barbara-brittany';
const SB_H = {
    'apikey': SUPABASE_ANON,
    'Authorization': 'Bearer ' + SUPABASE_ANON,
    'Content-Type': 'application/json'
};

class DataLoader {
    constructor() {
        this._data    = null;      // datos en memoria
        this._eventoId = null;
        this._dirty   = false;
        this._saveTimer = null;
        this.CACHE_KEY = 'xv-barbara-sb-cache';
        this.CACHE_TS  = 'xv-barbara-sb-ts';
        this.CACHE_TTL = 1000 * 60 * 30; // 30 minutos
    }

    // ── Obtener evento_id ─────────────────────────────────────────────────────
    async _getEventoId() {
        if (this._eventoId) return this._eventoId;
        const r = await fetch(
            `${SUPABASE_URL}/rest/v1/eventos?slug=eq.${BARBARA_SLUG}&select=id&limit=1`,
            { headers: SB_H }
        );
        const rows = await r.json();
        this._eventoId = rows[0]?.id || null;
        return this._eventoId;
    }

    // ── Cargar datos desde Supabase (con caché localStorage) ─────────────────
    async loadData() {
        // 1. Memoria
        if (this._data) return this._data;

        // 2. localStorage cache (válido < 30 min)
        try {
            const ts = parseInt(localStorage.getItem(this.CACHE_TS) || '0');
            if (Date.now() - ts < this.CACHE_TTL) {
                const cached = localStorage.getItem(this.CACHE_KEY);
                if (cached) {
                    this._data = JSON.parse(cached);
                    console.log('✓ Barbara datos cargados desde caché localStorage');
                    return this._data;
                }
            }
        } catch(e) {}

        // 3. Supabase
        try {
            const eid = await this._getEventoId();
            if (!eid) throw new Error('evento_id no encontrado');

            const r = await fetch(
                `${SUPABASE_URL}/rest/v1/eventos_config?evento_id=eq.${eid}&seccion=eq.main&select=datos`,
                { headers: SB_H }
            );
            const rows = await r.json();
            if (!rows[0]?.datos) throw new Error('Sin datos en Supabase');

            this._data = rows[0].datos;
            // Guardar en caché
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(this._data));
            localStorage.setItem(this.CACHE_TS,  Date.now().toString());
            console.log('✓ Barbara datos cargados desde Supabase');

            // Exponer como window.EVENTO_DATA para compatibilidad
            window.EVENTO_DATA = this._data;
            return this._data;

        } catch(err) {
            console.error('✗ Error cargando desde Supabase:', err);

            // Fallback: window.EVENTO_DATA (data.js incluido en HTML como backup)
            if (window.EVENTO_DATA) {
                this._data = window.EVENTO_DATA;
                console.warn('⚠ Usando window.EVENTO_DATA como fallback');
                return this._data;
            }
            return null;
        }
    }

    // ── Alias compatible con código anterior ─────────────────────────────────
    async loadJSON(file) {
        return this.loadData();
    }

    // ── Guardar cambios a Supabase (debounced 1s) ─────────────────────────────
    scheduleSave() {
        this._dirty = true;
        clearTimeout(this._saveTimer);
        this._saveTimer = setTimeout(() => this._flush(), 1000);
    }

    async _flush() {
        if (!this._dirty || !this._data) return;
        try {
            const eid = await this._getEventoId();
            if (!eid) return;

            const r = await fetch(
                `${SUPABASE_URL}/rest/v1/eventos_config?evento_id=eq.${eid}&seccion=eq.main`,
                {
                    method: 'PATCH',
                    headers: Object.assign({}, SB_H, { 'Prefer': 'return=minimal' }),
                    body: JSON.stringify({ datos: this._data })
                }
            );
            if (r.ok) {
                this._dirty = false;
                // Actualizar caché
                localStorage.setItem(this.CACHE_KEY, JSON.stringify(this._data));
                localStorage.setItem(this.CACHE_TS,  Date.now().toString());
                this.showSaveIndicator('✓ Guardado en Supabase');
                console.log('💾 Barbara datos guardados en Supabase');
            } else {
                console.error('✗ Error guardando:', await r.text());
            }
        } catch(err) {
            console.error('✗ Error en _flush:', err);
        }
    }

    // ── Actualizar un campo por ruta de puntos ────────────────────────────────
    async setField(path, value) {
        if (!this._data) await this.loadData();
        this._setByPath(this._data, path, value);
        this.scheduleSave();
    }

    // ── Obtener un campo por ruta de puntos ───────────────────────────────────
    getField(path) {
        return this._getByPath(this._data, path);
    }

    // ── Poblar formulario con data-json-path ──────────────────────────────────
    populateForm(formId, data, prefix = '') {
        const form = document.getElementById(formId);
        if (!form) return;
        const d = data || this._data;
        if (!d) return;

        let ok = 0, empty = 0;
        form.querySelectorAll('[data-json-path]').forEach(field => {
            const val = this._getByPath(d, field.getAttribute('data-json-path'));
            if (val !== null && val !== undefined && val !== '') {
                if (field.type === 'checkbox') field.checked = Boolean(val);
                else field.value = val;
                ok++;
            } else { empty++; }
        });
        console.log(`✓ Formulario ${formId}: ${ok} campos, ${empty} vacíos`);
    }

    // ── Activar auto-guardado en formulario ───────────────────────────────────
    initAutoSave(formId, section, data) {
        const form = document.getElementById(formId);
        if (!form) return;
        const d = data || this._data;

        form.querySelectorAll('[data-json-path]').forEach(field => {
            const save = () => {
                const path = field.getAttribute('data-json-path');
                const val  = field.type === 'checkbox' ? field.checked
                           : field.type === 'number'   ? (field.value ? parseFloat(field.value) : null)
                           : field.value || null;
                this._setByPath(d, path, val);
                this.scheduleSave();
            };
            field.addEventListener('change', save);
            if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
                let t;
                field.addEventListener('input', () => { clearTimeout(t); t = setTimeout(save, 800); });
            }
        });
        console.log(`✓ Auto-guardado Supabase activado para ${section}`);
    }

    // ── Guardar desde DATA_MANAGER (invitados, mesas, presupuesto, etc.) ──────
    async saveDynamicSection(section, value) {
        if (!this._data) await this.loadData();
        if (!this._data._dynamic) this._data._dynamic = {};
        this._data._dynamic[section] = value;
        this.scheduleSave();
    }

    async loadDynamicSection(section) {
        if (!this._data) await this.loadData();
        return this._data?._dynamic?.[section] || null;
    }

    // ── Limpiar caché ─────────────────────────────────────────────────────────
    clearCache() {
        this._data = null;
        localStorage.removeItem(this.CACHE_KEY);
        localStorage.removeItem(this.CACHE_TS);
        console.log('✓ Caché limpiado');
    }

    // ── Helpers internos ──────────────────────────────────────────────────────
    _getByPath(obj, path) {
        if (!obj || !path) return null;
        return path.split('.').reduce((acc, k) => (acc != null ? acc[k] : null), obj);
    }

    _setByPath(obj, path, value) {
        const parts = path.split('.');
        const last  = parts.pop();
        const target = parts.reduce((acc, k) => {
            if (acc[k] == null || typeof acc[k] !== 'object') acc[k] = {};
            return acc[k];
        }, obj);
        target[last] = value;
    }

    // ── Indicador visual ──────────────────────────────────────────────────────
    showSaveIndicator(msg = '✓ Guardado') {
        let el = document.getElementById('save-indicator');
        if (!el) {
            el = document.createElement('div');
            el.id = 'save-indicator';
            el.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#22c55e;color:#fff;padding:8px 16px;border-radius:6px;font-size:.85rem;z-index:10000;opacity:0;transition:opacity .3s;pointer-events:none;';
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.style.opacity = '1';
        clearTimeout(el._t);
        el._t = setTimeout(() => { el.style.opacity = '0'; }, 2500);
    }

    // ── Compatibilidad getMissingFields ───────────────────────────────────────
    getMissingFields(data, parentPath = '') {
        const missing = [];
        for (const key in data) {
            const val = data[key];
            const path = parentPath ? `${parentPath}.${key}` : key;
            if (val === null || val === undefined || val === '') missing.push(path);
            else if (typeof val === 'object' && !Array.isArray(val))
                missing.push(...this.getMissingFields(val, path));
        }
        return missing;
    }
}

// Instancia global
const dataLoader = new DataLoader();

// Cargar datos al arrancar y exponer en window
dataLoader.loadData().then(d => {
    if (d) window.EVENTO_DATA = d;
});
