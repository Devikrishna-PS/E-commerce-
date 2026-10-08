const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value;

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;


        const user = {

            name: name,
            email: email,
            password: password,
            role: "USER"

        };


        fetch("/api/users/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)

        })

        .then(response => response.json())

        .then(data => {

            const message =
                document.getElementById("registerMessage");


            if (data === null) {

                message.innerHTML = `
                    <div class="alert alert-danger">
                        Email already registered.
                    </div>
                `;

                return;
            }


            message.innerHTML = `
                <div class="alert alert-success">
                    Account created successfully!
                    <br>
                    You can now login.
                </div>
            `;


            registerForm.reset();

        })

        .catch(error => {

            console.error("Error:", error);

            document.getElementById("registerMessage").innerHTML = `
                <div class="alert alert-danger">
                    Registration failed. Please try again.
                </div>
            `;

        });

    });

}
const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;


        const loginUser = {

            email: email,
            password: password

        };


        fetch("/api/users/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(loginUser)

        })

        .then(response => response.json())

        .then(user => {

            const message =
                document.getElementById("loginMessage");


            if (user === null) {

                message.innerHTML = `
                    <div class="alert alert-danger">
                        Invalid email or password.
                    </div>
                `;

                return;
            }


            // Save logged-in user
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(user)
            );


            message.innerHTML = `
                <div class="alert alert-success">
                    Login successful!
                </div>
            `;


			// Go to home page
			setTimeout(function() {

			    window.location.href = "index.html";

			}, 800);

        })

        .catch(error => {

            console.error("Error:", error);

            document.getElementById("loginMessage").innerHTML = `
                <div class="alert alert-danger">
                    Login failed. Please try again.
                </div>
            `;

        });

    });

}