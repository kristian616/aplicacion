const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();

// --- MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MIDDLEWARE TRAZABILIDAD (Correlation ID) ---
app.use((req, res, next) => {
    req.correlationId = uuidv4();
    res.setHeader('X-Correlation-ID', req.correlationId);
    next();
});

// --- RUTA DE SALUD ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- RUTA: LOGIN (El usuario entra aquí por defecto) ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// --- RUTA: PROCESAMIENTO DE LOGIN ---
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') {
        // Redirige al archivo renombrado
        res.redirect('/sistema.html');
    } else {
        res.status(401).send('Credenciales incorrectas. <a href="/">Volver</a>');
    }
});

// --- SERVIR ARCHIVOS ESTÁTICOS ---
app.use(express.static(path.join(__dirname, 'public')));

// --- API: Obtener lista de toques ---
app.get('/api/toques', (req, res) => {
    const filePath = path.join(__dirname, 'toques.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(JSON.stringify({ level: 'error', correlationId: req.correlationId, message: 'No se pudo leer toques.json' }));
            return res.status(500).json({ error: "Ocurrió un error. Reporte el código: " + req.correlationId });
        }
        res.json(JSON.parse(data));
    });
});

// --- API: Procesamiento de Toques ---
app.post('/api/toques', (req, res) => {
    const { coordenadaX, coordenadaY, tipoGolpe } = req.body;
    if (typeof coordenadaX !== 'number' || typeof coordenadaY !== 'number' || typeof tipoGolpe !== 'string') {
        return res.status(400).json({ error: "Datos inválidos. Reporte el código: " + req.correlationId });
    }
    res.status(201).json({ mensaje: "Toque procesado correctamente", correlationId: req.correlationId });
});

// --- MANEJADOR DE ERRORES ---
app.use((err, req, res, next) => {
    console.error(JSON.stringify({ level: 'error', correlationId: req.correlationId, message: err.message }));
    res.status(500).json({ error: "Ocurrió un error. Reporte el código: " + req.correlationId });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sistema UNEFA corriendo en puerto: ${PORT}`);
});