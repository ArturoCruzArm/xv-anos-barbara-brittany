# Sistema Centralizado de Datos - XV Años Barbara Brittany

## ✅ CÓMO FUNCIONA AHORA

**Toda la información del evento está en un solo lugar: `data/evento.json`**

### 📁 Archivos JSON (Fuente Única de Verdad)

```
/data/
  ├── evento.json          ← MODIFICAR AQUÍ para cambiar fechas, nombres, ubicaciones
  ├── servicios.json       ← MODIFICAR AQUÍ para precios y servicios
  ├── presupuesto.json     ← Para costos y gastos
  └── mobiliario.json      ← Para catálogo de mobiliario
```

### 🎯 Para Cambiar Información del Evento

**SOLO NECESITAS EDITAR: `data/evento.json`**

#### Ejemplo 1: Cambiar la fecha del evento

```json
{
  "fechas": {
    "evento": "2026-04-11",        ← Cambiar aquí
    "horaMisa": "16:00",           ← Cambiar aquí
    "horaRecepcion": "18:30",      ← Cambiar aquí
    "confirmacionLimite": "2026-04-05"  ← Cambiar aquí
  }
}
```

**Resultado:** Automáticamente se actualizarán:
- ✅ Countdown en index.html
- ✅ Fechas en calendario (Google Calendar)
- ✅ Mensajes de WhatsApp
- ✅ Compartir en redes sociales
- ✅ Formulario RSVP
- ✅ Todos los textos que muestran fecha

#### Ejemplo 2: Cambiar ubicaciones

```json
{
  "ubicaciones": {
    "iglesia": {
      "nombre": "Parroquia San Juan Bautista de la Salle"  ← Cambiar aquí
    },
    "salon": {
      "nombre": "La Granja el General"  ← Cambiar aquí
    }
  }
}
```

**Resultado:** Se actualiza automáticamente en:
- ✅ Index.html (detalles del evento)
- ✅ Google Calendar links
- ✅ Todos los lugares que muestran ubicación

#### Ejemplo 3: Cambiar nombres

```json
{
  "quinceañera": {
    "nombre": "Barbara Brittany"  ← Cambiar aquí
  },
  "padres": {
    "madre": "Patricia",  ← Cambiar aquí
    "padre": null
  }
}
```

**Resultado:** Se actualiza en:
- ✅ Títulos de la página
- ✅ Mensajes de WhatsApp
- ✅ Redes sociales
- ✅ Formularios

---

## 📊 Archivos que SE ACTUALIZAN AUTOMÁTICAMENTE

### ✅ `js/main.js`
- **Countdown:** Carga `fechas.evento` y `fechas.horaMisa` desde JSON
- **Calendar:** Carga fechas, nombres y ubicaciones desde JSON
- **RSVP:** Carga nombre quinceañera y fecha desde JSON
- **Social Sharing:** Carga nombre y fecha desde JSON
- **NO TOCAR** - Ya está configurado para leer del JSON

### ✅ `index.html`
- Carga nombre quinceañera, ubicaciones, fechas
- Carga padres, padrinos
- Carga fecha límite de confirmación
- **NO TOCAR** - Ya está configurado para leer del JSON

### ✅ Páginas de servicios
- `servicios/banquete.html` - Lee de `servicios.json`
- `servicios/musica.html` - Lee de `servicios.json`
- `servicios/decoracion.html` - Lee de `servicios.json`
- `servicios/fotografia.html` - Lee de `servicios.json`

---

## 🚀 FLUJO DE TRABAJO

### Antes (❌ Incorrecto):
```
1. Editar index.html para cambiar fecha
2. Editar main.js para cambiar fecha
3. Editar cada página de servicio
4. Editar README.md
5. Editar 10+ archivos diferentes
```

### Ahora (✅ Correcto):
```
1. Editar data/evento.json
2. Git commit y push
3. ✨ LISTO - Todo se actualiza automáticamente
```

---

## 📝 EJEMPLO COMPLETO: Cambiar Año del Evento

Si quieres cambiar el evento de 2026 a 2027:

### Paso 1: Editar `data/evento.json`
```json
{
  "fechas": {
    "evento": "2027-04-11",                  // Cambio de 2026 a 2027
    "confirmacionLimite": "2027-04-05"       // Cambio de 2026 a 2027
  }
}
```

### Paso 2: Commit y push
```bash
git add data/evento.json
git commit -m "Actualizar evento a 2027"
git push
```

### Paso 3: ¡Listo!
- Countdown muestra 2027 ✅
- Calendario muestra 2027 ✅
- WhatsApp dice 2027 ✅
- Redes sociales dicen 2027 ✅
- TODO actualizado automáticamente ✅

---

## 🔧 CAMPOS DISPONIBLES EN `evento.json`

```json
{
  "quinceañera": {
    "nombre": "string",           // Nombre de la quinceañera
    "edad": number,               // Edad (opcional)
    "fechaNacimiento": "YYYY-MM-DD"  // Fecha de nacimiento (opcional)
  },
  "padres": {
    "madre": "string",            // Nombre de la madre
    "padre": "string"             // Nombre del padre
  },
  "padrinos": {
    "padrino": "string",          // Nombre del padrino
    "madrina": "string"           // Nombre de la madrina
  },
  "fechas": {
    "evento": "YYYY-MM-DD",       // ⭐ FECHA DEL EVENTO
    "diaEvento": number,          // Día del mes
    "horaMisa": "HH:MM",          // ⭐ HORA DE LA MISA
    "horaRecepcion": "HH:MM",     // ⭐ HORA DE LA RECEPCIÓN
    "confirmacionLimite": "YYYY-MM-DD"  // ⭐ FECHA LÍMITE RSVP
  },
  "ubicaciones": {
    "iglesia": {
      "nombre": "string",         // ⭐ NOMBRE DE LA IGLESIA
      "direccion": "string",      // Dirección
      "padre": "string",          // Nombre del padre
      "telefono": "string"        // Teléfono
    },
    "salon": {
      "nombre": "string",         // ⭐ NOMBRE DEL SALÓN
      "direccion": "string",      // Dirección
      "contacto": "string",       // Nombre de contacto
      "telefono": "string"        // Teléfono
    }
  },
  "contacto": {
    "whatsapp": "string",         // Número sin código país
    "whatsappFormat": "string",   // ⭐ Número con código (52...)
    "emailContacto": "string"     // Email
  }
}
```

Los campos marcados con ⭐ son los más importantes.

---

## ⚠️ IMPORTANTE

### ✅ SÍ MODIFICAR:
- `data/evento.json` - Para información del evento
- `data/servicios.json` - Para servicios y precios
- `data/presupuesto.json` - Para costos
- `data/mobiliario.json` - Para catálogo

### ❌ NO MODIFICAR (a menos que sepas lo que haces):
- `js/main.js` - Ya lee del JSON automáticamente
- `js/data-loader.js` - Sistema de carga
- `index.html` - Secciones de JavaScript
- Otros archivos HTML (a menos que sea cambio de diseño)

---

## 🎉 BENEFICIOS

✅ **Un solo lugar para toda la información**
✅ **Sin duplicación de datos**
✅ **Sin errores de inconsistencia**
✅ **Más fácil de mantener**
✅ **Cambios instantáneos en todo el sitio**
✅ **Sistema profesional escalable**

---

## 📞 ¿Necesitas Ayuda?

Si necesitas cambiar algo y no sabes qué campo modificar, solo pregunta:
- "¿Cómo cambio la hora de la misa?"
- "¿Dónde actualizo el nombre del salón?"
- "¿Cómo agrego el nombre del padre?"

Y te diré exactamente qué línea del JSON modificar.

---

**Creado por:** Producciones Foro 7
**Sistema:** Centralizado JSON-based
**Versión:** 2.0 (Abril 2024)
