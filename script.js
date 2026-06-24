/* ==========================================
   Agência de Negócio Dossantos Lda.
   JavaScript — script.js
   ========================================== */

// ===== NAVBAR: scroll & mobile =====

const navbar     = document.getElementById('navbar');
const navToggle  = document.getElementById('navToggle');
const navMenu    = document.getElementById('navMenu');

// Adiciona classe "scrolled" quando o utilizador desce a página
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Botão "Voltar ao topo"
  const backBtn = document.getElementById('backToTop');
  if (window.scrollY > 400) {
    backBtn.classList.add('visible');
  } else {
    backBtn.classList.remove('visible');
  }
});

// Abre/fecha menu mobile
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
});

// Fecha menu ao clicar num link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
  });
});

// Fecha menu ao clicar fora
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navMenu.classList.remove('open');
  }
});

// ===== SMOOTH SCROLL para links âncora =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80; // altura da navbar
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== BOTÃO VOLTAR AO TOPO =====
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== ANIMAÇÃO DE REVELAÇÃO (scroll) =====
// Adiciona classe "reveal" a elementos que queremos animar
const revealTargets = [
  '.sobre-grid',
  '.servico-card',
  '.membro-card',
  '.localizacao-grid',
  '.contacto-grid',
  '.hero-stats',
];

revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('reveal');
  });
});

// Intersection Observer para disparar animação
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Delay escalonado para cards
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ===== VALIDAÇÃO DO FORMULÁRIO =====

const form        = document.getElementById('contactoForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submitBtn');
const novaMsgBtn  = document.getElementById('novaMsg');

/**
 * Valida um campo individual.
 * Retorna true se válido, false se inválido.
 */
function validateField(id, errorId, validationFn, errorMsg) {
  const field = document.getElementById(id);
  const errorEl = document.getElementById(errorId);
  if (!errorEl) return true;

  if (!validationFn(field.value.trim())) {
    errorEl.textContent = errorMsg;
    field.closest('.input-wrap').style.borderColor = '';
    field.style.borderColor = '#EF4444';
    return false;
  } else {
    errorEl.textContent = '';
    field.style.borderColor = '#22C55E';
    return true;
  }
}

/**
 * Valida todos os campos do formulário.
 * Retorna true se tudo estiver correto.
 */
function validateForm() {
  let valid = true;

  // Nome: mínimo 3 caracteres
  if (!validateField(
    'nome', 'nome-error',
    v => v.length >= 3,
    'Por favor, insira o seu nome completo (mínimo 3 caracteres).'
  )) valid = false;

  // Email: formato válido
  if (!validateField(
    'email', 'email-error',
    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    'Por favor, insira um endereço de email válido.'
  )) valid = false;

  // Assunto: deve ser selecionado
  if (!validateField(
    'assunto', 'assunto-error',
    v => v !== '',
    'Por favor, selecione um assunto.'
  )) valid = false;

  // Mensagem: mínimo 10 caracteres
  if (!validateField(
    'mensagem', 'mensagem-error',
    v => v.length >= 10,
    'A mensagem deve ter pelo menos 10 caracteres.'
  )) valid = false;

  return valid;
}

// Validação em tempo real (ao perder o foco)
document.getElementById('nome').addEventListener('blur', () => {
  validateField('nome', 'nome-error', v => v.length >= 3, 'Por favor, insira o seu nome completo (mínimo 3 caracteres).');
});
document.getElementById('email').addEventListener('blur', () => {
  validateField('email', 'email-error', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Por favor, insira um endereço de email válido.');
});
document.getElementById('assunto').addEventListener('change', () => {
  validateField('assunto', 'assunto-error', v => v !== '', 'Por favor, selecione um assunto.');
});
document.getElementById('mensagem').addEventListener('blur', () => {
  validateField('mensagem', 'mensagem-error', v => v.length >= 10, 'A mensagem deve ter pelo menos 10 caracteres.');
});

// Submissão do formulário
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  // Simular envio: mostrar estado de carregamento
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A enviar...';

  // Simular delay de rede (1.5s) e mostrar sucesso
  setTimeout(() => {
    form.style.display = 'none';
    formSuccess.classList.add('show');
    // Scroll suave para a mensagem de sucesso
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1500);
});

// Botão "Enviar outra mensagem"
novaMsgBtn.addEventListener('click', () => {
  form.reset();
  form.style.display = 'flex';
  formSuccess.classList.remove('show');

  // Repõe estilos dos campos
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.style.borderColor = '';
  });
  form.querySelectorAll('.form-error').forEach(el => {
    el.textContent = '';
  });

  // Repõe botão
  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Enviar Mensagem</span>';
});

// ===== ACTIVE NAV LINK (highlight ao fazer scroll) =====
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// Estilo do link ativo
const styleEl = document.createElement('style');
styleEl.textContent = `
  .nav-link.active {
    color: #ffffff !important;
    background: rgba(37,99,235,0.25) !important;
  }
`;
document.head.appendChild(styleEl);