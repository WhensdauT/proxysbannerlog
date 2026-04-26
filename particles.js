// Создаём контейнер для частиц
const particlesContainer = document.createElement('div');
particlesContainer.className = 'particles';
document.body.prepend(particlesContainer);

// Создаём частицы
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Случайный цвет
    const colors = ['pink', 'blue', 'gold'];
    particle.classList.add(colors[Math.floor(Math.random() * colors.length)]);
    
    // Случайная позиция
    particle.style.left = Math.random() * 100 + '%';
    
    // Случайный размер
    const size = Math.random() * 6 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Случайная длительность анимации
    const duration = Math.random() * 15 + 10;
    particle.style.animationDuration = duration + 's';
    
    // Случайная задержка
    particle.style.animationDelay = Math.random() * 5 + 's';
    
    particlesContainer.appendChild(particle);
    
    // Удаляем частицу после анимации
    setTimeout(() => {
        particle.remove();
    }, (duration + 5) * 1000);
}

// Создаём начальные частицы
for (let i = 0; i < 20; i++) {
    setTimeout(createParticle, Math.random() * 5000);
}

// Создаём новые частицы постоянно
setInterval(createParticle, 800);
