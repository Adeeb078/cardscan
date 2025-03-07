document.getElementById("scan-btn").addEventListener("click", function() {
    let scannerContainer = document.getElementById("scanner-container");
    scannerContainer.style.display = "block";
    
    const html5QrCode = new Html5Qrcode("scanner-container");
    html5QrCode.start({ facingMode: "environment" }, {
        fps: 10,
        qrbox: 250
    }, qrCodeMessage => {
        fetchFromGoogleSheets(qrCodeMessage);
        html5QrCode.stop();
        scannerContainer.style.display = "none";
    }, errorMessage => {
        console.log(errorMessage);
    });
});

function fetchFromGoogleSheets(qrCode) {
    fetch(`https://script.google.com/macros/s/1D4JSP_96upS-5uJdowzWVgqkcdtqC3JkV_EhyXaJBsV-rJSb69fytY6s/exec?code=${qrCode}`)
    .then(response => response.json())
    .then(data => {
        if (data.valid) {
            alert(`Name: ${data.name}\nPlace: ${data.place}\nFare: ${data.fare}`);
            updateFare(qrCode);
        } else {
            alert("Invalid QR Code");
        }
    });
}

function updateFare(qrCode) {
    fetch(`https://script.google.com/macros/s/1D4JSP_96upS-5uJdowzWVgqkcdtqC3JkV_EhyXaJBsV-rJSb69fytY6s/exec`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: qrCode })
    });
}