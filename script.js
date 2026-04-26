// =====================
// 1. Предстоящие баннеры
// =====================
fetch('upcoming.json')
  .then(response => response.json())
  .then(upcomingData => {
    const upcomingContainer = document.getElementById('upcoming-container');
    
    upcomingData.sort((a, b) => new Date(a.lastBannerDate) - new Date(b.lastBannerDate));
    
    upcomingData.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'upcoming-card';
      
      const bannerDate = new Date(entry.lastBannerDate + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffTime = bannerDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      card.innerHTML = `
        <img src="${entry.image}" alt="${entry.agent}" class="card-img" loading="lazy" onerror="this.src='https://via.placeholder.com/400x500/1a1a1a/ff2d95?text=Coming+Soon'">
        <div class="card-content">
          <div class="upcoming-badge">⚡ СКОРО</div>
          <div class="character-name">${entry.agent}</div>
          <div class="card-info">
            <span class="banner-name">${entry.banner}</span>
            <span class="version">v${entry.version}</span>
          </div>
          <div class="rerun-count" style="color: #ffd166;">
            <div class="rerun-label">До выхода</div>
            ${diffDays} дн.
          </div>
        </div>
      `;
      upcomingContainer.appendChild(card);
    });
    
    if (upcomingData.length > 0) {
      startCountdown(upcomingData[0].lastBannerDate);
    }
  });

// =====================
// 2. Таймер
// =====================
function startCountdown(targetDate) {
  function updateTimer() {
    const now = new Date();
    const target = new Date(targetDate + 'T00:00:00');
    const diff = target - now;
    
    if (diff <= 0) {
      document.getElementById('countdown').innerHTML = '<span>Уже</span> в игре!';
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
  }
  
  updateTimer();
  setInterval(updateTimer, 60000);
}

// =====================
// 3. Все персонажи + топ-5 + фильтры + сортировка
// =====================
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('banner-container');
    const top5Container = document.getElementById('top5-container');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let currentFilter = 'all';
    let currentSort = 'newest';
    
    // Топ-5 по дням без рерана
    const top5 = [...data]
      .sort((a, b) => {
        const bannerDateA = new Date(a.lastBannerDate + 'T00:00:00');
        const bannerDateB = new Date(b.lastBannerDate + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysA = Math.floor((today - bannerDateA) / (1000 * 60 * 60 * 24));
        const daysB = Math.floor((today - bannerDateB) / (1000 * 60 * 60 * 24));
        return daysB - daysA;
      })
      .slice(0, 5);
    
    const rankClasses = ['gold', 'silver', 'bronze', '', ''];
    const rankEmojis = ['🥇', '🥈', '🥉', '4', '5'];
    
    top5Container.innerHTML = top5.map((entry, i) => {
      const bannerDate = new Date(entry.lastBannerDate + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const days = Math.floor((today - bannerDate) / (1000 * 60 * 60 * 24));
      return `
        <div class="top5-item">
          <div class="top5-rank ${rankClasses[i]}">${rankEmojis[i]}</div>
          <div class="top5-info">
            <div class="top5-name">${entry.agent}</div>
            <div class="top5-version">v${entry.version}</div>
          </div>
          <div class="top5-days">${days} дн.</div>
        </div>
      `;
    }).join('');
    
    function getFilteredAndSorted() {
      let filtered = [...data];
      
      if (currentFilter !== 'all') {
        filtered = filtered.filter(e => e.banner.includes(currentFilter));
      }
      
      if (currentSort === 'newest') {
        filtered.sort((a, b) => new Date(b.lastBannerDate) - new Date(a.lastBannerDate));
      } else if (currentSort === 'days') {
        filtered.sort((a, b) => {
          const bannerDateA = new Date(a.lastBannerDate + 'T00:00:00');
          const bannerDateB = new Date(b.lastBannerDate + 'T00:00:00');
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const daysA = Math.floor((today - bannerDateA) / (1000 * 60 * 60 * 24));
          const daysB = Math.floor((today - bannerDateB) / (1000 * 60 * 60 * 24));
          return daysB - daysA;
        });
      } else if (currentSort === 'name') {
        filtered.sort((a, b) => a.agent.localeCompare(b.agent, 'ru'));
      }
      
      return filtered;
    }
    
    function renderCards(filterText = '') {
      container.innerHTML = '';
      let filtered = getFilteredAndSorted();
      
      if (filterText) {
        filtered = filtered.filter(e => e.agent.toLowerCase().includes(filterText.toLowerCase()));
      }
      
      if (filtered.length === 0) {
        container.innerHTML = '<p class="no-results">😔 Ничего не найдено</p>';
        return;
      }
      
      filtered.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'card';
        
        const bannerDate = new Date(entry.lastBannerDate + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const days = Math.floor((today - bannerDate) / (1000 * 60 * 60 * 24));
        
        card.innerHTML = `
          <img src="${entry.image}" alt="${entry.agent}" class="card-img" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300/1a1a1a/333?text=No+Image'">
          <div class="card-content">
            <div class="character-name">${entry.agent}</div>
            <div class="card-info">
              <span class="banner-name">${entry.banner}</span>
              <span class="version">v${entry.version}</span>
            </div>
            <div class="rerun-count">
              <div class="rerun-label">Дней с баннера</div>
              ${days}
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    }
    
    renderCards();
    
    searchInput.addEventListener('input', (e) => {
      renderCards(e.target.value);
    });
    
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderCards(searchInput.value);
    });
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderCards(searchInput.value);
      });
    });
  })
  .catch(err => {
    console.error('Ошибка:', err);
    document.getElementById('banner-container').innerHTML = '<p style="text-align:center;padding:40px;color:#777;">Ошибка загрузки</p>';
  });

// =====================
// 4. Кнопка "Наверх"
// =====================
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
