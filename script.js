document.getElementById("scanButton").addEventListener("click", function () {
    const qrScanner = new Html5QrcodeScanner("qr-box", { fps: 10, qrbox: 250 });

    qrScanner.render(decodedText => {
        fetch("/scan_qr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ admission_number: decodedText })
        }).then(response => response.json())
          .then(data => {
              alert(data.message);
              qrScanner.clear();
          }).catch(() => {
              alert("Invalid QR Code!");
          });
    });
});
