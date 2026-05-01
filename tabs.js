// Переключение вкладок
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        tabContents.forEach(c => c.classList.remove('active'));
        document.getElementById(`tab-${target}`).classList.add('active');
    });
});

// =====================
// Вкладка 1: История баннеров (из history.json)
// =====================
fetch('history.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('tab-history');
    data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    
    data.forEach(version => {
      const block = document.createElement('div');
      block.className = 'version-block';
      
      const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
      };
      
      const renderCharacters = (chars) => {
        return chars.map(c => `
          <div class="character-row">
            <img src="${c.image || ''}" alt="${c.name}" class="history-char-img" onerror="this.style.display='none'">
            <div class="character-info-history">
              <span class="character-type ${c.type === 'Дебют' ? 'debut' : 'rerun'}">${c.type}</span>
              <span class="character-name-history">${c.name}</span>
            </div>
          </div>
        `).join('');
      };
      
      block.innerHTML = `
        <div class="version-header">Версия ${version.version}</div>
        <div class="version-dates">📅 ${formatDate(version.startDate)} — ${formatDate(version.endDate)}</div>
        <div class="phases">
          <div class="phase">
            <div class="phase-title">Фаза 1</div>
            <div class="phase-dates">📅 ${formatDate(version.phase1.startDate)} — ${formatDate(version.phase1.endDate)}</div>
            ${renderCharacters(version.phase1.characters)}
          </div>
          <div class="phase">
            <div class="phase-title">Фаза 2</div>
            <div class="phase-dates">📅 ${formatDate(version.phase2.startDate)} — ${formatDate(version.phase2.endDate)}</div>
            ${renderCharacters(version.phase2.characters)}
          </div>
        </div>
      `;
      container.appendChild(block);
    });
  });

// =====================
// Вкладка 2: Все персонажи (последний реран) — из data.json
// =====================
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('tab-characters');
    container.innerHTML = '<div class="container" id="characters-grid"></div>';
    const grid = document.getElementById('characters-grid');
    
    // Сортируем от новых к старым
    data.sort((a, b) => new Date(b.lastBannerDate) - new Date(a.lastBannerDate));
    
    data.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'card';
      const days = Math.floor((new Date() - new Date(entry.lastBannerDate + 'T00:00:00')) / (1000 * 60 * 60 * 24));
      
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
      grid.appendChild(card);
    });
  });

// =====================
// Вкладка 3: Анонсы — из announced.json
// =====================
fetch('announced.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('tab-announcements');
    if (data.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:#777;">Пока нет анонсированных персонажей.</p>';
      return;
    }
    
    const grid = document.createElement('div');
    grid.className = 'announcements-grid';
    
    data.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'announcement-card';
      card.innerHTML = `
        <div class="character-name">✨ ${entry.agent}</div>
        <div class="announcement-info">${entry.banner}</div>
        <div class="announcement-info">Версия: ${entry.version}</div>
        <div class="announcement-info" style="color:#ffd700;">Дата уточняется</div>
      `;
      grid.appendChild(card);
    });
    
    container.appendChild(grid);
  })
  .catch(() => {
    document.getElementById('tab-announcements').innerHTML = '<p style="text-align:center;color:#777;">Ошибка загрузки анонсов</p>';
  });
