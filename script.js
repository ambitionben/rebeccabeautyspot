// Plain email booking + Lightbox + silky reveals & CTA shimmer

const BUSINESS_EMAIL = "therebeccabelizairebeautyspot@gmail.com";

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('show');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Year in footer (optional if you add a year span)
// const yearEl = document.getElementById('year');
// if (yearEl) yearEl.textContent = new Date().getFullYear();

// Copy email button
document.getElementById('copy-email')?.addEventListener('click', async () => {
  const email = document.getElementById('biz-email').textContent.trim();
  try {
    await navigator.clipboard.writeText(email);
    flashStatus('Email copied to clipboard.');
  } catch {
    flashStatus('Could not copy. Long-press to copy.', false);
  }
});

// Booking form → mailto
const form = document.getElementById('booking-form');
const statusEl = document.getElementById('form-status');

function flashStatus(msg, ok = true) {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.style.color = ok ? '#ffe9a6' : '#ff98b0';
  setTimeout(() => (statusEl.textContent = ''), 3500);
}

function collectFormData(formEl) {
  const data = Object.fromEntries(new FormData(formEl).entries());
  const addons = [...formEl.querySelectorAll('input[name="addons"]:checked')].map(cb => cb.value);
  data.addons = addons.join(', ');
  return data;
}

function openMailto(payload) {
  const subject = encodeURIComponent(`Booking Request — ${payload.name}`);
  const body = encodeURIComponent(
    `Hello Rebecca,\n\nI'd like to book an appointment.\n\n` +
    `Name: ${payload.name}\n` +
    `Email: ${payload.email}\n` +
    `Preferred Date: ${payload.date}\n` +
    `Preferred Time: ${payload.time}\n` +
    `Service: ${payload.service}\n` +
    `Add-ons: ${payload.addons || 'None'}\n` +
    `Notes: ${payload.notes || '—'}\n\nThank you!`
  );
  const href = `mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${body}`;
  window.location.href = href;
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = collectFormData(form);
  if (!data.name || !data.email || !data.date || !data.time || !data.service) {
    flashStatus('Please fill in all required fields.', false);
    return;
  }
  openMailto(data);
});

// --------- Lightbox (click image to open) ---------
const lb = document.getElementById('lightbox');
const lbImg = lb?.querySelector('img');
const lbCap = lb?.querySelector('.lightbox-caption');
const lbClose = lb?.querySelector('.lightbox-close');

function openLightbox(src, alt) {
  if (!lb || !lbImg) return;
  lbImg.src = src;
  lbImg.alt = alt || '';
  if (lbCap) lbCap.textContent = alt || '';
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
}
function closeLightbox() {
  if (!lb || !lbImg) return;
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  lbImg.src = '';
}
document.querySelectorAll('.gallery-img').forEach(img => {
  img.addEventListener('click', () => openLightbox(img.src, img.alt));
});
lbClose?.addEventListener('click', closeLightbox);
lb?.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb?.classList.contains('open')) closeLightbox(); });

// ===== Elegance reveal on load & scroll (silkier timing) =====
window.addEventListener('load', () => {
  document.body.classList.add('page-in');
});

// Mark elements to reveal
const revealTargets = [
  ...document.querySelectorAll('.card'),
  ...document.querySelectorAll('.gallery-img'),
  ...document.querySelectorAll('#booking .form'),
  ...document.querySelectorAll('.quick-contact'),
  ...document.querySelectorAll('.section-title'),
  ...document.querySelectorAll('.price-list li'),
  ...document.querySelectorAll('.cta.shimmer-target')
];

// Add base reveal + stagger
revealTargets.forEach((el, i) => {
  el.classList.add('reveal');
  const mod = (i % 5);
  if (mod) el.classList.add(`stagger-${mod}`);
});

// Observe and reveal as elements enter the viewport
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');

      // One-time CTA shimmer when it first appears
      if (entry.target.classList.contains('shimmer-target')) {
        entry.target.classList.add('shimmer');
        setTimeout(() => entry.target.classList.remove('shimmer'), 900);
      }
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealTargets.forEach(el => io.observe(el));
