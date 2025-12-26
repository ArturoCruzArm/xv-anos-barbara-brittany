# XV Años - Barbara Brittany

Sistema completo de invitación web y gestión de eventos para los XV años de Barbara Brittany.

## 📋 Descripción

Este proyecto incluye:
- **Invitación Web**: Página pública para invitados con información del evento
- **Panel de Administración**: Sistema privado para organizar todos los aspectos del evento
- **Gestión de Servicios**: Páginas dedicadas para cada servicio contratado
- **Control de Presupuesto**: Seguimiento detallado de gastos y pagos
- **Itinerario del Evento**: Timeline completo del día especial
- **✨ Gestión de Invitados**: Base de datos completa con confirmaciones y categorías
- **✨ Mesa de Regalos**: Sistema digital con links a tiendas y regalos en efectivo
- **✨ Planos de Mesas**: Diseñador visual para distribución del salón
- **✨ Códigos QR**: Invitaciones digitales personalizadas
- **✨ Dashboard con Gráficas**: Análisis visual en tiempo real

## 📁 Estructura del Proyecto

```
xv-anos-barbara-brittany/
│
├── index.html              # Invitación web (PÚBLICA)
├── admin.html              # Panel de administración (PRIVADA)
├── presupuesto.html        # Control de presupuesto
├── itinerario.html         # Timeline del evento
├── ✨ invitados.html       # Gestión de invitados
├── ✨ mesa-regalos.html    # Mesa de regalos digital
├── ✨ planos-mesas.html    # Diseñador de distribución
├── ✨ codigos-qr.html      # Generador de QR personalizados
│
├── css/
│   ├── styles.css          # Estilos de la invitación
│   ├── admin.css           # Estilos del panel admin
│   ├── servicios.css       # Estilos de páginas de servicios
│   ├── ✨ invitados.css    # Estilos de gestión de invitados
│   └── ✨ mesa-regalos.css # Estilos de mesa de regalos
│
├── js/
│   ├── main.js             # JavaScript de la invitación
│   ├── admin.js            # JavaScript del panel admin
│   ├── servicios.js        # JavaScript de servicios
│   ├── presupuesto.js      # JavaScript del presupuesto
│   ├── ✨ invitados.js     # Gestión de invitados
│   ├── ✨ mesa-regalos.js  # Mesa de regalos
│   └── ✨ dashboard-charts.js  # Gráficas del dashboard
│
├── servicios/
│   ├── banquete.html       # Gestión de banquete
│   ├── salon.html          # Gestión del salón
│   ├── fotografia.html     # Gestión de fotografía/video
│   ├── musica.html         # Gestión de música/DJ
│   └── decoracion.html     # Gestión de decoración
│
├── images/                 # Imágenes del evento
│   └── (agregar fotos aquí)
│
└── audio/                  # Audio de fondo
    └── (agregar música aquí)
```

## 🚀 Cómo Usar

### Para Invitados (Público)

1. Abre `index.html` en tu navegador
2. Los invitados verán:
   - Información del evento (fecha, hora, lugar)
   - Cuenta regresiva
   - Formulario de confirmación de asistencia
   - Galería de fotos
   - Código de vestimenta
   - Mapas de ubicación

### Para Organización (Privado)

1. Abre `admin.html` en tu navegador
2. Desde el panel podrás:
   - Ver estadísticas del evento
   - Gestionar cada servicio contratado
   - Controlar el presupuesto
   - Revisar el itinerario del día
   - Gestionar tareas pendientes

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en `css/styles.css`:

```css
:root {
    --primary: #c41e3a;        /* Color principal (rosa/rojo)*/
    --primary-light: #e94560;  /* Color claro */
    --primary-dark: #8b1429;   /* Color oscuro */
    --gold: #d4af37;           /* Color dorado */
}
```

### Actualizar Información

#### Fecha del Evento
Cambia la fecha en `js/main.js`:
```javascript
const eventDate = new Date(2026, 3, 12, 17, 0, 0); // Mes 3 = Abril
```

#### Información de Contacto
Actualiza el número de WhatsApp en `js/main.js`:
```javascript
const whatsappUrl = `https://wa.me/524779203776?text=...`;
```

### Agregar Fotos

1. Coloca las fotos en la carpeta `images/`
2. Actualiza la galería en `index.html` (línea ~1140)
3. O utiliza el array `allPhotos` en el script del index

### Agregar Música de Fondo

1. Coloca el archivo MP3 en la carpeta `audio/`
2. Actualiza la referencia en `index.html`:
```html
<audio id="background-audio" loop>
    <source src="audio/tu-cancion.mp3" type="audio/mpeg">
</audio>
```

## 📱 Funcionalidades

### Invitación Web (index.html)
- ✅ Cuenta regresiva automática
- ✅ Formulario de confirmación vía WhatsApp
- ✅ Compartir en redes sociales
- ✅ Agregar evento al calendario
- ✅ Mapas interactivos de Google
- ✅ Galería de fotos
- ✅ Reproductor de música de fondo
- ✅ Diseño responsivo (móvil y desktop)

### Panel de Administración (admin.html)
- ✅ Dashboard con estadísticas
- ✅ Días restantes hasta el evento
- ✅ Progreso de presupuesto
- ✅ Lista de tareas pendientes
- ✅ Acceso rápido a todos los servicios
- ✅ Contactos importantes

### Gestión de Servicios
Cada servicio tiene su propia página con:
- Información del proveedor
- Costos y anticipos
- Servicios incluidos
- Notas especiales
- Contactos relacionados

#### Servicios Disponibles:
1. **Banquete** - Menú, degustaciones, requerimientos especiales
2. **Salón** - Reserva, capacidad, distribución de mesas
3. **Fotografía & Video** - Paquetes, cronograma, momentos a capturar
4. **Música/DJ** - Playlist, equipo incluido, géneros musicales
5. **Decoración** - Colores, flores, elementos decorativos

### Control de Presupuesto
- ✅ Desglose detallado por concepto
- ✅ Control de anticipos y saldos
- ✅ Barra de progreso visual
- ✅ Cálculo automático de totales
- ✅ Calendario de pagos

### Itinerario del Evento
- ✅ Timeline completo del día
- ✅ Desde preparativos hasta fin del evento
- ✅ Horarios detallados
- ✅ Contactos de emergencia
- ✅ Notas importantes

## 🌐 Publicación en Internet

### Opción 1: GitHub Pages (Gratis)

1. Crea una cuenta en GitHub
2. Crea un nuevo repositorio llamado `xv-anos-barbara-brittany`
3. Sube todos los archivos
4. Ve a Settings → Pages
5. Selecciona la rama `main` y guarda
6. Tu sitio estará en: `https://tu-usuario.github.io/xv-anos-barbara-brittany`

### Opción 2: Netlify (Gratis)

1. Crea una cuenta en Netlify
2. Arrastra la carpeta del proyecto
3. Tu sitio estará publicado automáticamente
4. Puedes usar un dominio personalizado

### Opción 3: Hosting tradicional

1. Compra un hosting web
2. Sube todos los archivos vía FTP
3. Configura tu dominio

## 🔒 Privacidad

**IMPORTANTE:**
- El archivo `index.html` es PÚBLICO (para invitados)
- El archivo `admin.html` y las páginas de servicios son PRIVADAS
- NO compartas el enlace de admin.html públicamente
- Considera agregar protección con contraseña si lo publicas online

## 📊 Información del Evento

- **Quinceañera:** Barbara Brittany
- **Fecha:** 12 de Abril de 2026
- **Hora Ceremonia:** 17:00 hrs
- **Hora Recepción:** 18:30 hrs
- **Ubicación:** La Joya, León, Guanajuato

## 👨‍💻 Créditos

- **Desarrollo:** Producciones Foro 7
- **Fotografía y Video:** Foro 7
- **Contacto:** 477-920-3776

## ✨ NUEVAS FUNCIONALIDADES TOP 2026

### 1. Gestión de Invitados (invitados.html)
- Base de datos completa con todos los invitados
- Categorización (Familia, Padrinos, Amigos, Conocidos)
- Control de confirmaciones en tiempo real
- Filtros y búsqueda avanzada
- Gestión de pases y menús especiales
- Estadísticas visuales por categoría
- Exportar a Excel/PDF

### 2. Mesa de Regalos Digital (mesa-regalos.html)
- Enlaces a tiendas departamentales (Liverpool, Palacio, Amazon)
- Sugerencias de regalos por categoría
- Información bancaria para regalos en efectivo
- Función copiar datos con un click
- Compartir por WhatsApp
- Diseño elegante y profesional

### 3. Planos y Asignación de Mesas (planos-mesas.html)
- Diseñador visual interactivo del salón
- Agregar y posicionar mesas con drag & drop
- Asignación de invitados a cada mesa
- Configuración de capacidad por mesa
- Vista previa en tiempo real
- Control de distribución optimizada

### 4. Códigos QR Personalizados (codigos-qr.html)
- Generador de códigos QR únicos por invitado
- Personalización con nombre y número de pases
- Descarga de imagen QR en alta calidad
- Compartir directo por WhatsApp
- Incluye URL de invitación personalizada
- Perfecto para invitaciones digitales o impresas

### 5. Dashboard con Gráficas (admin.html mejorado)
- Gráficas interactivas con Chart.js
- Análisis visual de presupuesto
- Estadísticas de confirmaciones
- Progreso de tareas en tiempo real
- Diseño profesional y moderno

## 📝 Notas

- Actualiza regularmente la información
- Haz respaldos periódicos del proyecto
- Prueba todas las funcionalidades antes del evento
- Verifica que los enlaces de mapas funcionen correctamente
- Confirma que el formulario de WhatsApp tenga el número correcto
- Los datos de invitados se guardan en localStorage del navegador
- Exporta regularmente la información importante

## 💾 SISTEMA DE BACKUP/RESTORE (¡MUY IMPORTANTE!)

Como este proyecto se hospeda en GitHub Pages (sin backend), **todos los datos se guardan en el navegador del cliente** usando `localStorage`.

### 🔴 IMPORTANTE: Los datos NO se sincronizan automáticamente

- Los datos están en TU navegador local
- Si borras el caché del navegador, **PIERDES TODO**
- Si cambias de navegador o computadora, necesitas importar los datos

### ✅ SOLUCIÓN: Sistema de Backup/Restore Incluido

En cada página administrativa verás un **botón flotante morado** 🟣 en la esquina inferior derecha.

#### 📤 CÓMO HACER BACKUP:

1. Click en el botón morado 🟣 (icono de base de datos)
2. Click en **"Exportar Todo"** - esto copia todos los datos a formato JSON
3. Opciones para guardar:
   - **"Enviar por WhatsApp"**: Envía el JSON por WhatsApp (guárdalo en mensajes guardados)
   - **"Descargar JSON"**: Descarga un archivo .json a tu computadora
   - También puedes copiar el JSON del cuadro de texto

#### 📥 CÓMO RESTAURAR DATOS:

1. Click en el botón morado 🟣
2. Pega el JSON en el área de texto "Importar Datos"
3. Click en **"Importar Datos"**
4. La página se recargará automáticamente con los datos restaurados

### 🔄 RECOMENDACIONES DE BACKUP:

- ✅ **Haz backup DIARIAMENTE** mientras organizas el evento
- ✅ Guarda los JSON en:
  - Google Drive o Dropbox
  - Mensajes guardados de WhatsApp
  - Email a ti mismo
  - USB o disco duro externo
- ✅ Antes de cambiar de navegador/computadora, exporta primero
- ✅ Después de agregar muchos datos, haz backup inmediatamente

### 📱 Compartir datos entre dispositivos:

1. En dispositivo A: Exportar → Enviar por WhatsApp
2. En dispositivo B: Copiar el JSON → Importar Datos

### 🗑️ Borrar todos los datos:

Si necesitas empezar de cero:
1. Click en botón morado 🟣
2. Click en **"Borrar Todo"** (¡cuidado! esto no se puede deshacer)

---

## 🎯 Próximos Pasos

1. [ ] Agregar fotos de la sesión fotográfica
2. [ ] Completar información de proveedores
3. [ ] Actualizar datos de la iglesia y salón
4. [ ] Definir menú final del banquete
5. [ ] Confirmar playlist con el DJ
6. [ ] Actualizar presupuesto con costos reales
7. [ ] Publicar la invitación web
8. [ ] Enviar enlace a invitados
9. [ ] **¡HACER BACKUP REGULARMENTE!** 💾

---

**¿Necesitas ayuda?**
Contacta a Foro 7 Producciones: 477-920-3776
