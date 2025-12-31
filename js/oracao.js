// Área de oração e conversa com Deus - Versão Aprimorada
class DiarioEspiritual {
    constructor() {
        this.chaveStorage = 'diario-eunice-v2';
        this.chaveRascunho = 'diario-rascunho-v2';
        this.chaveConfig = 'diario-config-v2';
        this.orações = this.carregarOracoes();
        this.configuracoes = this.carregarConfiguracoes();
        this.inicializar();
    }
    
    inicializar() {
        this.cacheElementos();
        this.setupEventListeners();
        this.carregarRascunho();
        this.atualizarInterface();
        this.aplicarTema();
        this.iniciarPlaceholderDinamico();
        this.adicionarElementosUI();
    }
    
    cacheElementos() {
        this.textareaOracao = document.getElementById('texto-oracao');
        this.btnSalvar = document.getElementById('salvar-oracao');
        this.btnLimpar = document.getElementById('limpar-oracao');
        this.mensagemBiblica = document.getElementById('mensagem-biblica');
        this.container = document.querySelector('.oracao-container');
    }
    
    setupEventListeners() {
        if (this.btnSalvar) {
            this.btnSalvar.addEventListener('click', () => this.salvarOracao());
        }
        
        if (this.btnLimpar) {
            this.btnLimpar.addEventListener('click', () => this.limparOracao());
        }
        
        if (this.textareaOracao) {
            // Auto-save com debounce
            this.textareaOracao.addEventListener('input', this.debounce(() => {
                this.salvarRascunho();
                this.atualizarContadorCaracteres();
            }, 1000));
            
            // Atalhos de teclado
            this.textareaOracao.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + Enter para salvar
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    this.salvarOracao();
                }
                
                // Esc para limpar
                if (e.key === 'Escape') {
                    this.limparOracao();
                }
            });
        }
        
        // Listener para tema
        document.addEventListener('diarioTemaAlterado', (e) => {
            this.configuracoes.tema = e.detail.tema;
            this.salvarConfiguracoes();
            this.aplicarTema();
        });
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    carregarConfiguracoes() {
        try {
            const config = localStorage.getItem(this.chaveConfig);
            const padrao = {
                tema: 'claro',
                tamanhoFonte: 'medio',
                autoSave: true,
                notificacoes: true,
                ultimaAtualizacao: new Date().toISOString()
            };
            
            return config ? { ...padrao, ...JSON.parse(config) } : padrao;
        } catch (erro) {
            console.error('Erro ao carregar configurações:', erro);
            return this.configPadrao();
        }
    }
    
    configPadrao() {
        return {
            tema: 'claro',
            tamanhoFonte: 'medio',
            autoSave: true,
            notificacoes: true,
            ultimaAtualizacao: new Date().toISOString()
        };
    }
    
    salvarConfiguracoes() {
        try {
            this.configuracoes.ultimaAtualizacao = new Date().toISOString();
            localStorage.setItem(this.chaveConfig, JSON.stringify(this.configuracoes));
        } catch (erro) {
            console.error('Erro ao salvar configurações:', erro);
        }
    }
    
    obterMensagensBiblicas() {
        const mensagens = [
            {
                texto: "Deus ouve cada palavra do seu coração. 'Clamam os justos, e o SENHOR os ouve.' - Salmos 34:17",
                categoria: "conforto",
                cor: "#3498db"
            },
            {
                texto: "Seu desabafo foi ouvido. Deus está contigo. 'Não temas, porque eu sou contigo.' - Isaías 41:10",
                categoria: "encorajamento",
                cor: "#2ecc71"
            },
            {
                texto: "Deus conhece cada detalhe do seu coração. 'Antes que haja uma palavra na minha língua, tu já a conheces toda, ó SENHOR.' - Salmos 139:4",
                categoria: "conforto",
                cor: "#3498db"
            },
            {
                texto: "A sua oração subiu como incenso agradável a Deus. 'Suba a minha oração, como incenso, diante de ti.' - Salmos 141:2",
                categoria: "adoração",
                cor: "#9b59b6"
            },
            {
                texto: "Deus guarda suas palavras no seu coração. 'Eis que estás gravada na palma das minhas mãos.' - Isaías 49:16",
                categoria: "amor",
                cor: "#e74c3c"
            },
            {
                texto: "A paz de Deus guarda seu coração. 'E a paz de Deus, que excede todo o entendimento, guardará os vossos corações.' - Filipenses 4:7",
                categoria: "paz",
                cor: "#1abc9c"
            },
            {
                texto: "Deus transforma suas preocupações em orações respondidas. 'Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.' - 1 Pedro 5:7",
                categoria: "esperança",
                cor: "#f39c12"
            },
            {
                texto: "Sua fé move o coração de Deus. 'Tudo é possível ao que crê.' - Marcos 9:23",
                categoria: "fé",
                cor: "#34495e"
            },
            {
                texto: "Deus renova suas forças através da oração. 'Os que esperam no SENHOR renovarão as suas forças.' - Isaías 40:31",
                categoria: "força",
                cor: "#27ae60"
            },
            {
                texto: "Cada lágrima sua é contada por Deus. 'Põe as minhas lágrimas no teu odre; não estão elas no teu livro?' - Salmos 56:8",
                categoria: "conforto",
                cor: "#3498db"
            }
        ];
        
        // Filtra por categoria se necessário
        if (this.configuracoes.categoriaPreferida) {
            return mensagens.filter(m => m.categoria === this.configuracoes.categoriaPreferida);
        }
        
        return mensagens;
    }
    
    salvarOracao() {
        if (!this.textareaOracao) return;
        
        const texto = this.textareaOracao.value.trim();
        
        if (!texto) {
            this.mostrarToast('Por favor, escreva sua oração antes de salvar.', 'warning');
            this.textareaOracao.focus();
            return;
        }
        
        const oracao = {
            id: Date.now(),
            texto: texto,
            data: new Date().toISOString(),
            dataFormatada: new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            versiculo: this.obterVersiculoAleatorio(),
            sentimento: this.analisarSentimento(texto),
            tags: this.extrairTags(texto),
            palavraCount: texto.split(/\s+/).length
        };
        
        this.orações.unshift(oracao);
        this.salvarOracoes();
        this.limparRascunho();
        this.mostrarMensagemBiblica(oracao.versiculo);
        this.atualizarInterface();
        this.limparTextarea();
        
        // Feedback visual
        this.animarBotao(this.btnSalvar, '<i class="fas fa-check"></i> Salvo!', 'success');
        
        // Adicionar ao histórico visual
        this.adicionarAoHistoricoVisual(oracao);
        
        // Mostrar estatísticas
        setTimeout(() => {
            this.mostrarEstatisticas();
        }, 1000);
    }
    
    obterVersiculoAleatorio() {
        const versiculos = [
            "Salmos 34:17", "Isaías 41:10", "Salmos 139:4", "Salmos 141:2",
            "Isaías 49:16", "Filipenses 4:7", "1 Pedro 5:7", "Marcos 9:23",
            "Isaías 40:31", "Salmos 56:8", "Jeremias 29:11", "Romanos 8:28",
            "Mateus 11:28", "João 14:27", "Filipenses 4:13", "2 Coríntios 12:9"
        ];
        return versiculos[Math.floor(Math.random() * versiculos.length)];
    }
    
    analisarSentimento(texto) {
        const palavrasPositivas = ['graças', 'obrigad', 'alegr', 'bênção', 'amor', 'paz', 'fé', 'esperança', 'feliz', 'louvor'];
        const palavrasNegativas = ['triste', 'difícil', 'problema', 'dor', 'sofri', 'preocupa', 'medo', 'angústia'];
        
        let score = 0;
        const textoLower = texto.toLowerCase();
        
        palavrasPositivas.forEach(palavra => {
            if (textoLower.includes(palavra)) score++;
        });
        
        palavrasNegativas.forEach(palavra => {
            if (textoLower.includes(palavra)) score--;
        });
        
        if (score > 1) return 'positivo';
        if (score < -1) return 'negativo';
        return 'neutro';
    }
    
    extrairTags(texto) {
        const tagsComuns = ['agradecimento', 'pedido', 'desabafo', 'louvor', 'intercessão', 'confissão', 'meditação'];
        const tags = [];
        const textoLower = texto.toLowerCase();
        
        tagsComuns.forEach(tag => {
            if (textoLower.includes(tag)) {
                tags.push(tag);
            }
        });
        
        // Limita a 3 tags
        return tags.slice(0, 3);
    }
    
    limparOracao() {
        if (!this.textareaOracao) return;
        
        const texto = this.textareaOracao.value.trim();
        if (texto && !confirm('Tem certeza que deseja limpar sua oração? Esta ação não pode ser desfeita.')) {
            return;
        }
        
        this.textareaOracao.value = '';
        this.limparRascunho();
        this.atualizarContadorCaracteres();
        
        // Feedback visual
        this.animarBotao(this.btnLimpar, '<i class="fas fa-check"></i> Limpo!', 'info');
    }
    
    salvarRascunho() {
        if (!this.textareaOracao || !this.configuracoes.autoSave) return;
        const texto = this.textareaOracao.value;
        localStorage.setItem(this.chaveRascunho, texto);
    }
    
    carregarRascunho() {
        if (!this.textareaOracao) return;
        const rascunho = localStorage.getItem(this.chaveRascunho);
        if (rascunho) {
            this.textareaOracao.value = rascunho;
            this.atualizarContadorCaracteres();
        }
    }
    
    limparRascunho() {
        localStorage.removeItem(this.chaveRascunho);
    }
    
    salvarOracoes() {
        try {
            // Limitar a 1000 orações para evitar storage overflow
            if (this.orações.length > 1000) {
                this.orações = this.orações.slice(0, 1000);
            }
            
            localStorage.setItem(this.chaveStorage, JSON.stringify(this.orações));
            
            // Backup automático a cada 10 orações
            if (this.orações.length % 10 === 0) {
                this.criarBackup();
            }
        } catch (erro) {
            console.error('Erro ao salvar orações:', erro);
            this.mostrarToast('Erro ao salvar. Tente novamente.', 'error');
        }
    }
    
    criarBackup() {
        try {
            const backup = {
                data: new Date().toISOString(),
                total: this.orações.length,
                oracoes: this.orações
            };
            
            localStorage.setItem(`${this.chaveStorage}-backup-${Date.now()}`, JSON.stringify(backup));
            
            // Manter apenas os 5 backups mais recentes
            const backupKeys = Object.keys(localStorage).filter(key => key.startsWith(`${this.chaveStorage}-backup-`));
            if (backupKeys.length > 5) {
                backupKeys.sort().slice(0, -5).forEach(key => localStorage.removeItem(key));
            }
        } catch (erro) {
            console.error('Erro ao criar backup:', erro);
        }
    }
    
    carregarOracoes() {
        try {
            const oracoesSalvas = localStorage.getItem(this.chaveStorage);
            if (oracoesSalvas) {
                return JSON.parse(oracoesSalvas);
            }
            
            // Tentar carregar do backup se não houver dados principais
            const backupKeys = Object.keys(localStorage).filter(key => key.startsWith(`${this.chaveStorage}-backup-`));
            if (backupKeys.length > 0) {
                const latestBackup = backupKeys.sort().pop();
                const backupData = JSON.parse(localStorage.getItem(latestBackup));
                return backupData.oracoes || [];
            }
            
            return [];
        } catch (erro) {
            console.error('Erro ao carregar orações:', erro);
            return [];
        }
    }
    
    mostrarMensagemBiblica(versiculo) {
        if (!this.mensagemBiblica) return;
        
        const mensagens = this.obterMensagensBiblicas();
        const mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
        
        this.mensagemBiblica.innerHTML = `
            <div class="mensagem-conteudo">
                <i class="fas fa-quote-left" style="color: ${mensagemAleatoria.cor}"></i>
                <p>${mensagemAleatoria.texto}</p>
                <div class="mensagem-meta">
                    <span class="versiculo"><i class="fas fa-book-bible"></i> ${versiculo}</span>
                    <span class="categoria" style="background: ${mensagemAleatoria.cor}20; color: ${mensagemAleatoria.cor}">
                        ${mensagemAleatoria.categoria}
                    </span>
                </div>
            </div>
        `;
        
        this.mensagemBiblica.classList.add('mostrar');
        
        // Ocultar após tempo configurado
        setTimeout(() => {
            if (this.mensagemBiblica.classList.contains('mostrar')) {
                this.mensagemBiblica.classList.remove('mostrar');
            }
        }, 15000);
    }
    
    atualizarInterface() {
        this.atualizarContadorOracoes();
        this.atualizarContadorCaracteres();
        this.atualizarEstatisticasRapidas();
    }
    
    atualizarContadorOracoes() {
        let contador = document.getElementById('contador-oracoes');
        if (!contador) {
            contador = document.createElement('div');
            contador.id = 'contador-oracoes';
            contador.className = 'contador-oracoes';
            this.container?.prepend(contador);
        }
        
        const total = this.orações.length;
        const hoje = this.orações.filter(o => 
            new Date(o.data).toDateString() === new Date().toDateString()
        ).length;
        
        contador.innerHTML = `
            <div class="contador-stats">
                <span class="stat">
                    <i class="fas fa-pray"></i>
                    <strong>${total}</strong>
                    <small>orações totais</small>
                </span>
                <span class="stat">
                    <i class="fas fa-calendar-day"></i>
                    <strong>${hoje}</strong>
                    <small>hoje</small>
                </span>
            </div>
        `;
    }
    
    atualizarContadorCaracteres() {
        if (!this.textareaOracao) return;
        
        let contador = document.getElementById('contador-caracteres');
        if (!contador) {
            contador = document.createElement('div');
            contador.id = 'contador-caracteres';
            contador.className = 'contador-caracteres';
            this.textareaOracao?.parentNode?.insertBefore(contador, this.textareaOracao.nextSibling);
        }
        
        const texto = this.textareaOracao.value;
        const caracteres = texto.length;
        const palavras = texto.trim() ? texto.split(/\s+/).length : 0;
        
        let nivel = 'normal';
        if (caracteres > 1000) nivel = 'longo';
        if (caracteres > 2000) nivel = 'muito-longo';
        
        contador.innerHTML = `
            <span class="caracteres ${nivel}">${caracteres} caracteres</span>
            <span class="palavras">${palavras} palavras</span>
        `;
    }
    
    atualizarEstatisticasRapidas() {
        let stats = document.getElementById('estatisticas-rapidas');
        if (!stats && this.orações.length > 0) {
            stats = document.createElement('div');
            stats.id = 'estatisticas-rapidas';
            stats.className = 'estatisticas-rapidas';
            this.container?.appendChild(stats);
        }
        
        if (stats && this.orações.length > 0) {
            const sentimentos = this.orações.reduce((acc, o) => {
                acc[o.sentimento] = (acc[o.sentimento] || 0) + 1;
                return acc;
            }, {});
            
            const maisRecente = this.orações[0];
            
            stats.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-item">
                        <i class="fas fa-heart" style="color: #e74c3c"></i>
                        <span>${sentimentos.positivo || 0} positivas</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-cloud" style="color: #95a5a6"></i>
                        <span>${sentimentos.neutro || 0} neutras</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-cloud-rain" style="color: #3498db"></i>
                        <span>${sentimentos.negativo || 0} difíceis</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-clock"></i>
                        <span>Última: ${new Date(maisRecente.data).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                </div>
            `;
        }
    }
    
    animarBotao(botao, texto, tipo) {
        if (!botao) return;
        
        const originalHTML = botao.innerHTML;
        const originalClass = botao.className;
        
        botao.innerHTML = texto;
        botao.className = `${originalClass} btn-${tipo}`;
        botao.disabled = true;
        
        setTimeout(() => {
            botao.innerHTML = originalHTML;
            botao.className = originalClass;
            botao.disabled = false;
        }, 2000);
    }
    
    limparTextarea() {
        if (this.textareaOracao) {
            this.textareaOracao.value = '';
            this.atualizarContadorCaracteres();
        }
    }
    
    adicionarElementosUI() {
        this.adicionarPainelControle();
        this.adicionarCSS();
    }
    
    adicionarPainelControle() {
        const painel = document.createElement('div');
        painel.className = 'diario-painel-controle';
        painel.innerHTML = `
            <div class="painel-header">
                <h4><i class="fas fa-cog"></i> Configurações do Diário</h4>
            </div>
            <div class="painel-conteudo">
                <div class="config-item">
                    <label>
                        <input type="checkbox" ${this.configuracoes.autoSave ? 'checked' : ''} 
                               id="auto-save"> Auto-save
                    </label>
                    <small>Salva automaticamente seu rascunho</small>
                </div>
                <div class="config-item">
                    <label>Tema:</label>
                    <select id="tema-diario">
                        <option value="claro" ${this.configuracoes.tema === 'claro' ? 'selected' : ''}>Claro</option>
                        <option value="escuro" ${this.configuracoes.tema === 'escuro' ? 'selected' : ''}>Escuro</option>
                        <option value="conforto" ${this.configuracoes.tema === 'conforto' ? 'selected' : ''}>Conforto</option>
                    </select>
                </div>
                <div class="painel-acoes">
                    <button class="btn-pequeno" id="btn-exportar">
                        <i class="fas fa-download"></i> Exportar
                    </button>
                    <button class="btn-pequeno" id="btn-estatisticas">
                        <i class="fas fa-chart-bar"></i> Estatísticas
                    </button>
                </div>
            </div>
        `;
        
        this.container?.appendChild(painel);
        
        // Event listeners do painel
        document.getElementById('auto-save')?.addEventListener('change', (e) => {
            this.configuracoes.autoSave = e.target.checked;
            this.salvarConfiguracoes();
        });
        
        document.getElementById('tema-diario')?.addEventListener('change', (e) => {
            this.configuracoes.tema = e.target.value;
            this.salvarConfiguracoes();
            this.aplicarTema();
            
            // Disparar evento para outros componentes
            document.dispatchEvent(new CustomEvent('diarioTemaAlterado', {
                detail: { tema: e.target.value }
            }));
        });
        
        document.getElementById('btn-exportar')?.addEventListener('click', () => {
            this.exportarOracoes();
        });
        
        document.getElementById('btn-estatisticas')?.addEventListener('click', () => {
            this.mostrarEstatisticas();
        });
    }
    
    aplicarTema() {
        const tema = this.configuracoes.tema;
        document.body.classList.remove('diario-tema-claro', 'diario-tema-escuro', 'diario-tema-conforto');
        document.body.classList.add(`diario-tema-${tema}`);
    }
    
    adicionarCSS() {
        const styleId = 'diario-estilos-aprimorados';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .diario-tema-claro {
                --diario-bg: #ffffff;
                --diario-text: #333333;
                --diario-border: #e0e0e0;
                --diario-primary: #3498db;
            }
            
            .diario-tema-escuro {
                --diario-bg: #1a1a1a;
                --diario-text: #f0f0f0;
                --diario-border: #444444;
                --diario-primary: #2980b9;
            }
            
            .diario-tema-conforto {
                --diario-bg: #f9f3e9;
                --diario-text: #5a4a42;
                --diario-border: #d4c4b5;
                --diario-primary: #8b4513;
            }
            
            .contador-oracoes {
                background: var(--diario-bg);
                border: 1px solid var(--diario-border);
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            
            .contador-stats {
                display: flex;
                gap: 20px;
                justify-content: center;
            }
            
            .contador-stats .stat {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 10px 15px;
                background: linear-gradient(135deg, var(--diario-primary)20, transparent);
                border-radius: 8px;
                min-width: 100px;
            }
            
            .contador-stats .stat i {
                font-size: 1.5rem;
                margin-bottom: 5px;
                color: var(--diario-primary);
            }
            
            .contador-stats .stat strong {
                font-size: 1.8rem;
                color: var(--diario-text);
            }
            
            .contador-stats .stat small {
                font-size: 0.8rem;
                color: #666;
            }
            
            .contador-caracteres {
                display: flex;
                justify-content: space-between;
                margin-top: 8px;
                font-size: 0.85rem;
                color: #666;
                padding: 0 5px;
            }
            
            .caracteres.longo { color: #f39c12; }
            .caracteres.muito-longo { color: #e74c3c; }
            
            .estatisticas-rapidas {
                background: var(--diario-bg);
                border: 1px solid var(--diario-border);
                border-radius: 10px;
                padding: 15px;
                margin-top: 20px;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                gap: 10px;
            }
            
            .stat-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px;
                background: rgba(0,0,0,0.02);
                border-radius: 6px;
            }
            
            .diario-painel-controle {
                background: var(--diario-bg);
                border: 1px solid var(--diario-border);
                border-radius: 10px;
                padding: 20px;
                margin-top: 25px;
            }
            
            .painel-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid var(--diario-border);
            }
            
            .painel-conteudo {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .config-item {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .config-item label {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 500;
                color: var(--diario-text);
            }
            
            .config-item small {
                color: #666;
                font-size: 0.85rem;
                margin-left: 26px;
            }
            
            .painel-acoes {
                display: flex;
                gap: 10px;
                margin-top: 10px;
            }
            
            .btn-pequeno {
                padding: 8px 16px;
                background: var(--diario-primary);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.3s;
            }
            
            .btn-pequeno:hover {
                opacity: 0.9;
                transform: translateY(-1px);
            }
            
            .mensagem-conteudo {
                padding: 15px;
                background: linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(155, 89, 182, 0.1));
                border-radius: 10px;
                border-left: 4px solid var(--diario-primary);
            }
            
            .mensagem-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid rgba(0,0,0,0.1);
            }
            
            .versiculo {
                font-size: 0.9rem;
                color: #666;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .categoria {
                padding: 3px 10px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 500;
            }
            
            #texto-oracao {
                transition: all 0.3s;
                border-color: var(--diario-border);
                background: var(--diario-bg);
                color: var(--diario-text);
            }
            
            #texto-oracao:focus {
                border-color: var(--diario-primary);
                box-shadow: 0 0 0 3px var(--diario-primary)20;
            }
            
            @media (max-width: 768px) {
                .contador-stats {
                    flex-direction: column;
                    gap: 10px;
                }
                
                .stats-grid {
                    grid-template-columns: 1fr 1fr;
                }
                
                .painel-acoes {
                    flex-direction: column;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    mostrarToast(mensagem, tipo = 'info') {
        const toast = document.createElement('div');
        toast.className = `diario-toast diario-toast-${tipo}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(tipo)}"></i>
                <span>${mensagem}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        document.body.appendChild(toast);
        
        // Estilos dinâmicos
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${this.getToastColor(tipo)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            animation: toastSlideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'toastSlideOut 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
        
        // Adicionar animação CSS
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            @keyframes toastSlideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes toastSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(animationStyle);
        
        setTimeout(() => animationStyle.remove(), 6000);
    }
    
    getToastIcon(tipo) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[tipo] || 'info-circle';
    }
    
    getToastColor(tipo) {
        const colors = {
            'success': '#27ae60',
            'error': '#e74c3c',
            'warning': '#f39c12',
            'info': '#3498db'
        };
        return colors[tipo] || '#3498db';
    }
    
    mostrarEstatisticas() {
        const modal = document.createElement('div');
        modal.className = 'diario-modal';
        modal.innerHTML = `
            <div class="modal-conteudo">
                <button class="modal-fechar">&times;</button>
                <h3><i class="fas fa-chart-bar"></i> Estatísticas do Seu Diário</h3>
                
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-numero">${this.orações.length}</div>
                        <div class="stat-label">Orações Totais</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-numero">${this.calcularPalavrasTotais()}</div>
                        <div class="stat-label">Palavras Escritas</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-numero">${this.calcularMediaPalavras()}</div>
                        <div class="stat-label">Média por Oração</div>
                    </div>
                </div>
                
                <div class="timeline">
                    <h4>Suas Oração Recentes</h4>
                    ${this.gerarTimeline()}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        modal.querySelector('.modal-fechar').addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = '';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        });
    }
    
    calcularPalavrasTotais() {
        return this.orações.reduce((total, oracao) => 
            total + (oracao.palavraCount || oracao.texto.split(/\s+/).length), 0
        );
    }
    
    calcularMediaPalavras() {
        if (this.orações.length === 0) return 0;
        return Math.round(this.calcularPalavrasTotais() / this.orações.length);
    }
    
    gerarTimeline() {
        const recentes = this.orações.slice(0, 5);
        if (recentes.length === 0) return '<p class="sem-dados">Ainda não há orações registradas.</p>';
        
        return recentes.map(oracao => `
            <div class="timeline-item">
                <div class="timeline-data">${oracao.dataFormatada}</div>
                <div class="timeline-texto">${oracao.texto.substring(0, 100)}${oracao.texto.length > 100 ? '...' : ''}</div>
                <div class="timeline-tags">
                    ${(oracao.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }
    
    adicionarAoHistoricoVisual(oracao) {
        const historico = document.getElementById('historico-visual');
        if (!historico && this.container) {
            const novoHistorico = document.createElement('div');
            novoHistorico.id = 'historico-visual';
            novoHistorico.className = 'historico-visual';
            novoHistorico.innerHTML = `
                <h4><i class="fas fa-history"></i> Suas Oração Recentes</h4>
                <div class="historico-lista"></div>
            `;
            this.container.appendChild(novoHistorico);
        }
        
        const lista = document.querySelector('.historico-lista');
        if (lista) {
            const item = document.createElement('div');
            item.className = 'historico-item';
            item.innerHTML = `
                <div class="historico-header">
                    <span class="historico-data">${oracao.dataFormatada}</span>
                    <span class="historico-sentimento ${oracao.sentimento}">${oracao.sentimento}</span>
                </div>
                <div class="historico-texto">${oracao.texto.substring(0, 80)}${oracao.texto.length > 80 ? '...' : ''}</div>
                <div class="historico-acoes">
                    <button class="btn-ver-mais" data-id="${oracao.id}">Ver completa</button>
                </div>
            `;
            lista.prepend(item);
            
            // Limitar a 5 itens
            const items = lista.querySelectorAll('.historico-item');
            if (items.length > 5) {
                items[5].remove();
            }
        }
    }
    
    iniciarPlaceholderDinamico() {
        if (!this.textareaOracao) return;
        
        const placeholders = [
            "O que está no seu coração hoje? Deus está ouvindo...",
            "Compartilhe suas alegrias, preocupações, sonhos...",
            "Este é seu espaço sagrado para conversar com Deus...",
            "Deus conhece cada pensamento, mas ama ouvir sua voz...",
            "Desabafe, agradeça, louve, peça... Ele está aqui...",
            "Sua oração é um presente para Deus. Escreva com amor...",
            "Cada palavra sua é importante para o Pai celestial..."
        ];
        
        let indice = 0;
        
        setInterval(() => {
            if (!document.activeElement || document.activeElement !== this.textareaOracao) {
                this.textareaOracao.placeholder = placeholders[indice];
                indice = (indice + 1) % placeholders.length;
            }
        }, 4000);
    }
    
    exportarOracoes() {
        try {
            const dados = {
                diario: "Diário Espiritual de Eunice - Presente de Natal",
                versao: "2.0",
                dataExportacao: new Date().toISOString(),
                totalOracoes: this.orações.length,
                palavrasTotais: this.calcularPalavrasTotais(),
                oracoes: this.orações
            };
            
            const blob = new Blob([JSON.stringify(dados, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `diario-espiritual-eunice-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            
            setTimeout(() => URL.revokeObjectURL(url), 100);
            
            this.mostrarToast('Diário exportado com sucesso!', 'success');
        } catch (erro) {
            console.error('Erro ao exportar:', erro);
            this.mostrarToast('Erro ao exportar diário.', 'error');
        }
    }
    
    // Métodos públicos para acesso externo
    getTotalOracoes() {
        return this.orações.length;
    }
    
    getOracoesRecentes(quantidade = 5) {
        return this.orações.slice(0, quantidade);
    }
    
    getEstatisticas() {
        return {
            total: this.orações.length,
            palavras: this.calcularPalavrasTotais(),
            mediaPalavras: this.calcularMediaPalavras(),
            hoje: this.orações.filter(o => 
                new Date(o.data).toDateString() === new Date().toDateString()
            ).length,
            sentimentos: this.orações.reduce((acc, o) => {
                acc[o.sentimento] = (acc[o.sentimento] || 0) + 1;
                return acc;
            }, {})
        };
    }
}

// Inicialização suave
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se já existe uma instância
    if (!window.diarioEspiritual) {
        window.diarioEspiritual = new DiarioEspiritual();
    }
    
    // Adicionar mensagem de privacidade
    setTimeout(() => {
        const container = document.querySelector('.oracao-container');
        if (container && !container.querySelector('.privacidade-nota')) {
            const nota = document.createElement('div');
            nota.className = 'privacidade-nota';
            nota.innerHTML = `
                <p><i class="fas fa-lock"></i> <strong>100% Privado:</strong> 
                Todas as suas orações são salvas apenas no seu dispositivo. 
                Ninguém mais tem acesso a este conteúdo sagrado.</p>
            `;
            container.appendChild(nota);
        }
    }, 1000);
});

// API pública para integração com outros módulos
window.DiarioAPI = {
    getInstance: () => window.diarioEspiritual,
    getStats: () => window.diarioEspiritual?.getEstatisticas() || {},
    savePrayer: (texto) => {
        if (window.diarioEspiritual && texto) {
            // Simula uma oração sendo salva
            const tempTextarea = document.createElement('textarea');
            document.body.appendChild(tempTextarea);
            tempTextarea.value = texto;
            window.diarioEspiritual.textareaOracao = tempTextarea;
            window.diarioEspiritual.salvarOracao();
            document.body.removeChild(tempTextarea);
            return true;
        }
        return false;
    }
};