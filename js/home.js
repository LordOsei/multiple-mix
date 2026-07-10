const CLOTHING_ICONS = ['👘', '👗', '🥻', '👔'];
const FOOD_ICONS = ['🌶️', '🫙', '🥜', '🍌'];
let ci = 0, fi = 0;

function productIcon(cat) {
  return cat === 'clothing' ? CLOTHING_ICONS[ci++ % CLOTHING_ICONS.length] : FOOD_ICONS[fi++ % FOOD_ICONS.length];
}

function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderFeatured(products) {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  grid.innerHTML = '';
  products.filter(p => p.featured).slice(0, 4).forEach(p => {
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

fetch('data/products.json')
  .then(r => r.json())
  .then(renderFeatured)
  .catch(() => {
    const grid = document.getElementById('featuredGrid');
    if (grid) grid.innerHTML = '<p class="grid-loading">Could not load products.</p>';
  });
