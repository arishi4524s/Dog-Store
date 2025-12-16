
function normalizePrices(data) {
    const fixPrice = (p) => {
        if (typeof p === 'string') {
            // remove any currency symbol and spaces at the start, then add ₹
            const numeric = p.replace(/^[^0-9]+/, '').trim();
            return '₹' + numeric;
        }
        return p;
    };

    ['food', 'items', 'accessories'].forEach(cat => {
        if (data[cat] && Array.isArray(data[cat])) {
            data[cat] = data[cat].map(prod => ({
                ...prod,
                price: fixPrice(prod.price)
            }));
        }
    });
    return data;
}


function getProducts() {
    const savedProducts = localStorage.getItem('dogStoreProducts');
    if (savedProducts) {
        return normalizePrices(JSON.parse(savedProducts));
    } else {
        return {
            food: [
                {
                    id: 1,
                    name: "Premium Dry Dog Food",
                    description: "High-quality dry food for adult dogs with balanced nutrition",
                    price: "₹45.99",
                    emoji: "🍗"
                },
                {
                    id: 2,
                    name: "Grain-Free Wet Food",
                    description: "Delicious grain-free wet food for sensitive stomachs",
                    price: "₹32.50",
                    emoji: "🥫"
                },
                {
                    id: 3,
                    name: "Puppy Growth Formula",
                    description: "Specially formulated for growing puppies with essential nutrients",
                    price: "₹38.75",
                    emoji: "🐶"
                }
            ],
            items: [
                {
                    id: 4,
                    name: "Chew-Resistant Dog Bed",
                    description: "Comfortable orthopedic bed with chew-resistant material",
                    price: "₹89.99",
                    emoji: "🛏️"
                },
                {
                    id: 5,
                    name: "Interactive Puzzle Toy",
                    description: "Mental stimulation toy that dispenses treats",
                    price: "₹24.99",
                    emoji: "🎯"
                },
                {
                    id: 6,
                    name: "Durable Food Bowl",
                    description: "Stainless steel non-slip food and water bowl set",
                    price: "₹19.99",
                    emoji: "🥣"
                }
            ],
            accessories: [
                {
                    id: 7,
                    name: "Adjustable Dog Harness",
                    description: "Comfortable no-pull harness with reflective strips",
                    price: "₹35.99",
                    emoji: "🎽"
                },
                {
                    id: 8,
                    name: "GPS Tracking Collar",
                    description: "Smart collar with real-time location tracking",
                    price: "₹129.99",
                    emoji: "📍"
                },
                {
                    id: 9,
                    name: "Fashionable Bandana",
                    description: "Cotton bandana with various stylish patterns",
                    price: "₹12.99",
                    emoji: "🧣"
                }
            ]
        };
    }
}

function saveProducts(products) {
    localStorage.setItem('dogStoreProducts', JSON.stringify(products));
}

function addProduct(product) {
    const products = getProducts();
    product.id = Date.now();
    
    if (products[product.category]) {
        products[product.category].push(product);
    } else {
        products[product.category] = [product];
    }
    
    saveProducts(products);
    return product;
}

function deleteProduct(category, productId) {
    const products = getProducts();
    products[category] = products[category].filter(product => product.id !== productId);
    saveProducts(products);
}

function updateProduct(category, productId, updatedProduct) {
    const products = getProducts();
    const index = products[category].findIndex(product => product.id === productId);
    if (index !== -1) {
        products[category][index] = { ...updatedProduct, id: productId };
        saveProducts(products);
        return true;
    }
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        loadProducts();
    }
});

function loadProducts() {
    const products = getProducts();
    
    const foodGrid = document.getElementById('foodGrid');
    if (foodGrid && products.food) {
        foodGrid.innerHTML = '';
        products.food.forEach(product => {
            foodGrid.appendChild(createProductCard(product));
        });
    }
    
    const itemsGrid = document.getElementById('itemsGrid');
    if (itemsGrid && products.items) {
        itemsGrid.innerHTML = '';
        products.items.forEach(product => {
            itemsGrid.appendChild(createProductCard(product));
        });
    }
    
    const accessoriesGrid = document.getElementById('accessoriesGrid');
    if (accessoriesGrid && products.accessories) {
        accessoriesGrid.innerHTML = '';
        products.accessories.forEach(product => {
            accessoriesGrid.appendChild(createProductCard(product));
        });
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            ${product.emoji}
        </div>
        <h4>${product.name}</h4>
        <p>${product.description}</p>
        <div class="product-price">${product.price}</div>
        <button class="btn btn-block">Add to Cart</button>
    `;
    
    return card;
}