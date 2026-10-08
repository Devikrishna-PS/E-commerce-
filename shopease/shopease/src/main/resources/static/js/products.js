let allProducts = [];

document.addEventListener("DOMContentLoaded", function() {
    loadProducts();
    loadCategories();

    document.getElementById("searchInput")
        .addEventListener("input", applyFilters);

    document.getElementById("categoryFilter")
        .addEventListener("change", applyFilters);
});

function loadProducts() {
    fetch("/api/products")
        .then(response => response.json())
        .then(products => {
            allProducts = products;
            displayProducts(allProducts);
        })
        .catch(error => {
            console.error("Error loading products:", error);

            document.getElementById("productContainer").innerHTML = `
                <div class="alert alert-danger">
                    Unable to load products.
                </div>`;
        });
}

function loadCategories() {
    fetch("/api/categories")
        .then(response => response.json())
        .then(categories => {
            const categoryFilter =
                document.getElementById("categoryFilter");

            categories.forEach(category => {
                categoryFilter.innerHTML += `
                    <option value="${category.name}">
                        ${category.name}
                    </option>`;
            });
        })
        .catch(error => {
            console.error("Error loading categories:", error);
        });
}

function applyFilters() {
    const searchText =
        document.getElementById("searchInput").value.toLowerCase();

    const selectedCategory =
        document.getElementById("categoryFilter").value;

    const filteredProducts = allProducts.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "" ||
            product.category.name === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayProducts(filteredProducts);
}

function displayProducts(products) {

    const container =
        document.getElementById("productContainer");

    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    No products found.
                </div>
            </div>`;

        return;
    }

    products.forEach(product => {

        const productCard = `
            <div class="col-md-4 col-lg-3 mb-4">
                <div class="card h-100 shadow-sm">

                    <img src="${product.imageUrl}"
                         class="card-img-top"
                         alt="${product.name}"
                         style="height: 200px; object-fit: cover;">

                    <div class="card-body d-flex flex-column">

					<h5 class="card-title">
					    <a href="product-details.html?id=${product.id}"
					       class="text-decoration-none text-dark">
					        ${product.name}
					    </a>
					</h5>

                        <p class="card-text text-muted">
                            ${product.description}
                        </p>

                        <p>
                            <strong>Category:</strong>
                            ${product.category.name}
                        </p>

                        <h5 class="mt-auto">
                            ₹${product.price}
                        </h5>

                        <p>
                            Stock: ${product.stock}
                        </p>

						<div class="d-grid gap-2">

						    <a href="product-details.html?id=${product.id}"
						       class="btn btn-outline-dark">
						        View Details
						    </a>

						    <button class="btn btn-dark"
						            onclick="addToCart(${product.id})">
						        Add to Cart
						    </button>

						</div>

                    </div>
                </div>
            </div>`;

        container.innerHTML += productCard;
    });
}

function addToCart(productId) {

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        alert("Please login before adding products to cart.");
        window.location.href = "login.html";
        return;
    }

    const userId = loggedInUser.id;
    const quantity = 1;

    fetch(`/api/cart/add?userId=${userId}&productId=${productId}&quantity=${quantity}`, {
        method: "POST"
    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to add product");
        }

        return response.json();
    })
	.then(cartItem => {

	    if (cartItem === null) {
	        alert("Insufficient stock available.");
	        return;
	    }

	    alert("Product added to cart successfully! 🛒");

	    console.log("Cart item:", cartItem);
	})
    .catch(error => {

        console.error("Error:", error);

        alert("Unable to add product to cart.");
    });
}