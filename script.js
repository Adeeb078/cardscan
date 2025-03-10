document.addEventListener("DOMContentLoaded", function () {
    function checkUserData(qrCode) {
        fetch("data.json")
            .then(response => response.json())
            .then(users => {
                let user = users.find(person => person.code === qrCode);
                if (user) {
                    user.total_fare += user.fare; // Increment total fare
                    showUserPopup(user);
                    saveUpdatedData(users); // Save updated fare locally
                } else {
                    alert("Invalid QR Code!");
                }
            })
            .catch(error => console.error("Error loading user data:", error));
    }

    function showUserPopup(user) {
        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.innerHTML = `
            <div class="popup-content">
                <img src="${user.image}" alt="User Photo">
                <h2>${user.name}</h2>
                <p>Place: ${user.place}</p>
                <p>Fare: ₹${user.fare}</p>
                <p>Total Fare: ₹${user.total_fare}</p>
                <button onclick="closePopup()">Close</button>
            </div>
        `;
        document.body.appendChild(popup);
    }

    window.closePopup = function () {
        document.querySelector(".popup").remove();
    };

    function saveUpdatedData(users) {
        localStorage.setItem("userData", JSON.stringify(users));
    }

    function loadSavedData() {
        const savedData = localStorage.getItem("userData");
        return savedData ? JSON.parse(savedData) : null;
    }

    // Load saved data on page load
    const savedUsers = loadSavedData();
    if (savedUsers) {
        console.log("Loaded saved user data:", savedUsers);
    }
});