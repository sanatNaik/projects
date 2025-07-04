document.getElementById('logout-button').addEventListener('click',() => {
    console.log("yoyo");
    document.getElementById("logout-button").style.display = "none";
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    window.location.href = "/frontend/index.html"
    }
);
window.onload = () => {
    const isLoggedIn = localStorage.getItem("loggedIn");

    if (isLoggedIn === 'true') {
        document.getElementById('logout-button').style.display = "block"; // Show the button if logged in
    } else {
        document.getElementById('logout-button').style.display = "none"; // Hide the button if not logged in
    }
};