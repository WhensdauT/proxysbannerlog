fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('banner-container');
    const searchInput = document.getElementById('search-input');
    
    // Сортируем от новых к старым
    data.sort((a, b) => new Date(b.lastBannerDate) - new Date(a.lastBannerDate));
    
    // Функция отрисовки карточек
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
    
    // Первая отрисовка (все карточки)
    renderCards();
    
    // Обработчик поиска
    searchInput.addEventListener('input', (e) => {
      renderCards(e.target.value);
    });
  })
  .catch(err => {
    console.error('Ошибка загрузки данных:', err);
    document.getElementById('banner-container').innerHTML = '<p style="text-align:center;padding:40px;color:#777;">Ошибка загрузки данных</p>';
  });
