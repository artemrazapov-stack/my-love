const navToggle = document.querySelector('#navToggle');
const nav = document.querySelector('#nav');
const modal = document.querySelector('#modal');
const modalTitle = document.querySelector('#modalTitle');
const modalText = document.querySelector('#modalText');
const modalKicker = document.querySelector('#modalKicker');
const modalPhoto = document.querySelector('#modalPhoto');
const mapCard = document.querySelector('#mapCard');
const cursorGlow = document.querySelector('#cursorGlow');

// Автовставка фотографий по data-img.
// Как пользоваться:
// 1) положи фото в папку images;
// 2) в index.html у карточки напиши data-img="photo.jpg";
// 3) если фото лежит рядом с index.html, скрипт тоже попробует его найти.
function resolveImagePath(fileName) {
  if (!fileName) return '';
  const value = fileName.trim();
  if (/^(https?:|data:|blob:|\.\/|\.\.\/|\/)/i.test(value) || value.includes('/')) {
    return value;
  }
  return `images/${value}`;
}

function makeImage(src, alt) {
  const img = document.createElement('img');
  img.src = resolveImagePath(src);
  img.alt = alt || 'Фото';
  img.loading = 'lazy';

  // Если фото не найдено в папке images, пробуем взять его рядом с index.html.
  img.addEventListener('error', () => {
    if (!src || img.dataset.fallbackUsed === 'true') return;
    if (!src.includes('/') && !/^(https?:|data:|blob:)/i.test(src)) {
      img.dataset.fallbackUsed = 'true';
      img.src = src;
    }
  });

  return img;
}

function fillPhotoSlot(slot, fileName, alt) {
  if (!slot || !fileName) return;
  slot.classList.add('has-photo');
  slot.innerHTML = '';
  slot.appendChild(makeImage(fileName, alt));
}

// Главное фото и другие одиночные слоты
document.querySelectorAll('.photo-slot[data-img]').forEach((slot) => {
  fillPhotoSlot(slot, slot.dataset.img, slot.dataset.alt || 'Фото');
});

// Фото внутри карточек воспоминаний


// Навигация на мобильных
navToggle?.addEventListener('click', () => {
  nav.classList.toggle('is-open');
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => nav.classList.remove('is-open'));
});

// Мягкое появление блоков при прокрутке
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Счётчик дней вместе: поменяй дату на свою при необходимости
const startDate = new Date('2020-06-29T00:00:00');
const daysTogether = document.querySelector('#daysTogether');

if (daysTogether) {
  const now = new Date();
  const diff = now - startDate;
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  animateNumber(daysTogether, days, 1300);
}

function animateNumber(element, target, duration) {
  let start = 0;
  const startTime = performance.now();

  function update(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(start + (target - start) * eased);
    element.textContent = value.toLocaleString('ru-RU');

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Модальное окно для карточек воспоминаний
const memoryCards = document.querySelectorAll('.memory-card');

memoryCards.forEach((card) => {
  const placeholder = card.querySelector('.photo-placeholder');
  fillPhotoSlot(placeholder, card.dataset.img, card.dataset.title || 'Фото');

  card.addEventListener('click', () => {
    openModal({
      kicker: 'воспоминание',
      title: card.dataset.title || 'Момент',
      text: card.dataset.text || 'Здесь будет описание воспоминания.',
      image: card.dataset.img || ''
    });
  });
});

function openModal({ kicker, title, text, image }) {
  modalKicker.textContent = kicker;
  modalTitle.textContent = title;
  modalText.textContent = text;

  if (modalPhoto) {
    if (image) {
      modalPhoto.hidden = false;
      modalPhoto.src = resolveImagePath(image);
      modalPhoto.alt = title || 'Фото';

      modalPhoto.onerror = () => {
        if (!image || modalPhoto.dataset.fallbackUsed === 'true') return;
        if (!image.includes('/') && !/^(https?:|data:|blob:)/i.test(image)) {
          modalPhoto.dataset.fallbackUsed = 'true';
          modalPhoto.src = image;
        }
      };
    } else {
      modalPhoto.hidden = true;
      modalPhoto.removeAttribute('src');
      modalPhoto.alt = '';
    }
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('[data-close="modal"]').forEach((el) => {
  el.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) {
    closeModal();
  }
});

// Карта мест
const mapPins = document.querySelectorAll('.map-pin');

mapPins.forEach((pin) => {
  pin.addEventListener('click', () => {
    const place = pin.dataset.place || 'Место';
    const note = pin.dataset.note || 'Описание воспоминания.';

    mapCard.innerHTML = `
      <span>наша карта</span>
      <h3>${place}</h3>
      <p>${note}</p>
    `;
  });
});

// Капсула будущего
const capsuleBtn = document.querySelector('#capsuleBtn');

capsuleBtn?.addEventListener('click', () => {
  openModal({
    kicker: 'У лукоморья дуб зеленый...',
    title: 'Я с раннего утра жду тебя в месте',
    text: 'Где мои губы впервые коснулись твоих'
  });
});

// Светящийся курсор на десктопе
window.addEventListener('pointermove', (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.opacity = '1';
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

window.addEventListener('pointerleave', () => {
  if (cursorGlow) cursorGlow.style.opacity = '0';
});

// Небольшой пасхальный эффект: печатаем сердечко в консоль
console.log('%c♡ 6 лет — это уже целая вселенная', 'color: #ff7aa8; font-size: 18px; font-weight: bold;');
