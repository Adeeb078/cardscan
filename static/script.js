document.getElementById("scanButton").addEventListener("click", async function () {
    const qrBox = document.getElementById("qr-box");
    qrBox.innerHTML = ""; // Clear previous content

    try {
        const backCameraId = await getBackCameraId();
        if (!backCameraId) {
            showPopup("Error", "No back camera found!", "red");
            return;
        }

        const qrScanner = new Html5Qrcode("qr-box");
        qrScanner.start(
            backCameraId,
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
                processScan(qrScanner, decodedText);
            },
            (errorMessage) => {
                console.error("QR Scan Error:", errorMessage);
            }
        );
    } catch (error) {
        console.error("Camera Error:", error);
        showPopup("Error", "Camera access failed!", "red");
    }
});

// 📌 Function to get back camera ID
async function getBackCameraId() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const backCamera = devices.find(
        (device) => device.kind === "videoinput" && device.label.toLowerCase().includes("back")
    );
    return backCamera ? backCamera.deviceId : null;
}

// 📌 Process Scanned QR Code
function processScan(qrScanner, decodedText) {
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
        qrScanner.stop();
    })
    .catch(() => {
        showPopup("Error", "Scan Failed!", "red");
        qrScanner.stop();
    });
}

// 📌 Show Popup
function showPopup(title, message, color) {
    const popupContainer = document.getElementById("popup-container");
    const popup = document.getElementById("popup");

    popup.innerHTML = `<h2>${title}</h2><p>${message}</p>`;
    popup.style.backgroundColor = color;
    popupContainer.style.display = "block";

    setTimeout(() => {
        popupContainer.style.display = "none";
    }, 3000);
}
