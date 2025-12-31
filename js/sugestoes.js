// ===========================================================================
// VERSÍCULOS SUGERIDOS - MÓDULO DE INSPIRAÇÃO
// ===========================================================================

/**
 * Módulo responsável por gerenciar versículos sugeridos para diferentes situações
 */
class SugestoesModule {
    constructor() {
        // Banco de dados de versículos
        this.versiculos = this.carregarVersiculos();
        
        // Categorias disponíveis
        this.categorias = {
            forca: 'Força e Coragem',
            esperanca: 'Esperança',
            paz: 'Paz e Consolo',
            fe: 'Fé',
            amor: 'Amor',
            gratidao: 'Gratidão',
            proposito: 'Propósito',
            sabedoria: 'Sabedoria'
        };
        
        // Estado atual
        this.categoriaAtual = 'forca';
        this.historico = [];
        
        // Elementos DOM
        this.elements = {};
        
        this.init();
    }
    
    init() {
        try {
            // Encontrar elementos DOM
            this.findElements();
            
            // Carregar interface
            this.carregarInterface();
            
            // Configurar eventos
            this.configurarEventos();
            
            // Carregar histórico
            this.carregarHistorico();
            
            console.log('✓ Módulo de sugestões inicializado');
            
        } catch (error) {
            console.error('Erro na inicialização do módulo de sugestões:', error);
        }
    }
    
    findElements() {
        // Elementos principais (serão criados dinamicamente)
        this.elements = {
            container: null,
            categorias: null,
            resultado: null,
            historico: null
        };
    }
    
    carregarVersiculos() {
        return [
            // Força e Coragem
            {
                referencia: 'Filipenses 4:13',
                texto: 'Tudo posso naquele que me fortalece.',
                categoria: 'forca',
                temas: ['força', 'fé', 'superação', 'poder'],
                cor: '#27AE60',
                icone: 'fas fa-fist-raised'
            },
            {
                referencia: 'Isaías 41:10',
                texto: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.',
                categoria: 'forca',
                temas: ['coragem', 'proteção', 'companhia divina', 'sustento'],
                cor: '#3498DB',
                icone: 'fas fa-shield-alt'
            },
            {
                referencia: 'Josué 1:9',
                texto: 'Não to mandei eu? Esforça-te, e tem bom ânimo; não pasmes, nem te espantes; porque o SENHOR teu Deus é contigo, por onde quer que andares.',
                categoria: 'forca',
                temas: ['ânimo', 'presença divina', 'coragem', 'direção'],
                cor: '#2ECC71',
                icone: 'fas fa-compass'
            },
            {
                referencia: '2 Timóteo 1:7',
                texto: 'Porque Deus não nos deu o espírito de temor, mas de fortaleza, e de amor, e de moderação.',
                categoria: 'forca',
                temas: ['fortaleza', 'amor', 'moderação', 'poder'],
                cor: '#9B59B6',
                icone: 'fas fa-heart'
            },
            
            // Esperança
            {
                referencia: 'Jeremias 29:11',
                texto: 'Porque eu bem sei os pensamentos que penso de vós, diz o SENHOR; pensamentos de paz, e não de mal, para vos dar o fim que esperais.',
                categoria: 'esperanca',
                temas: ['esperança', 'propósito', 'futuro', 'paz'],
                cor: '#F1C40F',
                icone: 'fas fa-star'
            },
            {
                referencia: 'Romanos 15:13',
                texto: 'E o Deus de esperança vos encha de todo o gozo e paz em crença, para que abundeis em esperança, pela virtude do Espírito Santo.',
                categoria: 'esperanca',
                temas: ['esperança', 'alegria', 'paz', 'Espírito Santo'],
                cor: '#E67E22',
                icone: 'fas fa-dove'
            },
            {
                referencia: 'Salmos 39:7',
                texto: 'Agora, pois, Senhor, que espero eu? A minha esperança está em ti.',
                categoria: 'esperanca',
                temas: ['confiança', 'esperança', 'dependência'],
                cor: '#1ABC9C',
                icone: 'fas fa-anchor'
            },
            
            // Paz e Consolo
            {
                referencia: 'João 14:27',
                texto: 'Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.',
                categoria: 'paz',
                temas: ['paz', 'consolo', 'tranquilidade', 'segurança'],
                cor: '#3498DB',
                icone: 'fas fa-peace'
            },
            {
                referencia: 'Filipenses 4:6-7',
                texto: 'Não estejais inquietos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplica, com ação de graças. E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.',
                categoria: 'paz',
                temas: ['paz', 'oração', 'ansiedade', 'guarda'],
                cor: '#9B59B6',
                icone: 'fas fa-pray'
            },
            {
                referencia: 'Salmos 23:4',
                texto: 'Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estés comigo; a tua vara e o teu cajado me consolam.',
                categoria: 'paz',
                temas: ['proteção', 'consolo', 'coragem', 'companhia'],
                cor: '#2ECC71',
                icone: 'fas fa-hiking'
            },
            {
                referencia: 'Mateus 11:28',
                texto: 'Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.',
                categoria: 'paz',
                temas: ['descanso', 'alívio', 'consolo', 'convite'],
                cor: '#E74C3C',
                icone: 'fas fa-hands-helping'
            },
            
            // Fé
            {
                referencia: 'Hebreus 11:1',
                texto: 'Ora, a fé é o firme fundamento das coisas que se esperam, e a prova das coisas que se não veem.',
                categoria: 'fe',
                temas: ['fé', 'fundamento', 'esperança', 'certeza'],
                cor: '#F39C12',
                icone: 'fas fa-mountain'
            },
            {
                referencia: 'Marcos 11:24',
                texto: 'Por isso vos digo que todas as coisas que pedirdes, orando, crede que as recebereis, e tê-las-eis.',
                categoria: 'fe',
                temas: ['fé', 'oração', 'receber', 'crença'],
                cor: '#2ECC71',
                icone: 'fas fa-hands'
            },
            {
                referencia: '2 Coríntios 5:7',
                texto: 'Porque andamos por fé, e não por vista.',
                categoria: 'fe',
                temas: ['fé', 'caminhar', 'visão espiritual'],
                cor: '#3498DB',
                icone: 'fas fa-walking'
            },
            
            // Amor
            {
                referencia: '1 Coríntios 13:4-7',
                texto: 'O amor é sofredor, é benigno; o amor não é invejoso; o amor não trata com leviandade, não se ensoberbece. Não se porta com indecência, não busca os seus interesses, não se irrita, não suspeita mal; não folga com a injustiça, mas folga com a verdade; tudo sofre, tudo crê, tudo espera, tudo suporta.',
                categoria: 'amor',
                temas: ['amor', 'paciência', 'verdade', 'suportar'],
                cor: '#E74C3C',
                icone: 'fas fa-heart'
            },
            {
                referencia: 'João 3:16',
                texto: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
                categoria: 'amor',
                temas: ['amor', 'sacrifício', 'salvação', 'vida eterna'],
                cor: '#E74C3C',
                icone: 'fas fa-cross'
            },
            {
                referencia: '1 João 4:18',
                texto: 'No amor não há temor, antes o perfeito amor lança fora o temor; porque o temor tem consigo a pena, e o que teme não é perfeito em amor.',
                categoria: 'amor',
                temas: ['amor', 'temor', 'perfeição', 'libertação'],
                cor: '#9B59B6',
                icone: 'fas fa-dove'
            },
            
            // Gratidão
            {
                referencia: '1 Tessalonicenses 5:18',
                texto: 'Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.',
                categoria: 'gratidao',
                temas: ['gratidão', 'vontade de Deus', 'tudo'],
                cor: '#F1C40F',
                icone: 'fas fa-hands-praying'
            },
            {
                referencia: 'Salmos 100:4',
                texto: 'Entrai pelas portas com ação de graças, e em seus átrios com louvor; louvai-o, e bendizei o seu nome.',
                categoria: 'gratidao',
                temas: ['gratidão', 'louvor', 'adoração'],
                cor: '#E67E22',
                icone: 'fas fa-door-open'
            },
            
            // Propósito
            {
                referencia: 'Romanos 8:28',
                texto: 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.',
                categoria: 'proposito',
                temas: ['propósito', 'bem', 'chamado', 'sofrimento'],
                cor: '#3498DB',
                icone: 'fas fa-bullseye'
            },
            {
                referencia: 'Jeremias 1:5',
                texto: 'Antes que te formasse no ventre te conheci, e antes que saísses da madre te santifiquei; às nações te dei por profeta.',
                categoria: 'proposito',
                temas: ['propósito', 'chamado', 'conhecimento divino', 'santificação'],
                cor: '#9B59B6',
                icone: 'fas fa-baby'
            },
            
            // Sabedoria
            {
                referencia: 'Tiago 1:5',
                texto: 'E, se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente, e o não lança em rosto, e ser-lhe-á dada.',
                categoria: 'sabedoria',
                temas: ['sabedoria', 'oração', 'generosidade divina'],
                cor: '#1ABC9C',
                icone: 'fas fa-lightbulb'
            },
            {
                referencia: 'Provérbios 3:5-6',
                texto: 'Confia no SENHOR de todo o teu coração, e não te estribes no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.',
                categoria: 'sabedoria',
                temas: ['confiança', 'sabedoria', 'direção', 'caminhos'],
                cor: '#2ECC71',
                icone: 'fas fa-road'
            }
        ];
    }
    
    // ===========================================================================
    // INTERFACE DO USUÁRIO
    // ===========================================================================
    
    carregarInterface() {
        // Criar interface se não existir
        const containerSugestoes = document.querySelector('.suggestion-cards');
        if (!containerSugestoes) return;
        
        // Limpar container
        containerSugestoes.innerHTML = '';
        
        // Criar interface completa
        const interfaceHTML = `
            <div class="suggestions-interface">
                <!-- Cabeçalho -->
                <div class="suggestions-header">
                    <h3><i class="fas fa-lightbulb"></i> Encontre o Versículo Perfeito</h3>
                    <p class="text-muted">Selecione uma categoria para ver versículos relevantes</p>
                </div>
                
                <!-- Categorias -->
                <div class="suggestions-categories" id="suggestions-categories">
                    ${this.renderizarCategorias()}
                </div>
                
                <!-- Resultado -->
                <div class="suggestions-result" id="suggestions-result">
                    <div class="result-placeholder">
                        <i class="fas fa-search fa-3x mb-3 text-muted"></i>
                        <p class="text-muted">Selecione uma categoria para ver versículos sugeridos</p>
                    </div>
                </div>
                
                <!-- Histórico -->
                <div class="suggestions-history" id="suggestions-history" style="display: none;">
                    <div class="history-header">
                        <h4><i class="fas fa-history"></i> Seu Histórico</h4>
                        <button class="btn btn-sm btn-secondary" id="clear-history">
                            Limpar Histórico
                        </button>
                    </div>
                    <div class="history-list" id="history-list"></div>
                </div>
            </div>
        `;
        
        containerSugestoes.innerHTML = interfaceHTML;
        
        // Atualizar referências aos elementos
        this.elements.container = containerSugestoes;
        this.elements.categorias = document.getElementById('suggestions-categories');
        this.elements.resultado = document.getElementById('suggestions-result');
        this.elements.historico = document.getElementById('suggestions-history');
        
        // Estilizar interface
        this.estilizarInterface();
    }
    
    renderizarCategorias() {
        return Object.entries(this.categorias).map(([chave, nome]) => `
            <div class="category-card" data-category="${chave}">
                <div class="category-icon">
                    <i class="${this.getCategoriaIcone(chave)}"></i>
                </div>
                <div class="category-name">${nome}</div>
            </div>
        `).join('');
    }
    
    getCategoriaIcone(categoria) {
        const icones = {
            forca: 'fas fa-fist-raised',
            esperanca: 'fas fa-star',
            paz: 'fas fa-peace',
            fe: 'fas fa-pray',
            amor: 'fas fa-heart',
            gratidao: 'fas fa-hands-praying',
            proposito: 'fas fa-bullseye',
            sabedoria: 'fas fa-lightbulb'
        };
        
        return icones[categoria] || 'fas fa-star';
    }
    
    estilizarInterface() {
        // Adicionar estilos específicos
        const style = document.createElement('style');
        style.textContent = `
            .suggestions-interface {
                background: white;
                border-radius: var(--border-radius-lg);
                padding: var(--space-lg);
                box-shadow: var(--shadow-md);
            }
            
            .suggestions-header {
                text-align: center;
                margin-bottom: var(--space-xl);
            }
            
            .suggestions-categories {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                gap: var(--space-md);
                margin-bottom: var(--space-xl);
            }
            
            .category-card {
                background: var(--light-color);
                border-radius: var(--border-radius-md);
                padding: var(--space-md);
                text-align: center;
                cursor: pointer;
                transition: all var(--transition-normal);
                border: 2px solid transparent;
            }
            
            .category-card:hover {
                transform: translateY(-3px);
                box-shadow: var(--shadow-md);
                background: white;
                border-color: var(--border-color);
            }
            
            .category-card.active {
                background: linear-gradient(135deg, var(--primary-color), var(--dark-color));
                color: white;
                border-color: var(--primary-color);
            }
            
            .category-icon {
                font-size: 2rem;
                margin-bottom: var(--space-sm);
            }
            
            .category-name {
                font-size: var(--font-size-sm);
                font-weight: 500;
            }
            
            .suggestions-result {
                min-height: 200px;
                background: var(--light-color);
                border-radius: var(--border-radius-md);
                padding: var(--space-lg);
                margin-bottom: var(--space-lg);
            }
            
            .result-placeholder {
                text-align: center;
                padding: var(--space-xl);
                color: var(--text-light);
            }
            
            .verse-suggestion {
                background: white;
                border-radius: var(--border-radius-md);
                padding: var(--space-lg);
                margin-bottom: var(--space-md);
                border-left: 4px solid;
                box-shadow: var(--shadow-sm);
                animation: fadeInUp 0.5s ease;
            }
            
            .verse-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--space-md);
            }
            
            .verse-reference {
                font-size: var(--font-size-lg);
                font-weight: 600;
                color: var(--primary-color);
            }
            
            .verse-text {
                font-size: var(--font-size-lg);
                line-height: 1.6;
                font-style: italic;
                margin-bottom: var(--space-md);
                font-family: var(--font-secondary);
            }
            
            .verse-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: var(--space-md);
                padding-top: var(--space-md);
                border-top: 1px solid var(--border-color);
            }
            
            .verse-themes {
                display: flex;
                gap: var(--space-xs);
                flex-wrap: wrap;
            }
            
            .theme-tag {
                background: var(--light-color);
                color: var(--text-color);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.75rem;
                border: 1px solid var(--border-color);
            }
            
            .suggestions-history {
                background: var(--light-color);
                border-radius: var(--border-radius-md);
                padding: var(--space-lg);
            }
            
            .history-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--space-md);
            }
            
            .history-item {
                background: white;
                border-radius: var(--border-radius-sm);
                padding: var(--space-md);
                margin-bottom: var(--space-sm);
                border-left: 3px solid;
                font-size: var(--font-size-sm);
            }
            
            .history-reference {
                font-weight: 600;
                color: var(--primary-color);
            }
            
            .history-date {
                font-size: 0.75rem;
                color: var(--text-light);
                margin-top: 4px;
            }
            
            .btn-verse-action {
                background: none;
                border: none;
                color: var(--text-light);
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            
            .btn-verse-action:hover {
                background: var(--light-color);
                color: var(--text-color);
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===========================================================================
    // FUNCIONALIDADE PRINCIPAL
    // ===========================================================================
    
    configurarEventos() {
        // Eventos de categoria
        document.addEventListener('click', (e) => {
            const categoryCard = e.target.closest('.category-card');
            if (categoryCard) {
                const categoria = categoryCard.getAttribute('data-category');
                this.selecionarCategoria(categoria);
            }
        });
        
        // Eventos de botões
        document.addEventListener('click', (e) => {
            // Botão para ver contexto na Bíblia
            if (e.target.closest('.btn-read-context')) {
                const referencia = e.target.closest('.btn-read-context').getAttribute('data-reference');
                this.carregarNaBiblia(referencia);
            }
            
            // Botão para copiar
            if (e.target.closest('.btn-copy-verse')) {
                const texto = e.target.closest('.btn-copy-verse').getAttribute('data-text');
                this.copiarVersiculo(texto);
            }
            
            // Botão para favoritar
            if (e.target.closest('.btn-favorite-verse')) {
                const referencia = e.target.closest('.btn-favorite-verse').getAttribute('data-reference');
                const texto = e.target.closest('.btn-favorite-verse').getAttribute('data-text');
                this.favoritarVersiculo(referencia, texto);
            }
            
            // Botão para compartilhar
            if (e.target.closest('.btn-share-verse')) {
                const referencia = e.target.closest('.btn-share-verse').getAttribute('data-reference');
                const texto = e.target.closest('.btn-share-verse').getAttribute('data-text');
                this.compartilharVersiculo(referencia, texto);
            }
            
            // Botão limpar histórico
            if (e.target.id === 'clear-history') {
                this.limparHistorico();
            }
        });
        
        // Teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' && e.ctrlKey) {
                e.preventDefault();
                this.sugerirVersiculoAleatorio();
            }
        });
    }
    
    selecionarCategoria(categoria) {
        // Atualizar categoria atual
        this.categoriaAtual = categoria;
        
        // Atualizar UI das categorias
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('active');
            if (card.getAttribute('data-category') === categoria) {
                card.classList.add('active');
            }
        });
        
        // Filtrar versículos por categoria
        const versiculosFiltrados = this.versiculos.filter(v => v.categoria === categoria);
        
        // Renderizar resultados
        this.renderizarResultados(versiculosFiltrados);
        
        // Mostrar histórico
        this.mostrarHistorico();
    }
    
    renderizarResultados(versiculos) {
        if (!this.elements.resultado) return;
        
        if (versiculos.length === 0) {
            this.elements.resultado.innerHTML = `
                <div class="result-placeholder">
                    <i class="fas fa-book fa-3x mb-3 text-muted"></i>
                    <p class="text-muted">Nenhum versículo encontrado para esta categoria.</p>
                </div>
            `;
            return;
        }
        
        // Embaralhar versículos
        const versiculosEmbaralhados = [...versiculos].sort(() => Math.random() - 0.5);
        
        // Limitar a 5 versículos
        const versiculosParaMostrar = versiculosEmbaralhados.slice(0, 5);
        
        // Renderizar cada versículo
        const resultadosHTML = versiculosParaMostrar.map(versiculo => this.criarCardVersiculo(versiculo)).join('');
        
        this.elements.resultado.innerHTML = `
            <div class="results-header">
                <h4><i class="fas fa-list"></i> ${versiculos.length} Versículos Encontrados</h4>
                <button class="btn btn-sm btn-primary" id="random-verse">
                    <i class="fas fa-random"></i> Aleatório
                </button>
            </div>
            <div class="results-list">
                ${resultadosHTML}
            </div>
        `;
        
        // Configurar botão aleatório
        const btnRandom = document.getElementById('random-verse');
        if (btnRandom) {
            btnRandom.addEventListener('click', () => this.sugerirVersiculoAleatorio());
        }
    }
    
    criarCardVersiculo(versiculo) {
        // Adicionar ao histórico
        this.adicionarAoHistorico(versiculo);
        
        return `
            <div class="verse-suggestion" style="border-left-color: ${versiculo.cor};">
                <div class="verse-header">
                    <div class="verse-reference">
                        <i class="${versiculo.icone}"></i> ${versiculo.referencia}
                    </div>
                    <div class="verse-actions">
                        <button class="btn-verse-action btn-copy-verse" 
                                data-text="${versiculo.texto} - ${versiculo.referencia}"
                                title="Copiar">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn-verse-action btn-favorite-verse"
                                data-reference="${versiculo.referencia}"
                                data-text="${versiculo.texto}"
                                title="Favoritar">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="btn-verse-action btn-share-verse"
                                data-reference="${versiculo.referencia}"
                                data-text="${versiculo.texto}"
                                title="Compartilhar">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
                
                <div class="verse-text">
                    "${versiculo.texto}"
                </div>
                
                <div class="verse-footer">
                    <div class="verse-themes">
                        ${versiculo.temas.map(tema => `<span class="theme-tag">${tema}</span>`).join('')}
                    </div>
                    <button class="btn btn-sm btn-primary btn-read-context"
                            data-reference="${versiculo.referencia}">
                        <i class="fas fa-book-open"></i> Ler na Bíblia
                    </button>
                </div>
            </div>
        `;
    }
    
    // ===========================================================================
    // HISTÓRICO
    // ===========================================================================
    
    adicionarAoHistorico(versiculo) {
        // Verificar se já está no histórico recente
        const existe = this.historico.some(item => 
            item.referencia === versiculo.referencia && 
            item.texto === versiculo.texto
        );
        
        if (!existe) {
            // Adicionar com timestamp
            const historicoItem = {
                ...versiculo,
                timestamp: new Date().toISOString(),
                dataFormatada: new Date().toLocaleString('pt-BR')
            };
            
            this.historico.unshift(historicoItem);
            
            // Limitar a 10 itens
            if (this.historico.length > 10) {
                this.historico = this.historico.slice(0, 10);
            }
            
            // Salvar no localStorage
            this.salvarHistorico();
            
            // Atualizar UI
            this.mostrarHistorico();
        }
    }
    
    mostrarHistorico() {
        if (!this.elements.historico || this.historico.length === 0) {
            if (this.elements.historico) {
                this.elements.historico.style.display = 'none';
            }
            return;
        }
        
        this.elements.historico.style.display = 'block';
        
        // Renderizar histórico
        const historicoHTML = this.historico.map(item => `
            <div class="history-item" style="border-left-color: ${item.cor};">
                <div class="history-reference">${item.referencia}</div>
                <div class="history-text">${item.texto.substring(0, 60)}...</div>
                <div class="history-date">
                    <i class="far fa-clock"></i> ${item.dataFormatada}
                </div>
            </div>
        `).join('');
        
        const historyList = document.getElementById('history-list');
        if (historyList) {
            historyList.innerHTML = historicoHTML;
        }
    }
    
    carregarHistorico() {
        try {
            const historicoSalvo = localStorage.getItem('sugestoes-historico');
            if (historicoSalvo) {
                this.historico = JSON.parse(historicoSalvo);
            }
        } catch (error) {
            console.warn('Não foi possível carregar o histórico:', error);
            this.historico = [];
        }
    }
    
    salvarHistorico() {
        try {
            localStorage.setItem('sugestoes-historico', JSON.stringify(this.historico));
        } catch (error) {
            console.warn('Não foi possível salvar o histórico:', error);
        }
    }
    
    limparHistorico() {
        if (confirm('Tem certeza que deseja limpar seu histórico de versículos?')) {
            this.historico = [];
            this.salvarHistorico();
            this.mostrarHistorico();
            this.mostrarNotificacao('Histórico limpo!', 'success');
        }
    }
    
    // ===========================================================================
    // FUNÇÕES DE AÇÃO
    // ===========================================================================
    
    sugerirVersiculoAleatorio() {
        // Versículo aleatório de qualquer categoria
        const versiculoAleatorio = this.versiculos[Math.floor(Math.random() * this.versiculos.length)];
        
        // Mostrar em um modal especial
        this.mostrarModalVersiculoAleatorio(versiculoAleatorio);
    }
    
    mostrarModalVersiculoAleatorio(versiculo) {
        // Criar modal
        const modal = document.createElement('div');
        modal.className = 'modal-random-verse';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-random"></i> Versículo do Dia</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="random-verse-card" style="border-left-color: ${versiculo.cor};">
                        <div class="random-verse-header">
                            <div class="random-verse-icon">
                                <i class="${versiculo.icone}"></i>
                            </div>
                            <div class="random-verse-reference">
                                ${versiculo.referencia}
                            </div>
                        </div>
                        <div class="random-verse-text">
                            "${versiculo.texto}"
                        </div>
                        <div class="random-verse-themes">
                            ${versiculo.temas.map(tema => `<span class="theme-tag">${tema}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="close-random">
                        Fechar
                    </button>
                    <button class="btn btn-primary" id="save-random"
                            data-reference="${versiculo.referencia}"
                            data-text="${versiculo.texto}">
                        <i class="fas fa-save"></i> Salvar
                    </button>
                    <button class="btn btn-success" id="share-random"
                            data-reference="${versiculo.referencia}"
                            data-text="${versiculo.texto}">
                        <i class="fas fa-share-alt"></i> Compartilhar
                    </button>
                </div>
            </div>
        `;
        
        // Estilos do modal
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: white;
            border-radius: var(--border-radius-lg);
            max-width: 500px;
            width: 90%;
            animation: slideInUp 0.3s ease;
        `;
        
        document.body.appendChild(modal);
        
        // Eventos do modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('#close-random').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('#save-random').addEventListener('click', () => {
            const referencia = modal.querySelector('#save-random').getAttribute('data-reference');
            const texto = modal.querySelector('#save-random').getAttribute('data-text');
            this.favoritarVersiculo(referencia, texto);
            modal.remove();
        });
        
        modal.querySelector('#share-random').addEventListener('click', () => {
            const referencia = modal.querySelector('#share-random').getAttribute('data-reference');
            const texto = modal.querySelector('#share-random').getAttribute('data-text');
            this.compartilharVersiculo(referencia, texto);
        });
        
        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Fechar com ESC
        document.addEventListener('keydown', function closeModal(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeModal);
            }
        });
    }
    
    async carregarNaBiblia(referencia) {
        try {
            // Usar o módulo da Bíblia se disponível
            if (window.bibliaModule && typeof window.bibliaModule.carregarSugestaoPorReferencia === 'function') {
                await window.bibliaModule.carregarSugestaoPorReferencia(referencia);
            } else {
                // Fallback
                this.mostrarNotificacao(`Carregando ${referencia}...`, 'info');
                
                // Simular navegação
                setTimeout(() => {
                    const linkBiblia = document.querySelector('.nav-link[data-section="biblia"]');
                    if (linkBiblia) {
                        linkBiblia.click();
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Erro ao carregar na Bíblia:', error);
            this.mostrarNotificacao('Não foi possível carregar na Bíblia', 'error');
        }
    }
    
    async copiarVersiculo(texto) {
        try {
            await navigator.clipboard.writeText(texto);
            this.mostrarNotificacao('Versículo copiado!', 'success');
        } catch (error) {
            console.error('Erro ao copiar:', error);
            this.mostrarNotificacao('Erro ao copiar', 'error');
        }
    }
    
    favoritarVersiculo(referencia, texto) {
        try {
            const favoritos = JSON.parse(localStorage.getItem('versiculos-favoritos') || '[]');
            
            // Verificar se já está favoritado
            const jaFavoritado = favoritos.some(fav => fav.referencia === referencia);
            
            if (!jaFavoritado) {
                favoritos.push({
                    referencia,
                    texto,
                    data: new Date().toISOString(),
                    dataFormatada: new Date().toLocaleString('pt-BR')
                });
                
                localStorage.setItem('versiculos-favoritos', JSON.stringify(favoritos));
                
                this.mostrarNotificacao('Versículo favoritado!', 'success');
            } else {
                this.mostrarNotificacao('Este versículo já está nos favoritos', 'info');
            }
        } catch (error) {
            console.error('Erro ao favoritar versículo:', error);
            this.mostrarNotificacao('Erro ao favoritar', 'error');
        }
    }
    
    compartilharVersiculo(referencia, texto) {
        const textoCompleto = `${texto} - ${referencia}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Versículo Bíblico',
                text: textoCompleto,
                url: window.location.href
            }).catch(err => {
                console.log('Erro ao compartilhar:', err);
                this.copiarVersiculo(textoCompleto);
            });
        } else {
            this.copiarVersiculo(textoCompleto);
        }
    }
    
    mostrarNotificacao(mensagem, tipo = 'info') {
        if (window.refugioApp && typeof window.refugioApp.showNotification === 'function') {
            window.refugioApp.showNotification(mensagem, tipo);
        } else {
            // Fallback básico
            alert(mensagem);
        }
    }
    
    // ===========================================================================
    // MÉTODOS PÚBLICOS
    // ===========================================================================
    
    sugerirParaSituacao(situacao) {
        // Mapear situações para categorias
        const mapeamento = {
            'tristeza': 'paz',
            'medo': 'forca',
            'ansiedade': 'paz',
            'dúvida': 'fe',
            'decisão': 'sabedoria',
            'gratidão': 'gratidao',
            'amor': 'amor',
            'esperança': 'esperanca',
            'propósito': 'proposito'
        };
        
        const categoria = mapeamento[situacao.toLowerCase()] || 'forca';
        this.selecionarCategoria(categoria);
        
        return this.obterVersiculosPorCategoria(categoria);
    }
    
    obterVersiculosPorCategoria(categoria) {
        return this.versiculos.filter(v => v.categoria === categoria);
    }
    
    obterVersiculoAleatorio() {
        return this.versiculos[Math.floor(Math.random() * this.versiculos.length)];
    }
}

// ===========================================================================
// INICIALIZAÇÃO E EXPORTAÇÃO
// ===========================================================================

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.sugestoesModule = new SugestoesModule();
});

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SugestoesModule };
}