document.addEventListener("DOMContentLoaded", loadProductDetails);

function loadProductDetails() {

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        document.getElementById("productDetails").innerHTML = `
            <div class="alert alert-danger">
                Product not found.
            </div>`;
        return;
    }

    fetch(`/api/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Product not found");
            }

            return response.json();
        })
        .then(product => {

            document.getElementById("productDetails").innerHTML = `

                <div class="row">

                    <div class="col-md-6 text-center">

                        <img src="${product.imageUrl}"
                             alt="${product.name}"
                             class="img-fluid rounded shadow"
                             style="max-height: 450px; object-fit: cover;">

                    </div>

                    <div class="col-md-6">

                        <h1>${product.name}</h1>

                        <p class="text-muted">
                            ${product.description}
                        </p>

                        <h2 class="my-4">
                            ₹${product.price}
                        </h2>

                        <p>
                            <strong>Category:</strong>
                            ${product.category.name}
                        </p>

                        <p>
                            <strong>Available Stock:</strong>
                            ${product.stock}
                        </p>

                        <div class="mb-3">

                            <label for="quantity"
                                   class="form-label">
                                Quantity
                            </label>

                            <input type="number"
                                   id="quantity"
                                   class="form-control"
                                   value="1"
                                   min="1"
                                   max="${product.stock}"
                                   style="width:120px;">

                        </div>

                        <button class="btn btn-dark btn-lg"
                                onclick="addToCart(${product.id})">
                            Add to Cart
                        </button>

                        <a href="products.html"
                           class="btn btn-outline-dark btn-lg ms-2">
                            Back to Products
                        </a>

                        <div id="message"
                             class="mt-3">
                        </div>

                    </div>

                </div>
            `;
        })
        .catch(error => {

            console.error("Error:", error);

            document.getElementById("productDetails").innerHTML = `
                <div class="alert alert-danger">
                    Unable to load product details.
                </div>`;
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

    const quantity =
        Number(document.getElementById("quantity").value);

    if (quantity <= 0) {

        alert("Please enter a valid quantity.");

        return;
    }

    const userId = loggedInUser.id;

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
		        document.getElementById("message").innerHTML = `
		            <div class="alert alert-danger">
		                Insufficient stock available.
		            </div>
		        `;
		        return;
		    }

		    document.getElementById("message").innerHTML = `
		        <div class="alert alert-success">
		            Product added to cart successfully! 🛒
		            <br>
		            Quantity in cart: ${cartItem.quantity}
		        </div>
		    `;
		})
        .catch(error => {

            console.error("Error:", error);

            document.getElementById("message").innerHTML = `
                <div class="alert alert-danger">
                    Unable to add product to cart.
                </div>
            `;
        });
}