// Theme persistence and toggle
(function(){
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');

  if(saved){
    root.setAttribute('data-theme', saved);
  } else {
    // Respect system preference on first load
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    root.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
  }

  if(toggle){
    toggle.addEventListener('click', ()=>{
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
})();

// Footer year
(function(){
  const y = document.getElementById('year');
  if(y){ y.textContent = new Date().getFullYear(); }
})();

// Smooth scrolling for navigation links
(function(){
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
})();

// Scroll reveal animations
(function(){
  const items = Array.from(document.querySelectorAll('.reveal, .about-card, .timeline-item, .project-card, .contact-card'));

  if(!('IntersectionObserver' in window)){
    items.forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  items.forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });
})();

// Copy email functionality
(function(){
  const btn = document.getElementById('copyEmail');
  const emailCard = document.getElementById('emailCard');

  if(!btn || !emailCard) return;

  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try{
      const email = 'aaronedmccarthy@gmail.com';
      await navigator.clipboard.writeText(email);

      const prev = btn.textContent;
      btn.textContent = '✓';
      btn.style.background = '#00d4aa';

      setTimeout(() => {
        btn.textContent = prev;
        btn.style.background = '';
      }, 1500);
    } catch(_e) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = 'aaronedmccarthy@gmail.com';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      const prev = btn.textContent;
      btn.textContent = '✓';
      setTimeout(() => { btn.textContent = prev; }, 1500);
    }
  });
})();

// Parallax effect for background gradients
(function(){
  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    document.body.style.backgroundPosition = `0 ${rate}px`;
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick);
})();

// Add stagger animation to grid items
(function(){
  const grids = document.querySelectorAll('.about-grid, .projects-grid, .contact-grid');

  grids.forEach(grid => {
    const items = grid.children;
    for(let i = 0; i < items.length; i++) {
      items[i].style.animationDelay = `${i * 0.1}s`;
    }
  });
})();

// Enhanced navbar background on scroll
(function(){
  const nav = document.querySelector('.nav');
  let ticking = false;

  function updateNavbar() {
    const scrolled = window.pageYOffset;
    const intensity = Math.min(1, scrolled / 200);

    const baseGradient = `linear-gradient(135deg,
      rgba(0, 212, 170, ${0.1 + intensity * 0.05}) 0%,
      rgba(121, 40, 202, ${0.1 + intensity * 0.05}) 50%,
      rgba(0, 112, 243, ${0.1 + intensity * 0.05}) 100%)`;

    nav.style.background = baseGradient;
    nav.style.borderColor = `rgba(0, 212, 170, ${0.3 + intensity * 0.2})`;
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick);
})();


