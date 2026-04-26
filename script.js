// Загружаем предстоящих персонажей
fetch('upcoming.json')
  .then(response => response.json())
  .then(upcomingData => {
    const upcomingContainer = document.getElementById('upcoming-container');
    
    upcomingData.sort((a, b) => new Date(a.lastBannerDate) - new Date(b.lastBannerDate));
    
    upcomingData.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'upcoming-card';
      
      const lastBannerDate = new Date(entry.lastBannerDate);
      const today = new Date();
      const diffTime = lastBannerDate - today;
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
  });

// Загружаем всех персонажей
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('banner-container');
    const searchInput = document.getElementById('search-input');
    
    data.sort((a, b) => new Date(b.lastBannerDate) - new Date(a.lastBannerDate));
    
    function renderCards(filterText = '') {
      container.innerHTML = '';
      
      const filtered = data.filter(entry => 
        entry.agent.toLowerCase().includes(filterText.toLowerCase())
      );
      
      if (filtered.length === 0) {
        container.innerHTML = '<p class="no-results">😔 Ничего не найдено</p>';
        return;
      }
      
      filtered.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'card';
        
        const lastBannerDate = new Date(entry.lastBannerDate);
        const today = new Date();
        const diffTime = Math.abs(today - lastBannerDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
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
              ${diffDays}
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
  })
  .catch(err => {
    console.error('Ошибка загрузки данных:', err);
    document.getElementById('banner-container').innerHTML = '<p style="text-align:center;padding:40px;color:#777;">Ошибка загрузки данных</p>';
  });
