// Base de datos simulada (Representa la extracción de SQLite local)
const bdLocal = [
    {
        id: 1,
        nombre: "Marcha Regular",
        tipo: "Marcha",
        tempo: 120,
        estado: "En Práctica",
        actualizado: true,
        archivos: {
            pdf: "ruta/local/marcha_trompeta.pdf",
            audioInstrumento: "ruta/local/marcha_trompeta.mp3",
            audioBanda: "ruta/local/marcha_banda.mp3"
        }
    },
    {
        id: 2,
        nombre: "Himno Nacional",
        tipo: "Himno",
        tempo: 80,
        estado: "Listo",
        actualizado: false,
        archivos: {
            pdf: "ruta/local/himno_trompeta.pdf",
            audioInstrumento: "ruta/local/himno_trompeta.mp3",
            audioBanda: "ruta/local/himno_banda.mp3"
        }
    }
];

let toqueActual = null;
const reproductor = document.getElementById('reproductor-audio');
const cursorSincronizado = document.getElementById('cursor-sincronizado');

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    renderizarBiblioteca();
});

// HU-04: Mostrar biblioteca filtrada por instrumento
function renderizarBiblioteca() {
    const contenedor = document.getElementById('lista-toques');
    contenedor.innerHTML = '';

    bdLocal.forEach(toque => {
        const div = document.createElement('div');
        div.className = 'toque-card';
        div.onclick = () => abrirVisor(toque);
        
        let alertaHtml = toque.actualizado ? `<span class="alerta-actualizado">⚠️ Toque Actualizado</span>` : '';
        
        div.innerHTML = `
            <h3>${toque.nombre} ${alertaHtml}</h3>
            <p>Tipo: ${toque.tipo} | Tempo: ${toque.tempo} BPM</p>
            <p>Estado: <strong>${toque.estado}</strong></p>
        `;
        contenedor.appendChild(div);
    });
}

// Interfaz para interactuar con la partitura y sus controles
function abrirVisor(toque) {
    toqueActual = toque;
    document.getElementById('biblioteca-view').style.display = 'none';
    document.getElementById('visor-view').style.display = 'block';
    document.getElementById('visor-titulo').innerText = toque.nombre;
    
    // HU-06: Preparar pistas de audio
    document.getElementById('selector-pista').value = 'instrumento';
    cargarAudio(toque.archivos.audioInstrumento);
}

function volverBiblioteca() {
    reproductor.pause();
    document.getElementById('visor-view').style.display = 'none';
    document.getElementById('biblioteca-view').style.display = 'block';
}

// RF11 y RF13: Gestión del audio nativo (Simulando ExoPlayer)
function cargarAudio(ruta) {
    // En producción, se usaría un archivo físico guardado en el dispositivo
    console.log(`Cargando audio desde almacenamiento local: ${ruta}`);
    // reproductor.src = ruta; 
}

function togglePlay() {
    if (reproductor.paused) {
        // reproductor.play();
        document.getElementById('btn-play').innerText = '⏸ Pausar';
        cursorSincronizado.style.display = 'block';
        iniciarSimulacionCursor();
    } else {
        // reproductor.pause();
        document.getElementById('btn-play').innerText = '▶ Reproducir';
    }
}

function retrocederAudio() { reproductor.currentTime -= 10; }
function adelantarAudio() { reproductor.currentTime += 10; }

function cambiarPista() {
    const modo = document.getElementById('selector-pista').value;
    const tiempoActual = reproductor.currentTime;
    
    if (modo === 'instrumento') {
        cargarAudio(toqueActual.archivos.audioInstrumento);
    } else {
        cargarAudio(toqueActual.archivos.audioBanda);
    }
    // Mantiene la sincronización tras el cambio
    reproductor.currentTime = tiempoActual;
}

// HU-07: Control de velocidad sin modificar el tono
function cambiarVelocidad() {
    const slider = document.getElementById('slider-velocidad');
    const texto = document.getElementById('velocidad-texto');
    reproductor.playbackRate = slider.value;
    texto.innerText = slider.value + 'x';
}

// RF12: Lógica del cursor visual sincronizado
function iniciarSimulacionCursor() {
    // Esta función simula la lectura de metadatos para mover la barra vertical sobre el PDF
    let posicion = 0;
    setInterval(() => {
        if(!reproductor.paused) {
            posicion += 1; // Avance simulado en píxeles
            cursorSincronizado.style.left = posicion + '%';
        }
    }, 500); // Tolerancia máxima de +-500ms
}