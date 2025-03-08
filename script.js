function fetchFromJSON(qrCode) {
    fetch("data.json")  // Load the local JSON file
    .then(response => response.json())
    .then(data => {
        let user = data.find(entry => entry.code === qrCode);
        if (user) {
            document.getElementById("popup").innerHTML = `
                <img src="${user.profiles}" width="150">
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Place:</strong> ${user.place}</p>
                <p><strong>Fare:</strong> ₹${user.fare}</p>
            `;
            document.getElementById("popup-container").style.display = "block";
        } else {
            alert("Invalid QR Code");
        }
    })
    .catch(error => console.error("Error loading data:", error));
}

document.getElementById("scan-btn").addEventListener("click", function() {
    let scannerContainer = document.getElementById("scanner-container");
    scannerContainer.style.display = "block";

    const html5QrCode = new Html5Qrcode("scanner-container");
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        qrCodeMessage => {
            fetchFromJSON(qrCodeMessage);  // Fetch details after scanning
            html5QrCode.stop();
            scannerContainer.style.display = "none";
        },
        errorMessage => {
            console.log("QR Scan Error:", errorMessage);
        }
    );
});

