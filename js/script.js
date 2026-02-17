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
themeToggle.addEventListener('click', () => {
    const isDarkMode = body.classList.contains('dark-mode');
    applyTheme(!isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only apply if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches);
    }
});

// Card Deck Interactive Effect
const cardDeck = document.querySelector('.card-deck');
const cards = document.querySelectorAll('.card');

const cardBasePositions = [
    { left: 10, top: 20, rotateZ: -20, rotateY: -20 },
    { left: 20, top: 50, rotateZ: 0, rotateY: 0 },
    { left: 30, top: 80, rotateZ: 20, rotateY: 20 }
];

if (cardDeck) {
    // Mouse tracking effect
    document.addEventListener('mousemove', (e) => {
        const deckRect = cardDeck.getBoundingClientRect();
        
        // Check if mouse is over the deck area
        const isOverDeck = (
            e.clientX >= deckRect.left &&
            e.clientX <= deckRect.right &&
            e.clientY >= deckRect.top &&
            e.clientY <= deckRect.bottom
        );
        
        if (!isOverDeck) return;
        
        const deckCenterX = deckRect.left + deckRect.width / 2;
        const deckCenterY = deckRect.top + deckRect.height / 2;
        
        const distX = (e.clientX - deckCenterX) / 100;
        const distY = (e.clientY - deckCenterY) / 100;
        
        cards.forEach((card, index) => {
            const basePos = cardBasePositions[index];
            
            const rotateX = distY * 1.5;
            const rotateY = basePos.rotateY + distX * 1.5;
            const rotateZ = basePos.rotateZ;
            
            card.style.transition = 'none';
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
        });
    });

    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
        resetCardPositions();
    });

    function resetCardPositions() {
        cards.forEach((card, index) => {
            const basePos = cardBasePositions[index];
            card.style.transition = 'all 0.3s ease-out';
            card.style.left = basePos.left + 'px';
            card.style.top = basePos.top + 'px';
            card.style.zIndex = 3 - index;
            card.style.transform = `rotateZ(${basePos.rotateZ}deg) rotateY(${basePos.rotateY}deg)`;
        });
    }
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