document.addEventListener("DOMContentLoaded", loadOrders);


function getLoggedInUser() {

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {

        alert("Please login to view your orders.");

        window.location.href = "login.html";

        return null;
    }

    return loggedInUser;
}


function loadOrders() {
	const loggedInUser = getLoggedInUser();

	if (!loggedInUser) {
	    return;
	}

	const userId = loggedInUser.id;

    fetch(`/api/orders/${userId}`)
        .then(response => response.json())
        .then(orders => {

            const container =
                document.getElementById("ordersContainer");


            if (orders.length === 0) {

                container.innerHTML = `
                    <div class="alert alert-info text-center">
                        You have no orders yet.
                    </div>

                    <div class="text-center">
                        <a href="products.html"
                           class="btn btn-dark">
                            Start Shopping
                        </a>
                    </div>
                `;

                return;
            }


            let html = "";


            orders.forEach(order => {

                let statusClass = "bg-secondary";


                if (order.status === "PLACED") {
                    statusClass = "bg-primary";
                }

                else if (order.status === "PROCESSING") {
                    statusClass = "bg-warning text-dark";
                }

                else if (order.status === "SHIPPED") {
                    statusClass = "bg-info text-dark";
                }

                else if (order.status === "OUT FOR DELIVERY") {
                    statusClass = "bg-warning text-dark";
                }

                else if (order.status === "DELIVERED") {
                    statusClass = "bg-success";
                }


                html += `
                    <div class="card shadow-sm mb-4">

                        <div class="card-body">

                            <div class="d-flex justify-content-between
                                        align-items-center mb-3">

                                <div>

                                    <h4>
                                        Order #${order.id}
                                    </h4>

                                    <small class="text-muted">
                                        ${formatDate(order.orderDate)}
                                    </small>

                                </div>


                                <span class="badge ${statusClass} p-2">
                                    ${order.status}
                                </span>

                            </div>


                            <hr>


                            <div class="row">

                                <div class="col-md-6">

                                    <p>
                                        <strong>Total Amount:</strong>
                                        ₹${order.totalAmount}
                                    </p>

                                </div>


                                <div class="col-md-6">

                                    <p>
                                        <strong>Customer:</strong>
                                        ${order.user.name}
                                    </p>

                                </div>

                            </div>


                            <!-- Tracking -->
                            <div class="mt-3">

                                <h6>
                                    Order Tracking
                                </h6>

                                <div class="tracking">

                                    <span class="${getStepClass(order.status, "PLACED")}">
                                        1. Placed
                                    </span>

                                    <span class="${getStepClass(order.status, "PROCESSING")}">
                                        2. Processing
                                    </span>

                                    <span class="${getStepClass(order.status, "SHIPPED")}">
                                        3. Shipped
                                    </span>

                                    <span class="${getStepClass(order.status, "OUT FOR DELIVERY")}">
                                        4. Out for Delivery
                                    </span>

                                    <span class="${getStepClass(order.status, "DELIVERED")}">
                                        5. Delivered
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>
                `;
            });


            container.innerHTML = html;

        })
        .catch(error => {

            console.error("Error:", error);

            document.getElementById("ordersContainer").innerHTML = `
                <div class="alert alert-danger">
                    Unable to load orders.
                </div>
            `;
        });
}


function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleString();
}


function getStepClass(currentStatus, stepStatus) {

    const steps = [
        "PLACED",
        "PROCESSING",
        "SHIPPED",
        "OUT FOR DELIVERY",
        "DELIVERED"
    ];


    const currentIndex =
        steps.indexOf(currentStatus);

    const stepIndex =
        steps.indexOf(stepStatus);


    if (stepIndex <= currentIndex) {
        return "tracking-step completed";
    }


    return "tracking-step";
}