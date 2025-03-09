function scanQRCode(qrCode) {
    fetch("http://127.0.0.1:5000/scan_qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: qrCode })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert("Invalid QR Code");
        } else {
            document.body.innerHTML += `
                <div class="popup">
                    <img src="${data.image}" alt="User Image">
                    <p>Name: ${data.name}</p>
                    <p>Place: ${data.place}</p>
                    <p>Fare: ${data.fare}</p>
                    <p>Total Fare: ${data.total_fare}</p>
                    <button onclick="closePopup()">Close</button>
                </div>`;
        }
    });
}

function closePopup() {
    document.querySelector(".popup").remove();
}
