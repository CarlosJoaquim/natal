// Configuração da API da Bíblia
const BIBLE_CONFIG = {
    API_URL: 'https://bible-api.com',
    TRANSLATION: 'almeida',
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutos em milissegundos
};

// Cache para reduzir requisições à API
const cache = new Map();

// Elementos DOM
const DOM_ELEMENTS = {
    livroSelect: null,
    capituloSelect: null,
    versiculoSelect: null,
    versiculoDisplay: null,
    btnLerCapitulo: null,
    btnSugerirVersiculo: null,
    btnModoLeitura: null,
    loadingIndicator: null,
};

// Livros da Bíblia com número de capítulos
const BOOKS_OF_BIBLE = {
    "Gênesis": 50, "Êxodo": 40, "Levítico": 27, "Números": 36, "Deuteronômio": 34,
    "Josué": 24, "Juízes": 21, "Rute": 4, "1 Samuel": 31, "2 Samuel": 24,
    "1 Reis": 22, "2 Reis": 25, "1 Crônicas": 29, "2 Crônicas": 36, "Esdras": 10,
    "Neemias": 13, "Ester": 10, "Jó": 42, "Salmos": 150, "Provérbios": 31,
    "Eclesiastes": 12, "Cânticos": 8, "Isaías": 66, "Jeremias": 52, "Lamentações": 5,
    "Ezequiel": 48, "Daniel": 12, "Oséias": 14, "Joel": 3, "Amós": 9,
    "Obadias": 1, "Jonas": 4, "Miqueias": 7, "Naum": 3, "Habacuque": 3,
    "Sofonias": 3, "Ageu": 2, "Zacarias": 14, "Malaquias": 4, "Mateus": 28,
    "Marcos": 16, "Lucas": 24, "João": 21, "Atos": 28, "Romanos": 16,
    "1 Coríntios": 16, "2 Coríntios": 13, "Gálatas": 6, "Efésios": 6, "Filipenses": 4,
    "Colossenses": 4, "1 Tessalonicenses": 5, "2 Tessalonicenses": 3, "1 Timóteo": 6,
    "2 Timóteo": 4, "Tito": 3, "Filemom": 1, "Hebreus": 13, "Tiago": 5,
    "1 Pedro": 5, "2 Pedro": 3, "1 João": 5, "2 João": 1, "3 João": 1,
    "Judas": 1, "Apocalipse": 22
};

// Estado da aplicação
const APP_STATE = {
    currentBook: null,
    currentChapter: null,
    currentVerse: null,
    isReadingMode: false,
    isLoading: false
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    setupEventListeners();
    populateBookSelect();
    createLoadingIndicator();
    addDynamicStyles();
});

/**
 * Inicializa os elementos DOM
 */
function initializeElements() {
    DOM_ELEMENTS.livroSelect = document.getElementById('livro');
    DOM_ELEMENTS.capituloSelect = document.getElementById('capitulo');
    DOM_ELEMENTS.versiculoSelect = document.getElementById('versiculo');
    DOM_ELEMENTS.versiculoDisplay = document.getElementById('versiculo-display');
    DOM_ELEMENTS.btnLerCapitulo = document.getElementById('ler-capitulo');
    DOM_ELEMENTS.btnSugerirVersiculo = document.getElementById('sugerir-versiculo');
    DOM_ELEMENTS.btnModoLeitura = document.getElementById('modo-leitura');
    
    // Validação básica dos elementos necessários
    if (!DOM_ELEMENTS.livroSelect || !DOM_ELEMENTS.capituloSelect) {
        console.error('Elementos essenciais não encontrados');
        return;
    }
}

/**
 * Cria indicador de carregamento
 */
function createLoadingIndicator() {
    const loader = document.createElement('div');
    loader.id = 'loading-indicator';
    loader.className = 'loading-indicator';
    loader.innerHTML = `
        <div class="spinner"></div>
        <p>Carregando a Palavra de Deus...</p>
    `;
    loader.style.display = 'none';
    document.body.appendChild(loader);
    DOM_ELEMENTS.loadingIndicator = loader;
}

/**
 * Configura listeners de eventos
 */
function setupEventListeners() {
    if (DOM_ELEMENTS.livroSelect) {
        DOM_ELEMENTS.livroSelect.addEventListener('change', handleBookChange);
    }
    
    if (DOM_ELEMENTS.capituloSelect) {
        DOM_ELEMENTS.capituloSelect.addEventListener('change', handleChapterChange);
    }
    
    if (DOM_ELEMENTS.btnLerCapitulo) {
        DOM_ELEMENTS.btnLerCapitulo.addEventListener('click', handleReadChapter);
    }
    
    if (DOM_ELEMENTS.btnSugerirVersiculo) {
        DOM_ELEMENTS.btnSugerirVersiculo.addEventListener('click', handleSuggestVerse);
    }
    
    if (DOM_ELEMENTS.btnModoLeitura) {
        DOM_ELEMENTS.btnModoLeitura.addEventListener('click', toggleReadingMode);
    }
}

/**
 * Popula o select de livros
 */
function populateBookSelect() {
    if (!DOM_ELEMENTS.livroSelect) return;
    
    // Remove a opção padrão que já está no HTML
    DOM_ELEMENTS.livroSelect.innerHTML = '<option value="">Selecione um livro</option>';
    
    Object.keys(BOOKS_OF_BIBLE).forEach(livro => {
        const option = document.createElement('option');
        option.value = livro;
        option.textContent = livro;
        DOM_ELEMENTS.livroSelect.appendChild(option);
    });
    
    populateVerseSelect();
}

/**
 * Popula o select de versículos
 */
function populateVerseSelect() {
    if (!DOM_ELEMENTS.versiculoSelect) return;
    
    DOM_ELEMENTS.versiculoSelect.innerHTML = '<option value="">Versículo (opcional)</option>';
    
    // Preencher versículos (1-100 para cobrir a maioria)
    for (let i = 1; i <= 100; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        DOM_ELEMENTS.versiculoSelect.appendChild(option);
    }
}

/**
 * Handler para mudança de livro
 */
function handleBookChange() {
    const livro = this.value;
    APP_STATE.currentBook = livro;
    
    if (livro) {
        updateChapters(livro);
        clearChapterDisplay();
    } else {
        resetChapterSelect();
    }
}

/**
 * Handler para mudança de capítulo
 */
function handleChapterChange() {
    const livro = DOM_ELEMENTS.livroSelect.value;
    const capitulo = this.value;
    
    APP_STATE.currentChapter = capitulo;
    APP_STATE.currentVerse = null;
    
    if (livro && capitulo) {
        fetchChapter(livro, capitulo);
    }
}

/**
 * Handler para botão "Ler Capítulo"
 */
function handleReadChapter() {
    const livro = DOM_ELEMENTS.livroSelect.value;
    const capitulo = DOM_ELEMENTS.capituloSelect.value;
    const versiculo = DOM_ELEMENTS.versiculoSelect?.value;
    
    if (!livro || !capitulo) {
        showNotification('Por favor, selecione um livro e um capítulo.', 'warning');
        return;
    }
    
    APP_STATE.currentBook = livro;
    APP_STATE.currentChapter = capitulo;
    APP_STATE.currentVerse = versiculo || null;
    
    if (versiculo) {
        fetchVerse(livro, capitulo, versiculo);
    } else {
        fetchChapter(livro, capitulo);
    }
}

/**
 * Handler para botão "Sugestão de Passagem"
 */
function handleSuggestVerse() {
    // Versículos de conforto e inspiração
    const suggestedVerses = [
        { book: 'Salmos', chapter: 23, verse: 1 },
        { book: 'Salmos', chapter: 46, verse: 1 },
        { book: 'Salmos', chapter: 91, verse: 1 },
        { book: 'Salmos', chapter: 121, verse: 1 },
        { book: 'Mateus', chapter: 11, verse: 28 },
        { book: 'João', chapter: 14, verse: 27 },
        { book: 'Filipenses', chapter: 4, verse: 13 },
        { book: 'Isaías', chapter: 41, verse: 10 },
        { book: 'Romanos', chapter: 8, verse: 28 },
        { book: 'Jeremias', chapter: 29, verse: 11 },
        { book: '2 Coríntios', chapter: 12, verse: 9 },
        { book: '1 Pedro', chapter: 5, verse: 7 }
    ];
    
    // Selecionar versículo aleatório
    const randomVerse = suggestedVerses[Math.floor(Math.random() * suggestedVerses.length)];
    
    // Definir os selects
    DOM_ELEMENTS.livroSelect.value = randomVerse.book;
    handleBookChange.call(DOM_ELEMENTS.livroSelect);
    
    // Aguardar um momento para o select de capítulos ser preenchido
    setTimeout(() => {
        DOM_ELEMENTS.capituloSelect.value = randomVerse.chapter;
        DOM_ELEMENTS.versiculoSelect.value = randomVerse.verse;
        
        APP_STATE.currentBook = randomVerse.book;
        APP_STATE.currentChapter = randomVerse.chapter;
        APP_STATE.currentVerse = randomVerse.verse;
        
        fetchVerse(randomVerse.book, randomVerse.chapter, randomVerse.verse);
    }, 100);
}

/**
 * Atualiza os capítulos baseado no livro selecionado
 */
function updateChapters(livro) {
    if (!DOM_ELEMENTS.capituloSelect) return;
    
    DOM_ELEMENTS.capituloSelect.innerHTML = '<option value="">Selecione um capítulo</option>';
    
    const numCapitulos = BOOKS_OF_BIBLE[livro];
    for (let i = 1; i <= numCapitulos; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        DOM_ELEMENTS.capituloSelect.appendChild(option);
    }
    
    DOM_ELEMENTS.capituloSelect.disabled = false;
}

/**
 * Reseta o select de capítulos
 */
function resetChapterSelect() {
    if (DOM_ELEMENTS.capituloSelect) {
        DOM_ELEMENTS.capituloSelect.innerHTML = '<option value="">Selecione um capítulo</option>';
        DOM_ELEMENTS.capituloSelect.disabled = true;
    }
}

/**
 * Busca capítulo da API com cache
 */
async function fetchChapter(livro, capitulo) {
    const cacheKey = `${livro}_${capitulo}_chapter`;
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
        displayChapter(cachedData);
        return;
    }
    
    showLoading(true);
    
    try {
        const livroCodificado = encodeURIComponent(livro);
        const response = await fetch(
            `${BIBLE_CONFIG.API_URL}/${livroCodificado}+${capitulo}?translation=${BIBLE_CONFIG.TRANSLATION}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.verses && data.verses.length > 0) {
            cacheData(cacheKey, data);
            displayChapter(data);
        } else {
            throw new Error('Capítulo não encontrado');
        }
        
    } catch (error) {
        console.error('Erro ao buscar capítulo:', error);
        showNotification('Não foi possível carregar o capítulo. Verifique sua conexão.', 'error');
        displayError(livro, capitulo);
    } finally {
        showLoading(false);
    }
}

/**
 * Busca versículo específico
 */
async function fetchVerse(livro, capitulo, versiculo) {
    const cacheKey = `${livro}_${capitulo}_${versiculo}_verse`;
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
        displayVerse(cachedData, versiculo);
        return;
    }
    
    showLoading(true);
    
    try {
        const livroCodificado = encodeURIComponent(livro);
        const response = await fetch(
            `${BIBLE_CONFIG.API_URL}/${livroCodificado}+${capitulo}:${versiculo}?translation=${BIBLE_CONFIG.TRANSLATION}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.verses && data.verses.length > 0) {
            cacheData(cacheKey, data);
            displayVerse(data, versiculo);
        } else {
            throw new Error('Versículo não encontrado');
        }
        
    } catch (error) {
        console.error('Erro ao buscar versículo:', error);
        showNotification('Não foi possível carregar o versículo.', 'error');
        displayError(livro, capitulo, versiculo);
    } finally {
        showLoading(false);
    }
}

/**
 * Exibe capítulo
 */
function displayChapter(data) {
    if (!DOM_ELEMENTS.versiculoDisplay) return;
    
    let htmlContent = '';
    
    if (data.verses && Array.isArray(data.verses)) {
        data.verses.forEach(versiculo => {
            htmlContent += `
                <div class="verse-item">
                    <span class="verse-number">${versiculo.verse}</span>
                    <span class="verse-text">${versiculo.text}</span>
                </div>
            `;
        });
    }
    
    DOM_ELEMENTS.versiculoDisplay.innerHTML = `
        <div class="chapter-header">
            <h3>${data.book_name} ${data.chapter}</h3>
            <div class="chapter-meta">
                <span class="translation">Tradução: ${BIBLE_CONFIG.TRANSLATION}</span>
                <span class="verse-count">${data.verses?.length || 0} versículos</span>
            </div>
        </div>
        <div class="verses-container">
            ${htmlContent}
        </div>
        <div class="chapter-navigation">
            <button class="btn-nav prev-chapter" ${data.chapter == 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i> Capítulo Anterior
            </button>
            <button class="btn-nav next-chapter" ${data.chapter >= BOOKS_OF_BIBLE[data.book_name] ? 'disabled' : ''}>
                Próximo Capítulo <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    
    // Atualiza estado
    APP_STATE.currentBook = data.book_name;
    APP_STATE.currentChapter = data.chapter;
    APP_STATE.currentVerse = null;
    
    // Adicionar event listeners aos botões de navegação
    setTimeout(() => {
        document.querySelector('.prev-chapter')?.addEventListener('click', () => {
            goToAdjacentChapter(-1);
        });
        
        document.querySelector('.next-chapter')?.addEventListener('click', () => {
            goToAdjacentChapter(1);
        });
    }, 100);
    
    // Scroll suave para o topo
    DOM_ELEMENTS.versiculoDisplay.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Exibe versículo específico
 */
function displayVerse(data, versiculoNumber) {
    if (!DOM_ELEMENTS.versiculoDisplay || !data.verses || data.verses.length === 0) return;
    
    const verse = data.verses[0];
    const currentVerse = parseInt(versiculoNumber);
    
    DOM_ELEMENTS.versiculoDisplay.innerHTML = `
        <div class="verse-header">
            <h3>${data.book_name} ${data.chapter}:${verse.verse}</h3>
            <div class="verse-meta">
                <span class="translation">Tradução: ${BIBLE_CONFIG.TRANSLATION}</span>
            </div>
        </div>
        <div class="single-verse">
            <span class="verse-number-large">${verse.verse}</span>
            <blockquote class="verse-text-large">${verse.text}</blockquote>
        </div>
        <div class="verse-navigation">
            <button class="btn-nav prev-verse">
                <i class="fas fa-chevron-left"></i> Versículo Anterior
            </button>
            <button class="btn-nav show-chapter">
                <i class="fas fa-book"></i> Ver Capítulo Completo
            </button>
            <button class="btn-nav next-verse">
                Próximo Versículo <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    
    // Atualiza estado
    APP_STATE.currentBook = data.book_name;
    APP_STATE.currentChapter = data.chapter;
    APP_STATE.currentVerse = currentVerse;
    
    // Atualiza select de versículos
    if (DOM_ELEMENTS.versiculoSelect) {
        DOM_ELEMENTS.versiculoSelect.value = currentVerse;
    }
    
    // Adicionar event listeners aos botões
    setTimeout(() => {
        document.querySelector('.prev-verse')?.addEventListener('click', () => {
            goToAdjacentVerse(-1);
        });
        
        document.querySelector('.next-verse')?.addEventListener('click', () => {
            goToAdjacentVerse(1);
        });
        
        document.querySelector('.show-chapter')?.addEventListener('click', () => {
            showFullChapter();
        });
    }, 100);
    
    DOM_ELEMENTS.versiculoDisplay.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Navega para versículo adjacente
 */
function goToAdjacentVerse(direction) {
    if (!APP_STATE.currentBook || !APP_STATE.currentChapter) {
        showNotification('Selecione um livro e capítulo primeiro.', 'warning');
        return;
    }
    
    let currentVerse = APP_STATE.currentVerse || 1;
    const newVerse = currentVerse + direction;
    
    if (newVerse < 1) {
        showNotification('Este é o primeiro versículo do capítulo.', 'info');
        return;
    }
    
    // Verifica se o novo versículo é válido (limitado a 100 por segurança)
    if (newVerse > 100) {
        showNotification('Versículo não encontrado.', 'info');
        return;
    }
    
    // Atualizar o select de versículos
    if (DOM_ELEMENTS.versiculoSelect) {
        DOM_ELEMENTS.versiculoSelect.value = newVerse;
    }
    
    // Buscar o novo versículo
    fetchVerse(APP_STATE.currentBook, APP_STATE.currentChapter, newVerse);
}

/**
 * Mostra o capítulo completo atual
 */
function showFullChapter() {
    if (!APP_STATE.currentBook || !APP_STATE.currentChapter) {
        showNotification('Nenhum capítulo selecionado.', 'warning');
        return;
    }
    
    fetchChapter(APP_STATE.currentBook, APP_STATE.currentChapter);
}

/**
 * Navega para capítulo adjacente - CORRIGIDO
 */
function goToAdjacentChapter(direction) {
    if (!APP_STATE.currentBook || !APP_STATE.currentChapter) {
        showNotification('Selecione um livro e capítulo primeiro.', 'warning');
        return;
    }
    
    const currentChapter = parseInt(APP_STATE.currentChapter);
    const maxChapters = BOOKS_OF_BIBLE[APP_STATE.currentBook];
    const newChapter = currentChapter + direction;
    
    if (newChapter < 1 || newChapter > maxChapters) {
        showNotification('Não há mais capítulos nesta direção.', 'info');
        return;
    }
    
    // Atualiza o select de capítulos
    DOM_ELEMENTS.capituloSelect.value = newChapter;
    
    // Atualiza o estado
    APP_STATE.currentChapter = newChapter.toString();
    APP_STATE.currentVerse = null;
    
    // Busca o novo capítulo diretamente, sem depender do evento change
    fetchChapter(APP_STATE.currentBook, newChapter);
}

/**
 * Limpa a exibição do capítulo
 */
function clearChapterDisplay() {
    if (DOM_ELEMENTS.versiculoDisplay) {
        DOM_ELEMENTS.versiculoDisplay.innerHTML = `
            <div class="versiculo-texto">
                Selecione um capítulo para ler
            </div>
            <div class="versiculo-referencia">
                ---
            </div>
        `;
    }
}

/**
 * Exibe erro
 */
function displayError(livro, capitulo, versiculo = null) {
    if (!DOM_ELEMENTS.versiculoDisplay) return;
    
    const reference = versiculo 
        ? `${livro} ${capitulo}:${versiculo}`
        : `${livro} ${capitulo}`;
    
    DOM_ELEMENTS.versiculoDisplay.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Erro ao carregar</h3>
            <p>Não foi possível carregar ${reference}</p>
            <button class="btn-retry retry-fetch">
                <i class="fas fa-redo"></i> Tentar novamente
            </button>
        </div>
    `;
    
    // Adicionar event listener ao botão de tentar novamente
    setTimeout(() => {
        document.querySelector('.retry-fetch')?.addEventListener('click', () => {
            retryLastFetch();
        });
    }, 100);
}

/**
 * Tenta buscar novamente o último capítulo/versículo
 */
function retryLastFetch() {
    if (!APP_STATE.currentBook || !APP_STATE.currentChapter) {
        showNotification('Nenhuma leitura anterior encontrada.', 'info');
        return;
    }
    
    if (APP_STATE.currentVerse) {
        fetchVerse(APP_STATE.currentBook, APP_STATE.currentChapter, APP_STATE.currentVerse);
    } else {
        fetchChapter(APP_STATE.currentBook, APP_STATE.currentChapter);
    }
}

/**
 * Alterna modo de leitura
 */
function toggleReadingMode() {
    APP_STATE.isReadingMode = !APP_STATE.isReadingMode;
    
    if (DOM_ELEMENTS.versiculoDisplay) {
        DOM_ELEMENTS.versiculoDisplay.classList.toggle('modo-leitura', APP_STATE.isReadingMode);
    }
    
    if (DOM_ELEMENTS.btnModoLeitura) {
        if (APP_STATE.isReadingMode) {
            DOM_ELEMENTS.btnModoLeitura.innerHTML = '<i class="fas fa-times"></i> Sair do Modo Leitura';
            DOM_ELEMENTS.btnModoLeitura.classList.add('active');
            document.body.style.backgroundColor = '#f5f5dc';
        } else {
            DOM_ELEMENTS.btnModoLeitura.innerHTML = '<i class="fas fa-glasses"></i> Modo Leitura';
            DOM_ELEMENTS.btnModoLeitura.classList.remove('active');
            document.body.style.backgroundColor = '';
        }
    }
}

/**
 * Gerencia cache
 */
function cacheData(key, data) {
    const cacheItem = {
        data,
        timestamp: Date.now()
    };
    cache.set(key, cacheItem);
    
    // Limpa cache antigo periodicamente
    setTimeout(() => {
        cache.delete(key);
    }, BIBLE_CONFIG.CACHE_DURATION);
}

/**
 * Obtém dados do cache
 */
function getCachedData(key) {
    const cacheItem = cache.get(key);
    if (!cacheItem) return null;
    
    const isExpired = Date.now() - cacheItem.timestamp > BIBLE_CONFIG.CACHE_DURATION;
    if (isExpired) {
        cache.delete(key);
        return null;
    }
    
    return cacheItem.data;
}

/**
 * Mostra/oculta indicador de carregamento
 */
function showLoading(show) {
    APP_STATE.isLoading = show;
    
    if (DOM_ELEMENTS.loadingIndicator) {
        DOM_ELEMENTS.loadingIndicator.style.display = show ? 'flex' : 'none';
    }
    
    // Desabilita botões durante carregamento
    if (DOM_ELEMENTS.btnLerCapitulo) {
        DOM_ELEMENTS.btnLerCapitulo.disabled = show;
    }
    
    if (DOM_ELEMENTS.btnModoLeitura) {
        DOM_ELEMENTS.btnModoLeitura.disabled = show;
    }
    
    if (DOM_ELEMENTS.btnSugerirVersiculo) {
        DOM_ELEMENTS.btnSugerirVersiculo.disabled = show;
    }
}

/**
 * Mostra notificação
 */
function showNotification(message, type = 'info') {
    // Remove notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Adicionar event listener ao botão de fechar
    notification.querySelector('.close-notification')?.addEventListener('click', () => {
        notification.remove();
    });
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Adiciona estilos CSS necessários dinamicamente
 */
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .loading-indicator {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 1001;
            animation: slideIn 0.3s ease;
        }
        
        .notification-info { background: #3498db; }
        .notification-success { background: #2ecc71; }
        .notification-warning { background: #f39c12; }
        .notification-error { background: #e74c3c; }
        
        .notification button.close-notification {
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            font-size: 1rem;
        }
        
        .verse-item {
            margin-bottom: 1.5rem;
            line-height: 1.6;
            padding-left: 2.5rem;
            position: relative;
        }
        
        .verse-number {
            position: absolute;
            left: 0;
            top: 0;
            background: #f8f9fa;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: bold;
            color: #6c757d;
        }
        
        .verse-navigation, .chapter-navigation {
            display: flex;
            justify-content: space-between;
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #eee;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .btn-nav {
            padding: 0.5rem 1rem;
            background: var(--verde-escuro);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            transition: background-color 0.3s;
        }
        
        .btn-nav:hover {
            background: var(--verde-claro);
        }
        
        .btn-nav:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        
        .modo-leitura {
            background: #f5f5dc;
            padding: 2rem;
            border-radius: 10px;
            max-width: 800px;
            margin: 0 auto;
            font-size: 1.2rem;
            line-height: 1.8;
        }
        
        .error-state {
            text-align: center;
            padding: 2rem;
            color: #6c757d;
        }
        
        .error-state i {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #e74c3c;
        }
        
        .btn-retry {
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .verse-number-large {
            font-size: 2rem;
            font-weight: bold;
            color: var(--dourado);
            display: block;
            margin-bottom: 1rem;
            text-align: center;
        }
        
        .verse-text-large {
            font-size: 1.3rem;
            line-height: 1.8;
            font-style: italic;
            margin: 0;
            padding: 1rem;
            background: #f8f9fa;
            border-left: 4px solid var(--dourado);
        }
        
        .chapter-header, .verse-header {
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--dourado);
        }
        
        .chapter-meta, .verse-meta {
            display: flex;
            gap: 1rem;
            font-size: 0.9rem;
            color: #666;
            margin-top: 0.5rem;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}