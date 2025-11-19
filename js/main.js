// Menu Mobile Responsivo
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Alternar estado do menu
            this.setAttribute('aria-expanded', !isExpanded);
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            body.classList.toggle('menu-open');

            // Focar no primeiro link quando menu abrir
            if (!isExpanded) {
                const firstLink = mainNav.querySelector('a');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 300);
                }
            }
        });

        // Fechar menu ao clicar em um link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });

        // Fechar menu ao pressionar ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                body.classList.remove('menu-open');
                menuToggle.focus();
            }
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') &&
                !mainNav.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }
}

// Sistema de seleção de tipo de cadastro
function initTypeSelector() {
    const typeButtons = document.querySelectorAll('.type-btn');
    const volunteerFields = document.getElementById('volunteerFields');
    const donorFields = document.getElementById('donorFields');
    const ongFields = document.getElementById('ongFields');

    if (typeButtons.length > 0) {
        typeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove classe active de todos os botões
                typeButtons.forEach(btn => btn.classList.remove('active'));

                // Adiciona classe active ao botão clicado
                this.classList.add('active');

                // Esconde todos os campos específicos
                if (volunteerFields) volunteerFields.style.display = 'none';
                if (donorFields) donorFields.style.display = 'none';
                if (ongFields) ongFields.style.display = 'none';

                // Mostra campos específicos baseado no tipo selecionado
                const type = this.getAttribute('data-type');
                switch(type) {
                    case 'volunteer':
                        if (volunteerFields) volunteerFields.style.display = 'block';
                        break;
                    case 'donor':
                        if (donorFields) donorFields.style.display = 'block';
                        break;
                    case 'ong':
                        if (ongFields) ongFields.style.display = 'block';
                        break;
                }
            });
        });
    }
}

// Navegação e funcionalidades gerais
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initTypeSelector();

    // Smooth scroll para links internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header fixo com sombra
    const header = document.querySelector('.main-header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }

        lastScrollY = window.scrollY;
    });

    // Carregamento lazy de imagens
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Feedback de interação para botões
    const buttons = document.querySelectorAll('.btn, .type-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Efeito de ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Adicionar estilos para animação ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});