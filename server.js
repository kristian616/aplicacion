const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();

// 1. Middlewares
app.use(cors());
app.use(express.json());

// Servir la página HTML y archivos estáticos
app.use(express.static(path.join(__dirname)));

// Servir la carpeta donde se guardan los PDFs subidos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Configuración de Multer para guardar los archivos PDF
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'uploads', 'partituras');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// 3. Persistencia en JSON local
const DB_FILE = path.join(__dirname, 'partituras.json');
const leerPartituras = () => fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE)) : [];
const guardarPartituras = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// --- RUTAS DE LA API ---

// Obtener todas las partituras
app.get('/api/partituras', (req, res) => {
    res.json(leerPartituras());
});

// Subir una nueva partitura
app.post('/api/partituras', upload.single('archivoPdf'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ningún archivo PDF.' });
        }
        
        const partituras = leerPartituras();
        const nueva = {
            id: Date.now(),
            nombre: req.body.nombre,
            familia: req.body.familia,
            estado: 'Disponible',
            url: `/uploads/partituras/${req.file.filename}`
        };
        
        partituras.push(nueva);
        guardarPartituras(partituras);
        
        res.status(201).json(nueva);
    } catch (err) {
        console.error("Error al procesar archivo:", err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Eliminar partitura
app.delete('/api/partituras/:id', (req, res) => {
    const pass = req.headers['x-admin-password'];
    if (pass !== 'admin123') {
        return res.status(401).json({ error: 'Clave incorrecta' });
    }

    let partituras = leerPartituras();
    const item = partituras.find(p => p.id === parseInt(req.params.id));
    
    if (item) {
        const filePath = path.join(__dirname, item.url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        partituras = partituras.filter(p => p.id !== item.id);
        guardarPartituras(partituras);
        res.json({ message: 'Partitura eliminada' });
    } else {
        res.status(404).json({ error: 'Partitura no encontrada' });
    }
});

// 4. Puerto asignado dinámicamente por Render (o 3000 si es local)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor activo en el puerto ${PORT}`));