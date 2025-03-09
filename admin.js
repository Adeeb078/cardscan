function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch("http://127.0.0.1:5000/admin_login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            document.getElementById("admin-dashboard").style.display = "block";
        } else {
            alert("Invalid credentials");
        }
    });
}

function fetchUsers() {
    fetch("http://127.0.0.1:5000/get_users")
    .then(response => response.json())
    .then(users => {
        let table = document.getElementById("userTable");
        users.forEach(user => {
            let row = table.insertRow();
            row.innerHTML = `<td>${user.code}</td><td>${user.name}</td><td>${user.place}</td><td>${user.fare}</td>
            <td><a href="http://127.0.0.1:5000/download_qr/${user.code}" download>Download QR</a></td>`;
        });
    });
}

function addUser() {
    let formData = new FormData();
    formData.append("code", document.getElementById("newCode").value);
    formData.append("name", document.getElementById("newName").value);
    formData.append("place", document.getElementById("newPlace").value);
    formData.append("fare", document.getElementById("newFare").value);
    formData.append("image", document.getElementById("newImage").files[0]);

    fetch("http://127.0.0.1:5000/add_user", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => alert(data.message || data.error));
}

document.getElementById("loginButton").addEventListener("click", function () {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch("admin.json")
        .then(response => response.json())
        .then(data => {
            if (data.username === username && data.password === password) {
                alert("Login successful!");
                sessionStorage.setItem("adminLoggedIn", "true");
                window.location.href = "dashboard.html"; // Redirect to dashboard
            } else {
                alert("Invalid username or password!");
            }
        })
        .catch(error => console.error("Error loading admin credentials:", error));
});
