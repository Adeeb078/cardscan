// Ensure admin credentials are stored in localStorage (Only needed once)
if (!localStorage.getItem("adminData")) {
    localStorage.setItem("adminData", JSON.stringify({
        username: "admin",
        password: "1234"
    }));
}

document.getElementById("loginButton").addEventListener("click", function () {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Retrieve stored admin credentials
    let storedData = JSON.parse(localStorage.getItem("adminData"));

    if (storedData.username === username && storedData.password === password) {
        alert("Login successful!");
        sessionStorage.setItem("adminLoggedIn", "true");
        window.location.href = "dashboard.html"; // Redirect to dashboard
    } else {
        alert("Invalid username or password!");
    }
});

document.getElementById("canButton").addEventListener("click", function () {
    window.location.href = "index.html"; // Redirect back to main page
});

// Redirect to login if admin is not logged in
if (window.location.pathname.includes("dashboard.html")) {
    if (sessionStorage.getItem("adminLoggedIn") !== "true") {
        alert("Please login first!");
        window.location.href = "admin.html";
    }
}
