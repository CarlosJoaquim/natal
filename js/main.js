// main.js - Sistema Principal (APENAS NAVEGAÇÃO E CONTROLES BÁSICOS)

// Elementos DOM
const menuLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔮 Inicializando Refúgio Espiritual para Eunice...');
    
    // Navegação entre seções
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Atualiza menu ativo
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Mostra seção correspondente
            const sectionId = this.getAttribute('data-section');
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                    
                    // Disparar evento para outras partes do sistema
                    const event = new CustomEvent('sectionChanged', {
                        detail: { sectionId: sectionId }
                    });
                    document.dispatchEvent(event);
                }
            });
            
            // Scroll suave para o topo da seção
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
    
    // Inicializar controles de áudio
    inicializarAudio();
    
    // Mostrar mensagem inicial
    setTimeout(() => {
        mostrarMensagemBemVindo();
    }, 1000);
});

// Controles de áudio
function inicializarAudio() {
    const audio = document.getElementById('audio-natal');
    const btnPlay = document.getElementById('btn-play');
    const btnPause = document.getElementById('btn-pause');
    const btnVolumeUp = document.getElementById('btn-volume-up');
    const btnVolumeDown = document.getElementById('btn-volume-down');
    
    // Verificar se o áudio está disponível
    if (!audio) {
        console.warn('⚠️ Áudio natalino não encontrado');
        return;
    }
    
    // Configurar volume inicial
    audio.volume = 0.3;
    console.log('🔊 Controles de áudio inicializados');
    
    // Event listeners para controles de áudio
    if (btnPlay) {
        btnPlay.addEventListener('click', () => {
            audio.play().catch(e => console.log("Autoplay bloqueado:", e));
        });
    }
    
    if (btnPause) {
        btnPause.addEventListener('click', () => {
            audio.pause();
        });
    }
    
    if (btnVolumeUp) {
        btnVolumeUp.addEventListener('click', () => {
            if (audio.volume < 1) {
                audio.volume = Math.min(1, audio.volume + 0.1);
                console.log(`🔊 Volume aumentado para: ${Math.round(audio.volume * 100)}%`);
            }
        });
    }
    
    if (btnVolumeDown) {
        btnVolumeDown.addEventListener('click', () => {
            if (audio.volume > 0) {
                audio.volume = Math.max(0, audio.volume - 0.1);
                console.log(`🔊 Volume diminuído para: ${Math.round(audio.volume * 100)}%`);
            }
        });
    }
    
    // Tentar tocar automaticamente (com tratamento de erro)
    setTimeout(() => {
        audio.play().catch(e => {
            console.log("🎵 Autoplay não permitido. O usuário precisa clicar no botão play.");
        });
    }, 2000);
}

// Mensagem de boas-vindas
function mostrarMensagemBemVindo() {
    const welcomeMessages = [
        "🌟 Bem-vinda, Mamã Eunice!",
        "✨ Este é seu refúgio espiritual pessoal.",
        "💙 Criado com amor para você."
    ];
    
    console.log(`
    ${'='.repeat(50)}
    ${welcomeMessages[0]}
    ${welcomeMessages[1]}
    ${welcomeMessages[2]}
    ${'='.repeat(50)}
    `);
    
    // Opcional: Mostrar toast de boas-vindas
    if (window.historiasFe && window.historiasFe.showToast) {
        setTimeout(() => {
            window.historiasFe.showToast('✨ Bem-vinda ao seu Refúgio Espiritual!', 'success');
        }, 1500);
    }
}

// Funções utilitárias
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function criarElemento(tag, classes, texto) {
    const elemento = document.createElement(tag);
    if (classes) elemento.className = classes;
    if (texto) elemento.textContent = texto;
    return elemento;
}

// Exportar funções úteis para outros scripts
if (typeof window !== 'undefined') {
    window.utilidades = {
        formatarData,
        criarElemento
    };
}

console.log('✅ Sistema principal inicializado com sucesso!');