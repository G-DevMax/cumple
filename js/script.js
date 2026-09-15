/**
 * ============================================================================
 * CONFIGURACIÓN DEL REGALO
 * ============================================================================
 * Modifica estos valores para personalizar el sitio web.
 */
const CONFIG = {
    // Textos
    birthdayName: "Te quiero mushote",
    birthdayMessage: "Feliz cumpleaños Bianca",
    specialMessage: "Admiro todo el esfuerzo que haces, como creces constantemente y aprecio toda la alegría que me traes con tu presencia en mi vida. Estoy feliz de verte crecer otro año más preciosa UwU",

    // Música
    musicFile: "musica/satellite.flac",
    musicTitle: "Satellite - Harry Styles", // Nombre que aparecerá en el reproductor
    // INDICACIÓN: Para empezar en un minuto concreto, usa segundos. 
    // Por ejemplo, para empezar en 1 minuto y 20 segundos, pon 80.
    musicStartTime: 114,

    // Fotografías (Asegúrate de que estas rutas coincidan con tus archivos)
    photos: [
        "images/foto1.jpg",
        "images/foto2.jpg",
        "images/foto3.jpg",
        "images/foto4.jpg",
        "images/foto5.jpg",
        "images/foto6.jpg"
    ]
};

/**
 * ============================================================================
 * INICIALIZACIÓN
 * ============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Aplicar Configuración
    document.getElementById('svg-title-text').textContent = CONFIG.birthdayMessage;
    document.getElementById('svg-name-text').textContent = CONFIG.birthdayName;
    document.getElementById('special-message').textContent = CONFIG.specialMessage;
    document.getElementById('bg-music').src = CONFIG.musicFile;
    document.getElementById('track-name-display').textContent = CONFIG.musicTitle;

    const photoImages = document.querySelectorAll('.photo img');
    photoImages.forEach((img, index) => {
        if (CONFIG.photos[index]) {
            img.src = CONFIG.photos[index];
        }
    });

    // 2. Elementos del DOM
    const candleScreen = document.getElementById('candle-screen');
    const candleTrigger = document.getElementById('candle-trigger');
    const mainScreen = document.getElementById('main-screen');
    const cakeContainer = document.querySelector('.cake-container');
    const titleText = document.querySelector('.title-text');
    const nameText = document.querySelector('.name-text');
    const specialMessageEl = document.getElementById('special-message');
    const photos = document.querySelectorAll('.photo');
    const musicPlayer = document.querySelector('.music-player-container');
    const garlands = document.querySelectorAll('.floral-garland');

    let isRevealed = false;
    let hasMusicStarted = false; // Bandera para controlar el inicio de la música

    // 3. Evento Click en la Vela (Inicia la secuencia)
    candleTrigger.addEventListener('click', () => {
        if (isRevealed) return;
        isRevealed = true;

        // ESTADO 3: Apagar vela, confeti y transición de fondo
        candleTrigger.classList.add('extinguished');

        setTimeout(() => {
            candleScreen.classList.remove('active');
            mainScreen.classList.add('active');
            document.body.classList.add('revealed');

            // Lanzar Confeti
            fireConfetti();

            // Iniciar Autoplay de la música
            if (!hasMusicStarted) {
                audio.currentTime = CONFIG.musicStartTime;
                audio.play().catch(e => console.log("Navegador bloqueó autoplay:", e));
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                hasMusicStarted = true;
            }

            // Iniciar secuencia de revelación
            startRevealSequence();

        }, 600); // Esperar a que termine la animación de apagado
    });

    // 4. Secuencia de Revelación
    function startRevealSequence() {
        // ESTADO 4: Aparecen las flores y la torta
        setTimeout(() => {
            cakeContainer.classList.add('visible');
            garlands.forEach(garland => garland.classList.add('visible'));
        }, 500);

        // ESTADO 5: Aparece "Feliz cumpleaños"
        setTimeout(() => {
            titleText.classList.add('visible');
        }, 1500);

        // ESTADO 6: Aparece el nombre
        setTimeout(() => {
            nameText.classList.add('visible');
        }, 2200);

        // ESTADO 6.5: Aparece el mensaje especial
        setTimeout(() => {
            specialMessageEl.classList.add('visible');
        }, 2600);

        // ESTADO 7: Aparecen las fotos (con stagger)
        setTimeout(() => {
            photos.forEach((photo, index) => {
                setTimeout(() => {
                    photo.classList.add('visible');
                }, index * 200); // 200ms de diferencia entre cada foto
            });
        }, 3000);

        // ESTADO 8: Aparece el reproductor
        setTimeout(() => {
            musicPlayer.classList.add('visible');
        }, 4500);
    }

    // 5. Función de Confeti (usando canvas-confetti)
    function fireConfetti() {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#b19cd9', '#f8f4ff', '#ffd700']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#b19cd9', '#f8f4ff', '#ffd700']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // 6. Lógica del Reproductor de Música
    const audio = document.getElementById('bg-music');
    const playBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            audio.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    });

    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${percent}%`;
    });

    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    });

    // 7. Auto-ocultar reproductor al llegar al fondo de la página
    // Solo se activa cuando hay scroll real (la página es más alta que la ventana)
    window.addEventListener('scroll', () => {
        if (!musicPlayer) return;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        // Si no hay scroll (escritorio), no ocultar nunca
        if (docHeight <= windowHeight + 10) return;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        // Si estamos a menos de 80px del fondo, ocultar suavemente
        const nearBottom = (scrollTop + windowHeight) >= (docHeight - 80);
        if (nearBottom) {
            musicPlayer.style.opacity = '0';
            musicPlayer.style.pointerEvents = 'none';
        } else if (musicPlayer.classList.contains('visible')) {
            musicPlayer.style.opacity = '';
            musicPlayer.style.pointerEvents = '';
        }
    });
});
