// Criar efeito de neve
function criarNeve() {
    const neveContainer = document.getElementById('neve');
    if (!neveContainer) return;
    
    const quantidadeFlocos = 50;
    
    for (let i = 0; i < quantidadeFlocos; i++) {
        criarFloco(neveContainer);
    }
}

function criarFloco(container) {
    const floco = document.createElement('div');
    floco.className = 'floco';
    
    // Tamanho aleatório
    const tamanho = Math.random() * 5 + 3;
    floco.style.width = `${tamanho}px`;
    floco.style.height = `${tamanho}px`;
    
    // Posição inicial aleatória
    floco.style.left = `${Math.random() * 100}vw`;
    
    // Duração da animação
    const duracao = Math.random() * 10 + 10;
    floco.style.animationDuration = `${duracao}s`;
    
    // Atraso inicial
    const atraso = Math.random() * 5;
    floco.style.animationDelay = `${atraso}s`;
    
    // Opacidade
    floco.style.opacity = Math.random() * 0.5 + 0.3;
    
    container.appendChild(floco);
    
    // Recriar floco quando a animação terminar
    setTimeout(() => {
        if (floco.parentNode) {
            floco.parentNode.removeChild(floco);
            criarFloco(container);
        }
    }, (duracao + atraso) * 1000);
}

// Criar luzes natalinas
function criarLuzes() {
    const luzesContainer = document.getElementById('luzes');
    if (!luzesContainer) return;
    
    const quantidadeLuzes = 20;
    const cores = ['#FF0000', '#00FF00', '#FFFF00', '#FFA500', '#FF69B4', '#00FFFF'];
    
    for (let i = 0; i < quantidadeLuzes; i++) {
        criarLuz(luzesContainer, cores, i);
    }
}

function criarLuz(container, cores, index) {
    const luz = document.createElement('div');
    luz.className = 'luz';
    
    // Posição
    const posicao = (index / 20) * 100;
    luz.style.left = `${posicao}%`;
    
    // Cor aleatória
    const corIndex = Math.floor(Math.random() * cores.length);
    luz.style.backgroundColor = cores[corIndex];
    
    // Atraso na animação
    const atraso = Math.random() * 2;
    luz.style.animationDelay = `${atraso}s`;
    
    container.appendChild(luz);
}

// Criar estrelas decorativas
function criarEstrelas() {
    const quantidadeEstrelas = 10;
    
    for (let i = 0; i < quantidadeEstrelas; i++) {
        criarEstrela();
    }
}

function criarEstrela() {
    const estrela = document.createElement('div');
    estrela.className = 'estrela';
    estrela.innerHTML = '★';
    
    // Posição aleatória
    estrela.style.top = `${Math.random() * 100}vh`;
    estrela.style.left = `${Math.random() * 100}vw`;
    
    // Tamanho aleatório
    const tamanho = Math.random() * 2 + 1;
    estrela.style.fontSize = `${tamanho}rem`;
    
    // Atraso na animação
    const atraso = Math.random() * 3;
    estrela.style.animationDelay = `${atraso}s`;
    
    document.body.appendChild(estrela);
}

// Efeito de digitação para a dedicatória
function efeitoDigitacao() {
    const texto = document.querySelector('.dedicatoria-texto');
    if (!texto) return;
    
    const conteudo = texto.textContent;
    texto.textContent = '';
    
    let i = 0;
    function digitar() {
        if (i < conteudo.length) {
            texto.textContent += conteudo.charAt(i);
            i++;
            setTimeout(digitar, 20);
        }
    }
    
    // Iniciar após um pequeno delay
    setTimeout(digitar, 1000);
}

// Transições suaves entre seções
function configurarTransicoes() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        section.addEventListener('transitionend', function() {
            if (this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// Efeito de parallax suave
function configurarParallax() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const elementos = document.querySelectorAll('.parallax');
        
        elementos.forEach(elemento => {
            const velocidade = elemento.dataset.velocidade || 0.5;
            const yPos = -(scrolled * velocidade);
            elemento.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Inicializar todas as animações
document.addEventListener('DOMContentLoaded', function() {
    criarNeve();
    criarLuzes();
    criarEstrelas();
    configurarTransicoes();
    configurarParallax();
    
    // Iniciar efeito de digitação após um delay
    setTimeout(efeitoDigitacao, 500);
    
    // Adicionar classe de carregamento concluído
    setTimeout(() => {
        document.body.classList.add('carregado');
    }, 1000);
});