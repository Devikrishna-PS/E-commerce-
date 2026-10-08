document.addEventListener("DOMContentLoaded", loadCart);

function loadCart() {

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {

        alert("Please login to view your cart.");

        window.location.href = "login.html";

        return;
    }

    const userId = loggedInUser.id;

    fetch(`/api/cart/${userId}`)
        .then(response => response.json())
        .then(cartItems => {

            const container =
                document.getElementById("cartContainer");

				if (cartItems.length === 0) {
				    container.innerHTML = `
				        <div class="text-center py-5">
				            <h3>Your cart is empty 🛒</h3>
				            <p class="text-muted">
				                You haven't added any products yet.
				            </p>
				            <a href="products.html"
				               class="btn btn-dark">
				                Continue Shopping
				            </a>
				        </div>
				    `;

				    return;
				}

            let total = 0;

            let html = `
                <div class="table-responsive">

                    <table class="table table-bordered align-middle">

                        <thead class="table-dark">

                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th>Action</th>
                            </tr>

                        </thead>

                        <tbody>
            `;

            cartItems.forEach(item => {

                const product = item.product;

                const subtotal =
                    product.price * item.quantity;

                total += subtotal;

                html += `
                    <tr>

                        <td>
                            <strong>
                                ${product.name}
                            </strong>
                        </td>

                        <td>
                            ₹${product.price}
                        </td>

                        <td>
						<input type="number"
						       value="${item.quantity}"
						       min="1"
						       max="${item.product.stock}"
						       onchange="updateQuantity(${item.id}, this.value)">
                        </td>

                        <td>
                            ₹${subtotal}
                        </td>

                        <td>
                            <button class="btn btn-danger btn-sm"
                                    onclick="removeItem(${item.id})">
                                Remove
                            </button>
                        </td>

                    </tr>
                `;
            });

            html += `
                        </tbody>

                    </table>

                </div>

                <div class="text-end mt-4">

                    <h3>
                        Total: ₹${total}
                    </h3>

                    <a href="checkout.html"
                       class="btn btn-dark btn-lg mt-2">
                        Proceed to Checkout
                    </a>

                </div>
            `;

            container.innerHTML = html;
        })
        .catch(error => {

            console.error("Error:", error);

            document.getElementById("cartContainer").innerHTML = `
                <div class="alert alert-danger">
                    Unable to load cart.
                </div>
            `;
        });
}


// Update quantity
function updateQuantity(itemId, quantity) {

    quantity = Number(quantity);

    if (quantity <= 0) {
        alert("Quantity must be at least 1.");
        loadCart();
        return;
    }

    fetch(`/api/cart/update/${itemId}?quantity=${quantity}`, {
        method: "PUT"
    })
        .then(response => response.json())
        .then(cartItem => {

            if (cartItem === null) {
                alert("Insufficient stock available.");
                loadCart();
                return;
            }

            loadCart();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Unable to update quantity.");
            loadCart();
        });
}


// Remove item
function removeItem(itemId) {

    fetch(`/api/cart/remove/${itemId}`, {
        method: "DELETE"
    })
    .then(() => {

        loadCart();

    })
    .catch(error => {

        console.error("Error:", error);

        alert("Unable to remove item.");
    });
}