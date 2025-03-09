// Check if admin is logged in
if (!sessionStorage.getItem("adminLoggedIn")) {
    window.location.href = "admin.html";
}

// Logout function
document.querySelector(".logout-button").addEventListener("click", function () {
    sessionStorage.removeItem("adminLoggedIn");
    window.location.href = "admin.html";
});
