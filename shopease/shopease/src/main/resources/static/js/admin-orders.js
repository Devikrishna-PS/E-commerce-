document.addEventListener("DOMContentLoaded", function() {

    checkAdmin();

    loadOrders();

});


function checkAdmin() {

    const user =
        JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {

        alert("Please login first.");

        window.location.href = "login.html";

        return false;
    }

    if (user.role !== "ADMIN") {

        alert("Access denied. Admin only.");

        window.location.href = "index.html";

        return false;
    }

    return true;
}


function loadOrders() {

    fetch("/api/orders/all")

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load orders");
            }

            return response.json();

        })

        .then(orders => {

            const container =
                document.getElementById("ordersContainer");

            if (orders.length === 0) {

                container.innerHTML = `
                    <div class="alert alert-info text-center">
                        No orders found.
                    </div>
                `;

                return;
            }

            let html = `
                <div class="table-responsive">

                    <table class="table table-bordered
                                  table-hover align-middle">

                        <thead class="table-dark">

                            <tr>

                                <th>Order ID</th>

                                <th>Customer</th>

                                <th>Email</th>

                                <th>Total</th>

                                <th>Date</th>

                                <th>Status</th>

                                <th>Update</th>

                            </tr>

                        </thead>

                        <tbody>
            `;


            orders.forEach(order => {

                html += `

                    <tr>

                        <td>
                            #${order.id}
                        </td>

                        <td>
                            ${order.user.name}
                        </td>

                        <td>
                            ${order.user.email}
                        </td>

                        <td>
                            ₹${order.totalAmount}
                        </td>

                        <td>
                            ${formatDate(order.orderDate)}
                        </td>

                        <td>

                            <span class="badge bg-secondary">

                                ${order.status}

                            </span>

                        </td>

                        <td>

                            <select
                                class="form-select mb-2"
                                id="status-${order.id}">

                                <option value="PLACED">
                                    PLACED
                                </option>

                                <option value="PROCESSING">
                                    PROCESSING
                                </option>

                                <option value="SHIPPED">
                                    SHIPPED
                                </option>

                                <option value="OUT FOR DELIVERY">
                                    OUT FOR DELIVERY
                                </option>

                                <option value="DELIVERED">
                                    DELIVERED
                                </option>

                            </select>

                            <button
                                class="btn btn-dark btn-sm"
                                onclick="updateStatus(${order.id})">

                                Update

                            </button>

                        </td>

                    </tr>

                `;

            });


            html += `

                        </tbody>

                    </table>

                </div>

            `;

            container.innerHTML = html;


            // Select the current status
            orders.forEach(order => {

                const select =
                    document.getElementById(
                        `status-${order.id}`
                    );

                select.value = order.status;

            });

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


function updateStatus(orderId) {

    const select =
        document.getElementById(`status-${orderId}`);

    const status = select.value;


	const loggedInUser =
	    JSON.parse(localStorage.getItem("loggedInUser"));

	fetch(`/api/orders/${orderId}/status?status=${encodeURIComponent(status)}&userId=${loggedInUser.id}`, {
	    method: "PUT"
	})

    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to update status");
        }

        return response.json();

    })

    .then(order => {

        alert(
            `Order #${order.id} status updated to ${order.status}`
        );

        loadOrders();

    })

    .catch(error => {

        console.error("Error:", error);

        alert("Unable to update order status.");

    });

}


function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleString();

}