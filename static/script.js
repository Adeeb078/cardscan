document.getElementById("scanButton").addEventListener("click", function () {
    const qrBox = document.getElementById("qr-box");
    qrBox.innerHTML = ""; // Clear previous content

    const qrScanner = new Html5QrcodeScanner("qr-box", { fps: 10, qrbox: 250 });
    
    qrScanner.render(decodedText => {
        fetch(`/scan_qr`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ admission_number: decodedText })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showPopup("Error", "Invalid QR Code!", "red");
            } else {
                showPopup("Success", `Scanned ${data.message}`, "green");
            }
            qrScanner.clear();
            qrBox.innerHTML = `<h1>Scan QR Code</h1><button id="scanButton">Start Scan</button>`;
        })
        .catch(() => {
            showPopup("Error", "Invalid QR Code!", "red");
            qrScanner.clear();
            qrBox.innerHTML = `<h1>Scan QR Code</h1><button id="scanButton">Start Scan</button>`;
        });
    });
});

function showPopup(title, message, color) {
    const popupContainer = document.getElementById("popup-container");
    const popup = document.getElementById("popup");
    popup.innerHTML = `
        <div class="popup-content">
            <h2 style="color: ${color};">${title}</h2>
            <p>${message}</p>
        </div>`;
    popup.style.display = "block";

    setTimeout(() => {
        popup.style.display = "none";
    }, 3000); // Hide after 3 seconds
}

function closePopup() {
    document.querySelector(".popup").remove();
}
