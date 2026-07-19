const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

// Novedad: Le decimos al servidor que comparta los archivos visuales de la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Endpoint de Salud (Health Check) - Requisito Avance #5
 * Retorna el estado operativo actual del sistema.
 * @returns {Object} JSON con estado y marca de tiempo.
 */
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString() 
    });
});

/**
 * Función crítica de negocio: Valida si un toque tiene todos sus datos.
 * Maneja errores con elegancia usando try/catch.
 * @param {Object} toque - Objeto con los datos del toque musical.
 * @returns {boolean} True si es válido, lanza error si no lo es.
 */
function validarToqueDefensivo(toque) {
    try {
        if (!toque.nombre || !toque.tempo) {
            throw new Error("Estructura de mensaje inválida: Faltan datos críticos");
        }
        if (toque.tempo < 0) {
            throw new Error("El tempo no puede ser negativo");
        }
        return true;
    } catch (error) {
        const fecha = new Date().toISOString().split('T')[0];
        console.error(`[ERROR] [${fecha}]: ${error.message}`);
        return false;
    }
}

app.post('/api/toques', (req, res) => {
    const esValido = validarToqueDefensivo(req.body);
    if (esValido) {
        res.status(201).json({ mensaje: "Toque procesado correctamente" });
    } else {
        res.status(400).json({ error: "Fallo en el procesamiento de datos" });
    }
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
        console.log(`Visita http://localhost:${PORT} para ver la aplicación`);
    });
}

module.exports = { app, validarToqueDefensivo };