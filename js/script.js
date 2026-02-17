// Dark Mode Toggle with System Preference Detection
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Function to apply theme
function applyTheme(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
    // Use saved preference
    applyTheme(savedTheme === 'dark');
} else {
    // Use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark);
    localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
}

// Theme toggle event listener
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.contains('dark-mode');
        applyTheme(!isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
    });
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only apply if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches);
    }
});

// Card Deck System
const cardDeck = document.querySelector('[data-card-deck]');

if (cardDeck) {
    const cards = Array.from(cardDeck.querySelectorAll('[data-card]'));
    const prevBtn = cardDeck.querySelector('.deck-btn-prev');
    const nextBtn = cardDeck.querySelector('.deck-btn-next');
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let activeIndex = 0;
    let touchStartX = 0;
    let pointerTilt = { x: 0, y: 0 };

    const normalizeOffset = (offset) => {
        const halfway = Math.floor(cards.length / 2);
        if (offset > halfway) return offset - cards.length;
        if (offset < -halfway) return offset + cards.length;
        return offset;
    };

    const deckSpread = () => {
        if (window.innerWidth <= 480) return 68;
        if (window.innerWidth <= 768) return 84;
        if (window.innerWidth <= 1024) return 98;
        return 112;
    };

    const applyLayout = () => {
        const spread = deckSpread();

        cards.forEach((card, index) => {
            const offset = normalizeOffset(index - activeIndex);
            const absOffset = Math.abs(offset);
            const isActive = offset === 0;
            const rotateY = isActive ? pointerTilt.y : offset * 7;
            const rotateX = isActive ? pointerTilt.x : 0;

            card.style.setProperty('--card-x', `${offset * spread}px`);
            card.style.setProperty('--card-y', `${absOffset * 20}px`);
            card.style.setProperty('--card-rz', `${offset * 9}deg`);
            card.style.setProperty('--card-ry', `${rotateY}deg`);
            card.style.setProperty('--card-rx', `${rotateX}deg`);
            card.style.setProperty('--card-scale', `${isActive ? 1 : 0.93 - absOffset * 0.03}`);
            card.style.setProperty('--card-z', `${10 - absOffset}`);
            card.style.setProperty('--card-opacity', `${absOffset > 2 ? 0 : 1}`);
            card.classList.toggle('is-active', isActive);
            card.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });
    };

    const moveActive = (delta) => {
        activeIndex = (activeIndex + delta + cards.length) % cards.length;
        pointerTilt = { x: 0, y: 0 };
        applyLayout();
    };

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (index === activeIndex) {
                const targetUrl = card.getAttribute('data-url');
                if (targetUrl) window.location.href = targetUrl;
                return;
            }
            activeIndex = index;
            pointerTilt = { x: 0, y: 0 };
            applyLayout();
        });
    });

    if (prevBtn) prevBtn.addEventListener('click', () => moveActive(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => moveActive(1));

    cardDeck.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            moveActive(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            moveActive(1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const targetUrl = cards[activeIndex].getAttribute('data-url');
            if (targetUrl) window.location.href = targetUrl;
        }
    });

    cardDeck.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    cardDeck.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;
        if (Math.abs(deltaX) < 35) return;
        moveActive(deltaX > 0 ? -1 : 1);
    }, { passive: true });

    if (supportsHover) {
        cardDeck.addEventListener('pointermove', (e) => {
            const rect = cardDeck.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            pointerTilt = {
                x: (0.5 - y) * 5,
                y: (x - 0.5) * 10
            };
            applyLayout();
        });

        cardDeck.addEventListener('pointerleave', () => {
            pointerTilt = { x: 0, y: 0 };
            applyLayout();
        });
    }

    window.addEventListener('resize', applyLayout);
    applyLayout();
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Allow external links to work normally
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add active class to current navigation item
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

console.log('Welcome to Jakob Weder Portfolio!');
