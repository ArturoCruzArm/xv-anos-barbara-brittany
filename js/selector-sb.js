// selector-sb.js — Supabase sync para Foro 7
// Slug: xv-anos-barbara-brittany | Storage key: xv_anos_barbara_brittany_photo_selections
(function () {
    const SUPABASE_URL  = 'https://nzpujmlienzfetqcgsxz.supabase.co';
    const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56cHVqbWxpZW56ZmV0cWNnc3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODYzMzYsImV4cCI6MjA5MDI2MjMzNn0.xl3lsb-KYj5tVLKTnzpbsdEGoV9ySnswH4eyRuyEH1s';
    const EVENTO_SLUG   = 'xv-anos-barbara-brittany';
    const SB_KEY        = 'xv_anos_barbara_brittany_photo_selections';
    const SB_H = { 'apikey': SUPABASE_ANON, 'Authorization': 'Bearer ' + SUPABASE_ANON, 'Content-Type': 'application/json' };

    const SESSION_KEY = 'foro7_sid';
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) { sid = crypto.randomUUID(); localStorage.setItem(SESSION_KEY, sid); }

    let eventoId   = null;
    let sbOk       = true;
    let _syncing   = false;
    let _syncTimer = null;

    async function getEventoId() {
        if (eventoId) return eventoId;
        const r = await fetch(SUPABASE_URL + '/rest/v1/eventos?slug=eq.' + EVENTO_SLUG + '&select=id&limit=1', { headers: SB_H });
        const rows = await r.json();
        eventoId = rows[0] ? rows[0].id : null;
        return eventoId;
    }

    async function sbSync(sels) {
        if (!sbOk) return;
        try {
            const eid = await getEventoId();
            if (!eid) return;
            await fetch(SUPABASE_URL + '/rest/v1/selecciones?evento_id=eq.' + eid, { method: 'DELETE', headers: SB_H });
            const entries = Object.entries(sels);
            if (!entries.length) return;
            const rows = entries.map(function(e) {
                var idx = e[0], sel = e[1];
                return {
                    evento_id: eid, session_id: sid,
                    foto_index: parseInt(idx),
                    impresion:  sel.impresion  || false,
                    invitacion: sel.invitacion || false,
                    descartada: sel.descartada || false,
                    ampliacion: sel.ampliacion || false,
                    datos: sel
                };
            });
            await fetch(SUPABASE_URL + '/rest/v1/selecciones', {
                method: 'POST',
                headers: Object.assign({}, SB_H, { 'Prefer': 'return=minimal' }),
                body: JSON.stringify(rows)
            });
        } catch(e) { sbOk = false; }
    }

    async function sbLoad(isPoll) {
        if (!sbOk) return;
        try {
            const eid = await getEventoId();
            if (!eid) return;
            const r = await fetch(
                SUPABASE_URL + '/rest/v1/selecciones?evento_id=eq.' + eid + '&select=foto_index,datos,impresion,invitacion,descartada,ampliacion',
                { headers: SB_H }
            );
            const rows = await r.json();
            const sb = {};
            rows.forEach(function(row) {
                var sel = (row.datos && Object.keys(row.datos).length)
                    ? row.datos
                    : { impresion: row.impresion, invitacion: row.invitacion, descartada: row.descartada, ampliacion: row.ampliacion };
                if (Object.values(sel).some(function(v){ return v; })) sb[row.foto_index] = sel;
            });

            var merged;
            if (isPoll) {
                merged = sb;
            } else {
                var local = {};
                try { local = JSON.parse(localStorage.getItem(SB_KEY) || '{}'); } catch(e) {}
                merged = Object.assign({}, sb);
                Object.entries(local).forEach(function(e) {
                    if (Object.values(e[1]).some(function(v){ return v; })) merged[e[0]] = e[1];
                });
            }

            _syncing = true;
            try {
                localStorage.setItem(SB_KEY, JSON.stringify(merged));
                if (typeof loadSelections === 'function') loadSelections();
                if (typeof renderGallery === 'function') renderGallery();
                if (typeof updateStats === 'function') updateStats();
                if (typeof updateFilterButtons === 'function') updateFilterButtons();
            } finally { _syncing = false; }

            if (!isPoll) {
                if (Object.keys(merged).length) sbSync(merged).catch(function(){});
                sbRegistrarVisita();
            }
        } catch(e) { sbOk = false; }
    }

    async function sbRegistrarVisita() {
        try {
            const eid = await getEventoId();
            if (!eid) return;
            await fetch(SUPABASE_URL + '/rest/v1/visitas', {
                method: 'POST',
                headers: Object.assign({}, SB_H, { 'Prefer': 'return=minimal' }),
                body: JSON.stringify({ evento_id: eid, pagina: 'selector', session_id: sid })
            });
        } catch(e) {}
    }

    // Parchear localStorage para detectar guardados
    var _origSet = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function(key, value) {
        _origSet(key, value);
        if (key === SB_KEY && !_syncing) {
            clearTimeout(_syncTimer);
            _syncTimer = setTimeout(function() {
                try { sbSync(JSON.parse(value)); } catch(e) {}
            }, 600);
        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        sbLoad(false);
        setInterval(function() {
            var open = document.getElementById('photoModal') &&
                document.getElementById('photoModal').classList.contains('active');
            if (!open) sbLoad(true);
        }, 30000);
    });
})();
