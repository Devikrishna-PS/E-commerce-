document.addEventListener("DOMContentLoaded", function() {

    checkAdmin();

    loadProducts();

});


function checkAdmin() {

    const user =
        JSON.parse(localStorage.getItem("loggedInUser"));


    if (!user) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }


    if (user.role !== "ADMIN") {

        alert("Access denied. Admin only.");

        window.location.href = "index.html";

        return;

    }

}


function loadProducts() {

    fetch("/api/products")

        .then(response => response.json())

        .then(products => {

            const container =
                document.getElementById("productContainer");


            container.innerHTML = "";


            products.forEach(product => {

                container.innerHTML += `

                    <div class="col-md-4 mb-4">

                        <div class="card h-100 shadow-sm">

                            <div class="card-body">

                                <h5>
                                    ${product.name}
                                </h5>

                                <p>
                                    ${product.description}
                                </p>

                                <p>
                                    <strong>
                                        Price:
                                    </strong>
                                    ₹${product.price}
                                </p>

                                <p>
                                    <strong>
                                        Stock:
                                    </strong>
                                    ${product.stock}
                                </p>

                                <p>
                                    <strong>
                                        Category:
                                    </strong>
                                    ${product.category.name}
                                </p>


                                <button
                                    class="btn btn-danger"
                                    onclick="deleteProduct(${product.id})">

                                    Delete

                                </button>

                            </div>

                        </div>

                    </div>

                `;

            });

        })

        .catch(error => {

            console.error("Error:", error);

            document.getElementById("productContainer").innerHTML = `

                <div class="alert alert-danger">

                    Unable to load products.

                </div>

            `;

        });

}


document.getElementById("productForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const categoryId =
            Number(document.getElementById("categoryId").value);


        const product = {

            name:
                document.getElementById("name").value,

            description:
                document.getElementById("description").value,

            price:
                Number(document.getElementById("price").value),

            stock:
                Number(document.getElementById("stock").value),

            imageUrl:
                document.getElementById("imageUrl").value,

            category: {

                id: categoryId

            }

        };


		const loggedInUser =
		    JSON.parse(localStorage.getItem("loggedInUser"));

		fetch(`/api/products?userId=${loggedInUser.id}`, {
		    method: "POST",
		    headers: {"Content-Type":"application/json"},
		    body: JSON.stringify(product)
		})

        .then(response => response.json())

        .then(data => {

            document.getElementById("message").innerHTML = `

                <div class="alert alert-success">

                    Product added successfully!

                </div>

            `;


            document.getElementById("productForm").reset();


            loadProducts();

        })

        .catch(error => {

            console.error("Error:", error);

            document.getElementById("message").innerHTML = `

                <div class="alert alert-danger">

                    Unable to add product.

                </div>

            `;

        });

    });


function deleteProduct(productId) {

    if (!confirm("Are you sure you want to delete this product?")) {

        return;

    }


	const loggedInUser =
	    JSON.parse(localStorage.getItem("loggedInUser"));

	fetch(`/api/products/${productId}?userId=${loggedInUser.id}`, {
	    method: "DELETE"
	})

    .then(() => {

        alert("Product deleted successfully!");

        loadProducts();

    })

    .catch(error => {

        console.error("Error:", error);

        alert("Unable to delete product.");

    });

}