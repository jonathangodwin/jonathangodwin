// ========== ANIMATION AU SCROLL ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = Math.random() * 0.3 + 's';
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observer tous les éléments à animer
document.querySelectorAll('.game-card, .section-title').forEach(el => {
    observer.observe(el);
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== PARALLAX EFFECT ==========
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const squares = document.querySelectorAll('.square');
    
    squares.forEach((square, index) => {
        const speed = 0.5 + (index * 0.1);
        square.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// ========== HEADER SCROLL EFFECT ==========
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 15, 35, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(15, 15, 35, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// ========== GAME CARD INTERACTIONS ==========
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(-10px) scale(1)';
    });
});

// ========== PRELOAD ANIMATIONS ==========
document.addEventListener('DOMContentLoaded', () => {
    // Ajouter une classe pour indiquer que le DOM est chargé
    document.body.classList.add('loaded');
    
    // Initialiser les animations des éléments visibles
    const visibleElements = document.querySelectorAll('.hero-content, .logo');
    visibleElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// ========== KEYBOARD NAVIGATION ==========
document.addEventListener('keydown', (e) => {
    // Navigation avec les flèches
    if (e.key === 'ArrowDown') {
        window.scrollBy(0, window.innerHeight * 0.5);
    } else if (e.key === 'ArrowUp') {
        window.scrollBy(0, -window.innerHeight * 0.5);
    }
    
    // Navigation avec les touches numériques
    const sections = ['#accueil', '#jeux', '#a-propos', '#contact'];
    const keyNum = parseInt(e.key);
    if (keyNum >= 1 && keyNum <= sections.length) {
        const target = document.querySelector(sections[keyNum - 1]);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ========== MOBILE MENU (si nécessaire pour versions futures) ==========
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// ========== PERFORMANCE OPTIMIZATIONS ==========
// Throttle pour les événements de scroll
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Appliquer le throttling aux événements de scroll
const throttledScrollHandler = throttle(() => {
    // Code pour les effets de scroll optimisés
    const scrolled = window.pageYOffset;
    const squares = document.querySelectorAll('.square');
    
    // Utiliser requestAnimationFrame pour des animations fluides
    requestAnimationFrame(() => {
        squares.forEach((square, index) => {
            const speed = 0.5 + (index * 0.1);
            square.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// ========== ANALYTICS & TRACKING (optionnel) ==========
function trackGameClick(gameName) {
    console.log(`Jeu cliqué: ${gameName}`);
    // Ici vous pourriez ajouter Google Analytics ou autre
}

// Ajouter les event listeners pour le tracking
document.querySelectorAll('.game-link:not(.disabled)').forEach(link => {
    link.addEventListener('click', (e) => {
        const gameCard = e.target.closest('.game-card');
        const gameName = gameCard.querySelector('h3').textContent;
        trackGameClick(gameName);
    });
});

// ========== EASTER EGG ==========
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        // Easter egg activé !
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 3000);
        
        console.log('🎮 Easter egg activé ! Développeur détecté 😉');
    }
});