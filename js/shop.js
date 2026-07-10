const CLOTHING_ICONS = ['👘', '👗', '🥻', '👔'];
const FOOD_ICONS = ['🌶️', '🫙', '🥜', '🍌'];
let ci = 0, fi = 0;

function productIcon(cat) {
  return cat === 'clothing' ? CLOTHING_ICONS[ci++ % CLOTHING_ICONS.length] : FOOD_ICONS[fi++ % FOOD_ICONS.length];
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

let allProducts = [];

function renderGrid(products) {
  ci = 0; fi = 0;
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  if (!products.length) {
    grid.innerHTML = '<p class="grid-loading">No products in this category.</p>';
    return;
  }
  products.forEach(p => {
    const card = document.createElement('article');
    card.className = `product-card product-card--${esc(p.category)}`;
    card.innerHTML = `
      <div class="product-card__stripe"></div>
      <div class="product-card__image">
        <img src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" loading="lazy" />
        <div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:3.5rem;background:var(--light-gray)">${productIcon(p.category)}</div>
        ${p.badge ? `<span class="product-card__badge">${esc(p.badge)}</span>` : ''}
      </div>
      <div class="product-card__body">
        <p class="product-card__cat">${p.category === 'clothing' ? 'Clothing' : 'Food & Snacks'}</p>
        <h3 class="product-card__name">${esc(p.name)}</h3>
        <p class="product-card__desc">${esc(p.description)}</p>
        <div class="product-card__footer">
          <span class="product-card__price">${fmt(p.price)}</span>
          <a href="product.html?id=${p.id}" class="btn btn--sm btn--primary">View</a>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    renderGrid(f === 'all' ? allProducts : allProducts.filter(p => p.category === f));
  });
});

// Respect ?filter= URL param
const urlFilter = new URLSearchParams(window.location.search).get('filter');
if (urlFilter) {
  const btn = document.querySelector(`.filter-btn[data-filter="${urlFilter}"]`);
  if (btn) btn.click();
}

fetch('data/products.json')
  .then(r => r.json())
  .then(data => {
    allProducts = data;
    document.getElementById('loadingState').classList.add('hidden');
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    renderGrid(activeFilter === 'all' ? allProducts : allProducts.filter(p => p.category === activeFilter));
  })
  .catch(() => {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('errorState').classList.remove('hidden');
  });

document.getElementById('retryBtn')?.addEventListener('click', () => location.reload());
