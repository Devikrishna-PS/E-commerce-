document.addEventListener("DOMContentLoaded", function() {

    checkAdmin();

    loadUsers();

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


function loadUsers() {

	const loggedInUser =
	    JSON.parse(localStorage.getItem("loggedInUser"));

	fetch(`/api/users?userId=${loggedInUser.id}`)

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load users");
            }

            return response.json();

        })

        .then(users => {

            const container =
                document.getElementById("usersContainer");


            if (users.length === 0) {

                container.innerHTML = `
                    <div class="alert alert-info text-center">
                        No users found.
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

                                <th>ID</th>

                                <th>Name</th>

                                <th>Email</th>

                                <th>Role</th>

                            </tr>

                        </thead>

                        <tbody>

            `;


            users.forEach(user => {

                html += `

                    <tr>

                        <td>
                            ${user.id}
                        </td>

                        <td>
                            ${user.name}
                        </td>

                        <td>
                            ${user.email}
                        </td>

                        <td>

                            <span class="badge
                                ${user.role === "ADMIN"
                                    ? "bg-danger"
                                    : "bg-secondary"}">

                                ${user.role}

                            </span>

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

        })

        .catch(error => {

            console.error("Error:", error);

            document.getElementById("usersContainer").innerHTML = `

                <div class="alert alert-danger">

                    Unable to load users.

                </div>

            `;

        });

}