document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin.html')) {
        loadAdminProducts();
        setupAdminEventListeners();
    }
});

function setupAdminEventListeners() {
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewProduct();
        });
    }
}

function addNewProduct() {
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const description = document.getElementById('productDescription').value;
    const price = document.getElementById('productPrice').value;
    const emoji = document.getElementById('productEmoji').value;

    const productData = {
        name,
        category,
        description,
        price,
        emoji
    };

    const form = document.getElementById('addProductForm');
    if (form.dataset.editing) {
        const success = updateProduct(
            form.dataset.editingCategory, 
            parseInt(form.dataset.editing), 
            productData
        );
        
        if (success) {
            alert('Product updated successfully!');
            resetFormToAddMode();
        }
    } else {
        addProduct(productData);
        alert('Product added successfully!');
    }
    
    loadAdminProducts();
    form.reset();
}

function resetFormToAddMode() {
    const form = document.getElementById('addProductForm');
    delete form.dataset.editing;
    delete form.dataset.editingCategory;
    
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Add Product';
    submitBtn.className = 'btn btn-success';
}

function loadAdminProducts() {
    const products = getProducts();
    
    const adminFoodGrid = document.getElementById('adminFoodGrid');
    if (adminFoodGrid) {
        adminFoodGrid.innerHTML = '';
        if (products.food) {
            products.food.forEach(product => {
                adminFoodGrid.appendChild(createAdminProductCard(product, 'food'));
            });
        }
    }
    
    const adminItemsGrid = document.getElementById('adminItemsGrid');
    if (adminItemsGrid) {
        adminItemsGrid.innerHTML = '';
        if (products.items) {
            products.items.forEach(product => {
                adminItemsGrid.appendChild(createAdminProductCard(product, 'items'));
            });
        }
    }
    
    const adminAccessoriesGrid = document.getElementById('adminAccessoriesGrid');
    if (adminAccessoriesGrid) {
        adminAccessoriesGrid.innerHTML = '';
        if (products.accessories) {
            products.accessories.forEach(product => {
                adminAccessoriesGrid.appendChild(createAdminProductCard(product, 'accessories'));
            });
        }
    }
}

function createAdminProductCard(product, category) {
    const card = document.createElement('div');
    card.className = 'admin-product-card';
    
    card.innerHTML = `
        <div class="admin-product-image">
            ${product.emoji}
        </div>
        <div class="admin-product-info">
            <h5>${product.name}</h5>
            <p>${product.description}</p>
            <div class="admin-product-price">${product.price}</div>
        </div>
        <div class="admin-product-actions">
            <button class="btn btn-edit" onclick="editProduct('${category}', ${product.id})">Edit</button>
            <button class="btn btn-danger" onclick="deleteProductAdmin('${category}', ${product.id})">Delete</button>
        </div>
    `;
    
    return card;
}

function deleteProductAdmin(category, productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        deleteProduct(category, productId);
        loadAdminProducts();
        alert('Product deleted successfully!');
    }
}

function editProduct(category, productId) {
    const products = getProducts();
    const product = products[category].find(p => p.id === productId);
    
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = category;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productEmoji').value = product.emoji;
        
        const form = document.getElementById('addProductForm');
        form.dataset.editing = productId;
        form.dataset.editingCategory = category;
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Product';
        submitBtn.className = 'btn btn-warning';
        
        form.scrollIntoView({ behavior: 'smooth' });
    }
}