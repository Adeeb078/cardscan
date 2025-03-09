// Store admin credentials in localStorage (Only needed once)
if (!localStorage.getItem("adminData")) {
    localStorage.setItem("adminData", JSON.stringify({
        username: "admin",
        password: "1234"
    }));
}

document.getElementById("loginButton").addEventListener("click", function () {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Retrieve admin credentials from localStorage
    let storedData = JSON.parse(localStorage.getItem("adminData"));

    if (storedData.username === username && storedData.password === password) {
        alert("Login successful!");
        sessionStorage.setItem("adminLoggedIn", "true");
        window.location.href = "dashboard.html"; // Redirect to dashboard
    } else {
        alert("Invalid username or password!");
    }
});
