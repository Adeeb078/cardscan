document.getElementById("scanButton").addEventListener("click", function () {
    const qrBox = document.getElementById("qr-box");
    qrBox.innerHTML = ""; // Clear previous content

    const qrScanner = new Html5QrcodeScanner("qr-box", { fps: 5, qrbox: 250 });
    
    qrScanner.render((decodedText, decodedResult) => {
        qrScanner.clear(); // Stop scanning immediately after first successful scan
    
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
                showPopup("Success", `${data.message}`, "green");
            }
            qrScanner.clear();
            qrBox.innerHTML = `<h1>Scan QR Code</h1><button id="scanButton">Start Scan</button>`;
            // Reattach the scan button event listener
            document.getElementById("scanButton").addEventListener("click", arguments.callee);
        })
        .catch(() => {
            showPopup("Error", "Invalid QR Code!", "red");
            qrScanner.clear();
            qrBox.innerHTML = `<h1>Scan QR Code</h1><button id="scanButton">Start Scan</button>`;
        
            document.getElementById("scanButton").addEventListener("click", arguments.callee);
        });
    });
});

function showPopup(title, message, color) {
    let popup = document.getElementById("popup");
    if (!popup) return;

    popup.innerHTML = `
        <div class="popup-content" style="border: 2px solid ${color};">
            <h2 style="color: ${color}; margin: 0;">${title}</h2>
            <p>${message}</p>
        </div>`;
    
    popup.style.display = "block";

    setTimeout(() => {
        popup.style.display = "none";
    }, 2000); // Auto-hide after 2 seconds
}