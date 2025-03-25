let API_BASE = "";

fetch("/get_api_url")
    .then(response => response.json())
    .then(data => {
        API_BASE = data.api_url;
        console.log("API URL Loaded:", API_BASE);
        loadUsers(); // Ensure users load only after API is set
    })
    .catch(error => console.error("Failed to load API URL:", error));

document.addEventListener("DOMContentLoaded", function () {
    loadUsers();

    document.getElementById("addUserButton").addEventListener("click", function () {
        document.getElementById("addUserPopup").style.display = "block";
    });

    document.getElementById("submitUser").addEventListener("click", function () {
        const userData = {
            admission_number: document.getElementById("admission_number").value,
            name: document.getElementById("name").value,
            place: document.getElementById("place").value,
            branch: document.getElementById("branch").value,
            semester: document.getElementById("semester").value,
            fixed_fare: parseInt(document.getElementById("fixed_fare").value)
        };

        fetch("/add_user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadUsers();
            document.getElementById("addUserPopup").style.display = "none";
        })
        .catch(error => console.error("Error adding user:", error));
    });
});

function deleteUser(admissionNumber) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    fetch(`${API_BASE}/delete_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admission_number: admissionNumber })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadUsers(); // Refresh the user list
    })
    .catch(error => console.error("Error deleting user:", error));
}

function loadUsers() {
    fetch(`${API_BASE}/get_users`)
        .then(response => response.json())
        .then(users => {
            const tableBody = document.querySelector("#userTable tbody");
            tableBody.innerHTML = "";

            users.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.admission_number}</td>
                    <td>${user.name}</td>
                    <td>${user.place}</td>
                    <td>${user.branch}</td>
                    <td>${user.semester}</td>
                    <td>₹${user.fixed_fare}</td>
                    <td>₹${user.total_fare}</td>
                    <td><button onclick="resetFare('${user.admission_number}')">Paid</button></td>
                    <td><img src="${API_BASE}/static/qrcodes/${user.admission_number}.png" alt="QR Code" width="50"></td>
                    <td><button onclick="deleteUser('${user.admission_number}')">Delete</button></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error loading users:", error));
}

function resetFare(admissionNumber) {
    fetch(`${API_BASE}/reset_fare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admission_number: admissionNumber })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadUsers();
    })
    .catch(error => console.error("Error resetting fare:", error));
}

document.getElementById("logout").addEventListener("click", function () {
    window.location.href = "/"; // Redirect back to main page
});
