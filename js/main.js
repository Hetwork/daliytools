// ===== Clock =====
function updateClock() {
  const now = new Date();

  const timeEl = document.getElementById('clock');
  const dateEl = document.getElementById('clockDate');
  if (!timeEl || !dateEl) return;

  timeEl.textContent = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });

  dateEl.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}
updateClock();
setInterval(updateClock, 1000);

// ===== Theme Toggle =====
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('dt-theme') || 'dark';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('dt-theme', theme);
}

applyTheme(savedTheme);

themeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ===== Filter Tabs =====
const filterTabs = document.querySelectorAll('.filter-tab');
const toolCards = document.querySelectorAll('.tool-card');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;

    toolCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeUp 0.3s ease both';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== Card Click (future navigation) =====
toolCards.forEach(card => {
  card.addEventListener('click', () => {
    const href = card.dataset.href;
    if (href) {
      // placeholder — tools not built yet
      const name = card.querySelector('.tool-name')?.textContent;
      console.log(`Navigating to: ${name}`);
    }
  });
});

// ===== Scroll fade-in for cards =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `fadeUp 0.5s ease ${i * 0.05}s both`;
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

toolCards.forEach(card => observer.observe(card));
