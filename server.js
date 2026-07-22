const express = require('express');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto'); // Módulo nativo de Node.js (Sin problemas de compatibilidad)

const app = express();

// --- MIDDLEWARES BASE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware para asignación de Correlation ID y Logs Estructurados en JSON (Avance #6)
 */
app.use((req, res, next) => {
    req.correlationId = req.headers['x-correlation-id'] || randomUUID();
    res.setHeader('X-Correlation-ID', req.correlationId);

    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'info',
        service: 'banda-de-guerra-api',
        context: 'HTTP Request',
        method: req.method,
        url: req.url,
        correlationId: req.correlationId
    }));

    next();
});

/**
 * Valida la estructura de un toque defensivo (Avance #4).
 */
function validarToqueDefensivo(datos) {
    if (!datos || typeof datos !== 'object') return false;
    
    const { coordenadaX, coordenadaY, tipoGolpe } = datos;
    
    const xValido = typeof coordenadaX === 'number' && !isNaN(coordenadaX);
    const yValido = typeof coordenadaY === 'number' && !isNaN(coordenadaY);
    const golpeValido = typeof tipoGolpe === 'string' && tipoGolpe.trim().length > 0;

    return xValido && yValido && golpeValido;
}

/**
 * Middleware de Control de Acceso Basado en Roles / RBAC (Avance #6)
 */
function verificarRol(rolRequerido) {
    return (req, res, next) => {
        const rolUsuario = req.headers['x-user-role'] || 'admin';
        if (rolUsuario !== rolRequerido) {
            return res.status(403).json({
                error: "Acceso denegado: Permisos insuficientes",
                correlationId: req.correlationId
            });
        }
        next();
    };
}

// --- RUTAS DE NAVEGACIÓN Y AUTENTICACIÓN ---

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).send('Campos incompletos.');
    }

    const usuarioLimpio = username.trim();
    const passLimpia = password.trim();

    if (usuarioLimpio === 'admin' && passLimpia === '1234') {
        res.redirect('/sistema.html');
    } else {
        res.status(401).send('Credenciales incorrectas. <a href="/">Volver</a>');
    }
});

app.get('/index.html', (req, res) => {
    res.redirect('/sistema.html');
});

app.use(express.static(path.join(__dirname, 'public')));

// --- FAMILIA DE RUTAS DE DIAGNÓSTICO (/diag/) (Avance #6) ---

app.get('/diag/ready', (req, res) => {
    res.status(200).json({ status: "ready", timestamp: new Date().toISOString() });
});

app.get('/diag/metrics', (req, res) => {
    res.status(200).json({
        service: "banda-de-guerra-api",
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        timestamp: new Date().toISOString(),
        correlationId: req.correlationId
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- API DE TOQUES ---

app.get('/api/toques', (req, res) => {
    const filePath = path.join(__dirname, 'toques.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error al leer archivo", correlationId: req.correlationId });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/toques', verificarRol('admin'), (req, res) => {
    if (!validarToqueDefensivo(req.body)) {
        return res.status(400).json({
            error: "Payload inválido para toque defensivo",
            correlationId: req.correlationId
        });
    }
    res.status(201).json({ mensaje: "Toque procesado correctamente", correlationId: req.correlationId });
});

// --- MANEJADOR DE ERRORES CON LOGS ESTRUCTURADOS ---
app.use((err, req, res, next) => {
    console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        service: 'banda-de-guerra-api',
        correlationId: req.correlationId,
        message: err.message
    }));
    res.status(500).json({ error: "Error interno del servidor", correlationId: req.correlationId });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor de Banda de Guerra corriendo en el puerto ${PORT}`);
    });
}

module.exports = { app, validarToqueDefensivo };