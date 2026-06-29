let cart = [];

function openCart() {
    document.getElementById('cartPanel').classList.add('open');
    document.getElementById('cartPanel').setAttribute('aria-hidden', 'false');
    document.getElementById('cartOverlay').classList.add('open');
    document.getElementById('cartOverlay').setAttribute('aria-hidden', 'false');
    document.getElementById('cartOpenBtn').setAttribute('aria-expanded', 'true');
    document.getElementById('cartCloseBtn').focus();
}

function closeCart() {
    document.getElementById('cartPanel').classList.remove('open');
    document.getElementById('cartPanel').setAttribute('aria-hidden', 'true');
    document.getElementById('cartOverlay').classList.remove('open');
    document.getElementById('cartOverlay').setAttribute('aria-hidden', 'true');
    document.getElementById('cartOpenBtn').setAttribute('aria-expanded', 'false');
    document.getElementById('cartOpenBtn').focus();
}

document.addEventListener('DOMContentLoaded', function () {
    var cartOpenBtn = document.getElementById('cartOpenBtn');
    if (cartOpenBtn) cartOpenBtn.addEventListener('click', openCart);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeCart();
    });

    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
        applyFilters();
    }
});






function addToCart(name, price, emoji) {
    cart.push({ name: name, price: price, emoji: emoji });
    renderCart();
    showToast('"' + name + '" adicionado ao carrinho.');
}

function removeFromCart(index) {
    var name = cart[index].name;
    cart.splice(index, 1);
    renderCart();
    showToast('"' + name + '" removido do carrinho.');
}

function renderCart() {
    var items = document.getElementById('cartItems');
    var badge = document.getElementById('cartBadge');
    var btn = document.getElementById('cartOpenBtn');

    badge.textContent = cart.length;
    btn.setAttribute('aria-label', 'Abrir carrinho. ' + cart.length + ' ' + (cart.length === 1 ? 'item' : 'itens') + '.');

    if (cart.length === 0) {
        items.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
        document.getElementById('cartTotal').textContent = 'R$ 0,00';
        return;
    }

    var total = 0;
    var html = '';
    cart.forEach(function (item, i) {
        var val = parseFloat(item.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
        total += val;
        html += '<div class="cart-item">';
        html += '<span class="cart-item-emoji" aria-hidden="true">' + item.emoji + '</span>';
        html += '<div class="cart-item-info">';
        html += '<p class="cart-item-name">' + item.name + '</p>';
        html += '<p class="cart-item-price">' + item.price + '</p>';
        html += '</div>';
        html += '<button class="cart-item-remove" onclick="removeFromCart(' + i + ')" aria-label="Remover ' + item.name + ' do carrinho">✕</button>';
        html += '</div>';
    });
    items.innerHTML = html;

    var fmt = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('cartTotal').textContent = fmt;
}

function showToast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 2800);
}

var activeCat = 'all';
var activePrice = 'all';

function filterCat(btn, val) {
    document.querySelectorAll('[data-filter-cat]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    btn.setAttribute('aria-pressed', 'true');
    activeCat = val;
    applyFilters();
}

function filterPrice(btn, val) {
    document.querySelectorAll('[data-filter-price]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    btn.setAttribute('aria-pressed', 'true');
    activePrice = val;
    applyFilters();
}




function applyFilters() {
    var query = document.getElementById('searchInput').value.toLowerCase();
    var cards = document.querySelectorAll('.product-card');
    var visible = 0;

    cards.forEach(function (card) {
        var cat = card.dataset.cat;
        var price = card.dataset.price;
        var name = card.querySelector('.product-name').textContent.toLowerCase();
        var desc = card.querySelector('.product-desc').textContent.toLowerCase();

        var matchCat = activeCat === 'all' || cat === activeCat;
        var matchPrice = activePrice === 'all' || price === activePrice;
        var matchText = !query || name.indexOf(query) !== -1 || desc.indexOf(query) !== -1;

        if (matchCat && matchPrice && matchText) {
            card.style.display = '';
            visible++;
        } else {
            card.style.display = 'none';
        }
    });

    document.getElementById('resultsCount').textContent = visible;
}

function setFont(size) {
    document.getElementById('fontNormal').setAttribute('aria-pressed', 'false');
    document.getElementById('fontLarge').setAttribute('aria-pressed', 'false');
    document.getElementById('fontXlarge').setAttribute('aria-pressed', 'false');

    if (size === 'large') {
        document.documentElement.style.fontSize = '22px';
        document.getElementById('fontLarge').setAttribute('aria-pressed', 'true');
    } else if (size === 'xlarge') {
        document.documentElement.style.fontSize = '28px';
        document.getElementById('fontXlarge').setAttribute('aria-pressed', 'true');
    } else {
        document.documentElement.style.fontSize = '18px';
        document.getElementById('fontNormal').setAttribute('aria-pressed', 'true');
    }
}

function toggleContrast() {
    var on = document.body.classList.toggle('extra-contrast');
    document.getElementById('contrastBtn').setAttribute('aria-pressed', on ? 'true' : 'false');
}

