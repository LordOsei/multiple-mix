const API_URL = '/api/products';

const CATEGORY_ICONS = {
  clothing: ['👘', '👗', '🥻', '👔'],
  food: ['🌶️', '🫙', '🥜', '🍌'],
};

let allProducts = [];
let clothingCount = 0;
let foodCount = 0;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

function getIcon(product) {
  const icons = CATEGORY_ICONS[product.category] || ['🛍️'];
  if (product.category === 'clothing') {
    return icons[clothingCount++ % icons.length];
  }
  return icons[foodCount++ % icons.length];
}

function renderCards(products) {
  clothingCount = 0;
  foodCount = 0;

  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-gray)">No products in this category yet.</p>';
    return;
  }

  products.forEach(product => {
    const card = document.createElement('article');
    const catClass = `product-card--${escapeHtml(product.category)}`;
    card.className = `product-card ${catClass}`;

    const badgeLabel = product.category === 'clothing' ? 'Clothing' : 'Food & Snacks';

    card.innerHTML = `
      <div class="product-card__stripe"></div>
      <div class="product-card__image" aria-hidden="true">${getIcon(product)}</div>
      <div class="product-card__body">
        <span class="product-card__badge">${badgeLabel}</span>
        <h3 class="product-card__name">${escapeHtml(product.name)}</h3>
        <p class="product-card__desc">${escapeHtml(product.description)}</p>
        <div class="product-card__footer">
          <span class="product-card__price">${formatPrice(product.price)}</span>
          <button class="btn btn--add">Add to Cart</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function applyFilter(filter) {
  const filtered = filter === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === filter);
  renderCards(filtered);
}

async function loadProducts() {
  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');

  loadingState.classList.remove('hidden');
  errorState.classList.add('hidden');

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allProducts = await res.json();
    loadingState.classList.add('hidden');
    renderCards(allProducts);
  } catch (err) {
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
    console.error('Failed to load products:', err);
  }
}

// Category filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });
});

// Mobile nav toggle
document.querySelector('.nav__toggle').addEventListener('click', () => {
  document.querySelector('.nav__links').classList.toggle('open');
});

document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav__links').classList.remove('open');
  });
});

document.getElementById('retryBtn').addEventListener('click', loadProducts);

loadProducts();
