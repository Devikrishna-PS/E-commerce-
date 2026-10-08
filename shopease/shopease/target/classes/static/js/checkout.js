document.addEventListener("DOMContentLoaded", loadCheckout);


function getLoggedInUser() {

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {

        alert("Please login before checkout.");

        window.location.href = "login.html";

        return null;
    }

    return loggedInUser;
}


function loadCheckout() {

    const loggedInUser = getLoggedInUser();

    if (!loggedInUser) {
        return;
    }

    const userId = loggedInUser.id;

    fetch(`/api/cart/${userId}`)

        .then(response => response.json())

        .then(cartItems => {

            const summary =
                document.getElementById("orderSummary");

            if (cartItems.length === 0) {

                summary.innerHTML = `
                    <p class="text-muted">
                        Your cart is empty.
                    </p>

                    <a href="products.html"
                       class="btn btn-dark">
                        Continue Shopping
                    </a>
                `;

                document.getElementById("placeOrderBtn").disabled = true;

                return;
            }


            let total = 0;

            let html = "";


            cartItems.forEach(item => {

                const product = item.product;

                const subtotal =
                    product.price * item.quantity;

                total += subtotal;


                html += `
                    <div class="d-flex justify-content-between mb-2">

                        <span>
                            ${product.name} × ${item.quantity}
                        </span>

                        <span>
                            ₹${subtotal}
                        </span>

                    </div>
                `;

            });


            html += `
                <hr>

                <div class="d-flex justify-content-between">

                    <strong>Total</strong>

                    <strong>₹${total}</strong>

                </div>
            `;


            summary.innerHTML = html;

        })

        .catch(error => {

            console.error("Error:", error);

            document.getElementById("orderSummary").innerHTML = `
                <div class="alert alert-danger">
                    Unable to load order summary.
                </div>
            `;

        });
}


function placeOrder() {

    const loggedInUser = getLoggedInUser();

    if (!loggedInUser) {
        return;
    }

    const userId = loggedInUser.id;

    const button =
        document.getElementById("placeOrderBtn");


    button.disabled = true;

    button.innerText = "Placing Order...";


    fetch(`/api/orders/checkout/${userId}`, {

        method: "POST"

    })

    .then(response => {

        if (!response.ok) {

            throw new Error("Checkout failed");

        }

        return response.json();

    })

    .then(order => {

        document.getElementById("checkoutMessage").innerHTML = `
            <div class="alert alert-success">

                <h5>
                    Order placed successfully! 🎉
                </h5>

                <p>
                    Order ID:
                    <strong>${order.id}</strong>
                </p>

                <p>
                    Total:
                    <strong>₹${order.totalAmount}</strong>
                </p>

                <p>
                    Status:
                    <strong>${order.status}</strong>
                </p>

                <a href="orders.html"
                   class="btn btn-success">
                    View My Orders
                </a>

            </div>
        `;


        document.getElementById("orderSummary").innerHTML = `
            <p class="text-success">
                Order placed successfully.
            </p>
        `;


        button.style.display = "none";

    })

    .catch(error => {

        console.error("Error:", error);

        button.disabled = false;

        button.innerText = "Place Order";

        document.getElementById("checkoutMessage").innerHTML = `
            <div class="alert alert-danger">
                Unable to place order. Please try again.
            </div>
        `;

    });
}