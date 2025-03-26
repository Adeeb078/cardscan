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
    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popup-title");
    const popupMessage = document.getElementById("popup-message");
    const loadingBar = document.getElementById("loading-bar-container");

    popupTitle.textContent = title;
    popupMessage.textContent = message;
    popup.style.backgroundColor = color;
    popup.style.display = "block";
    loadingBar.style.display = "block";

    // Start the reverse loading animation
    const progressBar = document.getElementById("loading-bar");
    progressBar.style.width = "100%";  // Start full
    setTimeout(() => {
        progressBar.style.width = "0%";  // Shrink to empty in 2s
    }, 10);

    // Hide popup after 2 seconds
    setTimeout(() => {
        popup.style.display = "none";
        loadingBar.style.display = "none";
    }, 2000);
}