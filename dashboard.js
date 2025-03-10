// Check if admin is logged in
if (!sessionStorage.getItem("adminLoggedIn")) {
    window.location.href = "admin.html";
}

// Logout function
document.querySelector(".logout-button").addEventListener("click", function () {
    sessionStorage.removeItem("adminLoggedIn");
    window.location.href = "admin.html";
});

document.addEventListener("DOMContentLoaded", function () {
    const addUserButton = document.getElementById("addUserButton");
    const addUserForm = document.getElementById("addUserForm");

    addUserButton.addEventListener("click", function () {
        addUserForm.style.display = "block";
    });

    window.closeForm = function () {
        addUserForm.style.display = "none";
    };

    window.submitUser = function () {
        let name = document.getElementById("userName").value;
        let place = document.getElementById("userPlace").value;
        let fare = document.getElementById("userFare").value;
        let imageFile = document.getElementById("userImage").files[0];

        if (!name || !place || !fare || !imageFile) {
            alert("Please fill all fields.");
            return;
        }

        let reader = new FileReader();
        reader.onload = function (event) {
            let imageData = event.target.result;
            let userData = { name, place, fare, image: imageData };

            fetch("https://script.google.com/macros/s/AKfycbw7EHveqYSQHbc4Ui95ZDgM3-7s4DHwK2L4sTTvEV0pIMAM-7_Rscy_cZJBAqWpA4OX/exec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            })
            .then(response => response.text())
            .then(data => {
                console.log("User added:", data);
                generateQRCode(data); // Generate QR code
            })
            .catch(error => console.error("Error adding user:", error));
        };

        reader.readAsDataURL(imageFile);
    };

    function generateQRCode(userCode) {
        let qrCanvas = document.getElementById("qrCanvas");
        let qr = new QRCode(qrCanvas, {
            text: userCode,
            width: 200,
            height: 200
        });

        document.getElementById("qrCodeContainer").style.display = "block";
    }

    window.downloadQRCode = function () {
        let canvas = document.getElementById("qrCanvas").querySelector("canvas");
        let link = document.createElement("a");
        link.download = "user_qr.png";
        link.href = canvas.toDataURL();
        link.click();
    };
});
