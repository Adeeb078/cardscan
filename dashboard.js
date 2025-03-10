document.addEventListener("DOMContentLoaded", function () {
    function loadUsers() {
        if (typeof users === "undefined") {
            console.error("Users data not loaded");
            return;
        }

        const tableBody = document.querySelector("#userTable tbody");
        tableBody.innerHTML = "";

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="qr_codes/${user.code}.png" alt="QR Code" width="50"></td>
                <td>${user.name}</td>
                <td>${user.place}</td>
                <td>₹${user.fare}</td>
                <td>₹${user.total_fare}</td>
                <td><img src="${user.image}" alt="User Image" width="50"></td>
            `;
            tableBody.appendChild(row);
        });
    }

    loadUsers();
});
