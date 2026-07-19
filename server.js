const express = require('express');
const app = express();

// CONFIGURACIONES DE MIDDLEWARE
app.use(express.json()); // Para leer JSON (rutas de API)
app.use(express.urlencoded({ extended: true })); // Para leer formularios HTML (Login)
app.use(express.static('public')); // Para servir tu carpeta pública (HTML, CSS)

// LÓGICA DE NEGOCIO (Validación para la UNEFA)
function validarToqueDefensivo(datos) {
    if (!datos || typeof datos !== 'object') return false;
    if (!datos.coordenadaX || !datos.coordenadaY || !datos.tipoGolpe) return false;
    if (typeof datos.coordenadaX !== 'number' || typeof datos.coordenadaY !== 'number') return false;
    return true;
}

// RUTA 1: Procesamiento de Toques (Avance #4)
app.post('/api/toques', (req, res) => {
    const esValido = validarToqueDefensivo(req.body);
    if (esValido) {
        res.status(201).json({ mensaje: "Toque procesado correctamente" });
    } else {
        res.status(400).json({ error: "Fallo en el procesamiento de datos" });
    }
});

// RUTA 2: Sistema de Inicio de Sesión (Nueva función)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Lógica de validación
    if (username === 'admin' && password === '1234') {
        // Redirige al usuario al index.html si la clave es correcta
        res.redirect('/index.html'); 
    } else {
        // Si falla, le da la opción de volver a intentar
        res.send(`
            <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                <h1 style="color: red;">Acceso Denegado</h1>
                <p>Usuario o contraseña incorrectos.</p>
                <a href="/login.html">Volver a intentar</a>
            </div>
        `);
    }
});
// CONFIGURACIÓN DEL PUERTO Y ARRANQUE SEGURO
const PORT = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
        console.log(`Visita http://localhost:${PORT} para ver la aplicación`);
    });
}

module.exports = { app, validarToqueDefensivo };