fetch('history.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('history-container');
    
    // Сортируем версии от новых к старым
    data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    
    data.forEach(version => {
      const block = document.createElement('div');
      block.className = 'version-block';
      
      const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
      };
      
      const renderCharacters = (characters) => {
        return characters.map(c => `
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
  })
  .catch(err => {
    console.error('Ошибка загрузки истории:', err);
    document.getElementById('history-container').innerHTML = '<p style="text-align:center;padding:40px;color:#777;">Ошибка загрузки данных</p>';
  });
