document.addEventListener("DOMContentLoaded", function () {
    const scanButton = document.getElementById("scanButton");

    if (scanButton) {
        scanButton.addEventListener("click", startQRScanner);
    }

    function startQRScanner() {
        const qrBox = document.getElementById("qr-box");
        qrBox.innerHTML = ""; // Clear previous content
    
        const video = document.createElement("video");
        video.style.width = "100%";  // Adjust size
        video.style.height = "auto";
        qrBox.appendChild(video);
    
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(function (stream) {
                video.srcObject = stream;
                video.setAttribute("playsinline", true);
                video.play();
            })
            .catch(err => console.error("Error accessing camera:", err));
    }    

    function checkUserData(qrCode) {
        fetch("data.json")
            .then(response => response.json())
            .then(users => {
                let user = users.find(person => person.code === qrCode);

                if (user) {
                    user.total_fare += user.fare; // Increment the total_fare
                    updateDataFile(users);
                    showUserPopup(user);
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

    function updateDataFile(users) {
        fetch("update_data.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(users)
        }).then(response => response.json())
          .then(data => console.log("Database updated:", data))
          .catch(error => console.error("Error updating data:", error));
    }
});
