// Défilement fluide pour les liens de navigation
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

// Animation au défilement
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observer tous les éléments avec la classe animate-in
document.querySelectorAll('.animate-in').forEach(el => {
    observer.observe(el);
});

// Animation des carrés géométriques
function animateSquares() {
    const squares = document.querySelectorAll('.square');
    squares.forEach((square, index) => {
        square.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite alternate`;
    });
}

// Démarrer l'animation des carrés
animateSquares();

// Effet parallax léger sur les carrés
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const squares = document.querySelectorAll('.square');
    
    squares.forEach((square, index) => {
        const speed = 0.1 + (index * 0.05);
        square.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Effet de frappe pour le titre principal
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Activer l'effet de frappe au chargement
window.addEventListener('load', () => {
    const title = document.querySelector('.hero-content h1');
    if (title) {
        const originalText = title.textContent;
        typeWriter(title, originalText, 150);
    }
});

// Animation du menu mobile (si vous voulez l'ajouter plus tard)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-active');
}

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    // Recalculer les animations si nécessaire
    animateSquares();
});

// Effet de survol amélioré pour les cartes
document.querySelectorAll('.project-card, .skill-category, .interest-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Gestion des erreurs pour le téléchargement du CV
document.querySelector('.download-btn')?.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') {
        e.preventDefault();
        alert('Le CV sera bientôt disponible au téléchargement !');
    }
});

// Animation des tags technologiques
document.querySelectorAll('.tech-tag, .learning-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Console log stylisé (pour les développeurs curieux)
console.log('%c🚀 Portfolio de Jonathan Godwin', 'color: #a855f7; font-size: 20px; font-weight: bold;');
console.log('%cDéveloppé avec passion pour le Data Engineering', 'color: #cccccc; font-size: 14px;');
console.log('%cSi vous lisez ceci, n\'hésitez pas à me contacter ! 😄', 'color: #fb923c; font-size: 12px;');