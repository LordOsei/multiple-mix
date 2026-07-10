const CLOTHING_ICONS = ['👘', '👗', '🥻', '👔'];
const FOOD_ICONS = ['🌶️', '🫙', '🥜', '🍌'];

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get('id'));

fetch('data/products.json')
  .then(r => r.json())
  .then(products => {
    const p = products.find(x => x.id === productId);
    if (!p) { document.getElementById('productDetail').innerHTML = '<p style="padding:3rem;text-align:center;color:var(--text-gray)">Product not found. <a href="shop.html" style="color:var(--gold)">Back to shop</a></p>'; return; }

    document.title = `${p.name} — Multiple Mix`;
    const icons = p.category === 'clothing' ? CLOTHING_ICONS : FOOD_ICONS;
    const icon = icons[p.id % icons.length];

    const detail = document.getElementById('productDetail');
    detail.innerHTML = `
      <div class="product-detail__image">
        <img id="prodImg" src="${esc(p.image)}" alt="${esc(p.name)}" />
        <div class="product-detail__image-fallback hidden" id="prodFallback">${icon}</div>
      </div>
      <div class="product-detail__info">
        <p class="product-detail__cat">${p.category === 'clothing' ? 'Clothing' : 'Food & Snacks'}</p>
        <h1 class="product-detail__name">${esc(p.name)}</h1>
        <p class="product-detail__price">${fmt(p.price)}</p>
        <p class="product-detail__desc">${esc(p.description)}</p>
        ${p.sizes && p.sizes.length > 1 ? `
        <span class="product-detail__label">${p.category === 'clothing' ? 'Size' : 'Size / Weight'}</span>
        <div class="size-options" id="sizeOptions">
          ${p.sizes.map((s, i) => `<button class="size-btn${i === 0 ? ' active' : ''}" data-size="${esc(s)}">${esc(s)}</button>`).join('')}
        </div>` : ''}
        ${p.colors && p.colors.length ? `
        <span class="product-detail__label" style="margin-top:0.25rem">Color</span>
        <div class="size-options" id="colorOptions">
          ${p.colors.map((c, i) => `<button class="size-btn${i === 0 ? ' active' : ''}" data-color="${esc(c)}">${esc(c)}</button>`).join('')}
        </div>` : ''}
        <div class="qty-row" style="margin-top:1.25rem">
          <span class="product-detail__label" style="margin:0">Quantity</span>
          <div class="qty-control">
            <button class="qty-btn" id="qtyDown">&#8722;</button>
            <input class="qty-input" id="qtyInput" type="number" value="1" min="1" max="20" />
            <button class="qty-btn" id="qtyUp">&#43;</button>
          </div>
        </div>
        <div class="product-detail__actions">
          <button class="btn btn--primary" id="addToCartBtn">Add to Cart</button>
          <a href="shop.html" class="btn btn--ghost">Continue Shopping</a>
        </div>
        <div class="add-confirm" id="addConfirm">&#10003; Added to cart!</div>
        <div class="product-detail__details">
          <h4>Product Details</h4>
          <p>${esc(p.details)}</p>
        </div>
      </div>`;

    // Image fallback
    document.getElementById('prodImg').addEventListener('error', () => {
      document.getElementById('prodImg').classList.add('hidden');
      document.getElementById('prodFallback').classList.remove('hidden');
    });

    // Size buttons
    document.querySelectorAll('#sizeOptions .size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#sizeOptions .size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    document.querySelectorAll('#colorOptions .size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#colorOptions .size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Qty controls
    const qtyInput = document.getElementById('qtyInput');
    document.getElementById('qtyDown').addEventListener('click', () => { qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1); });
    document.getElementById('qtyUp').addEventListener('click', () => { qtyInput.value = Math.min(20, parseInt(qtyInput.value) + 1); });

    // Add to cart
    document.getElementById('addToCartBtn').addEventListener('click', () => {
      const size = document.querySelector('#sizeOptions .size-btn.active')?.dataset.size || p.sizes?.[0] || null;
      const qty = parseInt(qtyInput.value) || 1;
      addToCart(p, qty, size);
      const confirm = document.getElementById('addConfirm');
      confirm.classList.add('show');
      setTimeout(() => confirm.classList.remove('show'), 2500);
    });

    // Related products
    const related = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
    const relGrid = document.getElementById('relatedGrid');
    if (relGrid && related.length) {
      const icons2 = p.category === 'clothing' ? CLOTHING_ICONS : FOOD_ICONS;
      related.forEach((r, idx) => {
        const card = document.createElement('article');
        card.className = `product-card product-card--${esc(r.category)}`;
        card.innerHTML = `
          <div class="product-card__stripe"></div>
          <div class="product-card__image">
            <img src="${esc(r.image)}" alt="${esc(r.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" loading="lazy" />
            <div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:3.5rem;background:var(--light-gray)">${icons2[idx % icons2.length]}</div>
          </div>
          <div class="product-card__body">
            <h3 class="product-card__name">${esc(r.name)}</h3>
            <p class="product-card__desc">${esc(r.description)}</p>
            <div class="product-card__footer">
              <span class="product-card__price">${fmt(r.price)}</span>
              <a href="product.html?id=${r.id}" class="btn btn--sm btn--primary">View</a>
            </div>
          </div>`;
        relGrid.appendChild(card);
      });
    } else if (relGrid) {
      relGrid.closest('section')?.remove();
    }
  })
  .catch(() => {
    document.getElementById('productDetail').innerHTML = '<p style="padding:3rem;text-align:center;color:var(--text-gray)">Failed to load product.</p>';
  });
