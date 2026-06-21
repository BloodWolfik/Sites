const fs = require('fs');
const path = require('path');

// ============================================================
// НАСТРОЙКИ
// ============================================================
const REPO_OWNER = 'BloodWolfik';        // Ваш логин
const REPO_NAME = 'Sites';               // Название репозитория
const BRANCH = 'main';                   // Ветка
const ICONS_PATH = 'icons';              // Папка с иконками

// Разрешённые расширения
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'];

// ============================================================
// ГЕНЕРАЦИЯ HTML
// ============================================================
function generatePage() {
    console.log('📂 Читаем папку с иконками...');
    
    // Проверяем, существует ли папка
    if (!fs.existsSync(ICONS_PATH)) {
        console.error(`❌ Папка "${ICONS_PATH}" не найдена!`);
        process.exit(1);
    }

    // Получаем список файлов
    const files = fs.readdirSync(ICONS_PATH);
    
    // Фильтруем только изображения
    const iconFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ALLOWED_EXTENSIONS.includes(ext);
    });

    if (iconFiles.length === 0) {
        console.error(`❌ В папке "${ICONS_PATH}" нет изображений!`);
        process.exit(1);
    }

    console.log(`✅ Найдено ${iconFiles.length} иконок`);

    // Формируем данные для каждой иконки
    const icons = iconFiles.map(file => {
        const name = path.parse(file).name;
        const filePath = `${ICONS_PATH}/${file}`;
        return {
            name,
            raw: `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${filePath}`,
            cdn: `https://cdn.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}@${BRANCH}/${filePath}`
        };
    });

    // ============================================================
    // ГЕНЕРИРУЕМ HTML
    // ============================================================
    console.log('🔄 Генерируем HTML...');

    let html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Иконки для Clash — RAW + CDN</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: #0d1117;
            color: #c9d1d9;
            padding: 2rem;
            min-height: 100vh;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto 2rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        h1 { font-size: 1.8rem; display: flex; align-items: center; gap: 0.5rem; }
        h1 small { font-size: 0.9rem; font-weight: 400; color: #8b949e; background: #161b22; padding: 0.2rem 0.8rem; border-radius: 20px; border: 1px solid #30363d; }
        .header-controls { display: flex; align-items: center; gap: 1rem; }
        .search-box input {
            padding: 0.6rem 1rem;
            border-radius: 8px;
            border: 1px solid #30363d;
            background: #161b22;
            color: #c9d1d9;
            font-size: 0.95rem;
            outline: none;
            width: 250px;
            transition: border-color 0.3s;
        }
        .search-box input:focus { border-color: #58a6ff; }
        .search-box input::placeholder { color: #484f58; }
        
        .stats {
            text-align: center;
            margin-bottom: 1.5rem;
            color: #8b949e;
        }
        .stats span {
            background: #161b22;
            padding: 0.3rem 1rem;
            border-radius: 20px;
            border: 1px solid #30363d;
        }
        
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .icon-card {
            background: #161b22;
            border-radius: 12px;
            padding: 1.5rem 1rem;
            text-align: center;
            border: 1px solid #30363d;
            transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
            cursor: pointer;
        }
        .icon-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            border-color: #7c5cfc;
        }
        .icon-card img {
            width: 100%;
            max-height: 140px;
            object-fit: contain;
            background: #0d1117;
            border-radius: 8px;
            padding: 8px;
        }
        .icon-card .name {
            margin-top: 0.75rem;
            font-size: 0.9rem;
            color: #8b949e;
            word-break: break-all;
            font-weight: 500;
        }
        .link-buttons {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.75rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        .link-btn {
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            border: none;
            font-size: 0.7rem;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.2s, transform 0.1s;
        }
        .link-btn:hover { opacity: 0.85; transform: scale(0.97); }
        .link-btn.raw { background: #238636; color: #fff; }
        .link-btn.cdn { background: #7c5cfc; color: #fff; }
        .badge-type {
            display: inline-block;
            margin-top: 0.3rem;
            font-size: 0.6rem;
            color: #484f58;
            background: #161b22;
            padding: 0.1rem 0.6rem;
            border-radius: 12px;
            border: 1px solid #30363d;
        }
        
        .toast {
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: #161b22;
            border: 1px solid #30363d;
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            opacity: 0;
            transition: all 0.4s ease;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 8px 30px rgba(0,0,0,0.5);
            max-width: 90%;
        }
        .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
        .toast.success { border-color: #238636; }
        .toast.error { border-color: #f85149; }
        
        .footer-note {
            text-align: center;
            margin-top: 2.5rem;
            font-size: 0.85rem;
            color: #484f58;
            border-top: 1px solid #30363d;
            padding-top: 1.5rem;
        }
        .footer-note .clash-tip { color: #7c5cfc; font-weight: 500; }
        
        @media (max-width: 600px) {
            body { padding: 1rem; }
            .header { flex-direction: column; align-items: stretch; }
            .header-controls { justify-content: space-between; }
            .search-box input { width: 100%; }
            .gallery { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; }
            .icon-card img { max-height: 100px; }
            .link-btn { font-size: 0.6rem; padding: 0.2rem 0.6rem; }
        }
        
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #484f58; }
    </style>
</head>
<body>

    <div class="header">
        <h1>🚀 Иконки для Clash <small>RAW + CDN</small></h1>
        <div class="header-controls">
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="🔍 Поиск..." oninput="filterIcons()">
            </div>
        </div>
    </div>

    <div class="stats">
        📦 <span id="countDisplay">${icons.length}</span> иконок
    </div>

    <div class="gallery" id="gallery">`;

    // Добавляем каждую иконку
    icons.forEach(icon => {
        html += `
        <div class="icon-card">
            <img src="${icon.raw}" alt="${icon.name}" loading="lazy" onerror="this.style.display='none'">
            <div class="name">${icon.name}</div>
            <div class="link-buttons">
                <button class="link-btn raw" data-url="${icon.raw}" data-name="${icon.name}">⬇ RAW</button>
                <button class="link-btn cdn" data-url="${icon.cdn}" data-name="${icon.name}">🌐 CDN</button>
            </div>
            <div class="badge-type">⚡ Clash</div>
        </div>`;
    });

    html += `
    </div>

    <div id="toast" class="toast">✅ Скопировано!</div>

    <div class="footer-note">
        ⚡ Нажмите <strong>RAW</strong> или <strong>CDN</strong> чтобы скопировать ссылку для Clash
        <span class="clash-tip">(вставьте в поле «URL иконки»)</span>
    </div>

    <script>
        // ============================================================
        // ФУНКЦИИ ДЛЯ РАБОТЫ С ГАЛЕРЕЕЙ
        // ============================================================
        const gallery = document.getElementById('gallery');
        const toast = document.getElementById('toast');
        const searchInput = document.getElementById('searchInput');
        const countDisplay = document.getElementById('countDisplay');
        
        // Все иконки уже вшиты в HTML, но нам нужен массив для поиска
        const allIcons = ${JSON.stringify(icons)};
        
        // ============================================================
        // ПОИСК
        // ============================================================
        function filterIcons() {
            const query = searchInput.value.toLowerCase().trim();
            const cards = gallery.querySelectorAll('.icon-card');
            
            let visibleCount = 0;
            cards.forEach((card, index) => {
                const name = allIcons[index]?.name || '';
                const match = name.toLowerCase().includes(query);
                card.style.display = match ? '' : 'none';
                if (match) visibleCount++;
            });
            
            countDisplay.textContent = visibleCount;
        }
        
        // ============================================================
        // КОПИРОВАНИЕ
        // ============================================================
        function copyToClipboard(text, label) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(\`✅ \${label} — скопировано!\`, 'success');
            }).catch(() => {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    showToast(\`✅ \${label} — скопировано!\`, 'success');
                } catch {
                    showToast(\`❌ Не удалось скопировать\`, 'error');
                }
                document.body.removeChild(textarea);
            });
        }
        
        // ============================================================
        // TOAST
        // ============================================================
        let toastTimeout;
        function showToast(message, type = 'success') {
            toast.textContent = message;
            toast.className = \`toast \${type}\`;
            clearTimeout(toastTimeout);
            requestAnimationFrame(() => toast.classList.add('show'));
            toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
        }
        
        // ============================================================
        // ОБРАБОТЧИКИ КНОПОК
        // ============================================================
        document.querySelectorAll('.link-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const url = btn.dataset.url;
                const name = btn.dataset.name;
                const type = btn.classList.contains('cdn') ? 'CDN' : 'RAW';
                copyToClipboard(url, \`\${name} (\${type})\`);
            });
        });
        
        // Клик по карточке — копируем RAW
        document.querySelectorAll('.icon-card').forEach(card => {
            card.addEventListener('click', function() {
                const rawBtn = this.querySelector('.link-btn.raw');
                if (rawBtn) {
                    copyToClipboard(rawBtn.dataset.url, \`\${rawBtn.dataset.name} (RAW)\`);
                }
            });
        });
        
        console.log('✅ Иконки загружены! Всего:', allIcons.length);
    </script>
</body>
</html>`;

    // Сохраняем index.html
    fs.writeFileSync('index.html', html);
    console.log('✅ Файл index.html успешно создан!');
    console.log(`📊 Всего иконок: ${icons.length}`);
}

// ============================================================
// ЗАПУСК
// ============================================================
generatePage();
