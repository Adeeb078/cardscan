document.addEventListener("DOMContentLoaded", function () {
    const scanButton = document.getElementById("scanButton");
    const qrBox = document.getElementById("qr-box");

    if (scanButton) {
        scanButton.addEventListener("click", startQRScanner);
    }

    function startQRScanner() {
        qrBox.innerHTML = ""; // Clear previous content

        const html5QrCode = new Html5Qrcode("qr-box");
        html5QrCode.start(
            { facingMode: "environment" },  // Use rear camera
            { fps: 10, qrbox: 250 },
            (decodedText) => {
                console.log("Scanned QR Code:", decodedText);
                html5QrCode.stop();
                checkUserData(decodedText);
            },
            (errorMessage) => {
                console.log("Scanning...", errorMessage);
            }
        ).catch(err => console.error("Camera error:", err));
    }

    function checkUserData(qrCode) {
        const sheetId = "https://docs.google.com/spreadsheets/d/1E0s2pWiJySU6j_KCl9Y4OkM-s4akEoH69QLVNaRzOgc/edit?usp=sharing";
        const apiKey = "AIzaSyAmh1AvPm_ow-U8Z4oP8e4XCinirctWH_A";
        const sheetName = "Sheet1";

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const rows = data.values;
                let user = rows.find(row => row[0] === qrCode);

                if (user) {
                    let userData = {
                        code: user[0],
                        name: user[1],
                        place: user[2],
                        fare: parseInt(user[3]),
                        totalFare: parseInt(user[4]) + parseInt(user[3]), // Increment total fare
                        image: user[5]
                    };

                    updateTotalFare(userData);
                    showUserPopup(userData);
                } else {
                    alert("Invalid QR Code!");
                }
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    function updateTotalFare(userData) {
        const apiUrl = "https://script.google.com/macros/s/AKfycbw7EHveqYSQHbc4Ui95ZDgM3-7s4DHwK2L4sTTvEV0pIMAM-7_Rscy_cZJBAqWpA4OX/exec"; // Replace with your Apps Script Web App URL

        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: userData.code,
                totalFare: userData.totalFare
            })
        })
        .then(response => response.text())
        .then(data => console.log("Updated fare:", data))
        .catch(error => console.error("Error updating fare:", error));
    }

    function showUserPopup(user) {
        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.innerHTML = `
            <div class="popup-content">
                <img src="${user.image}" alt="User Photo" width="100">
                <h2>${user.name}</h2>
                <p>Place: ${user.place}</p>
                <p>Fare: ₹${user.fare}</p>
                <p>Total Fare: ₹${user.totalFare}</p>
                <button onclick="closePopup()">Close</button>
            </div>
        `;
        document.body.appendChild(popup);
    }

    window.closePopup = function () {
        document.querySelector(".popup").remove();
    };
});

