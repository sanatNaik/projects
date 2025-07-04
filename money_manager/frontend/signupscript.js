document.getElementById('submit-button2').addEventListener('click', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username2').value;
    const password = document.getElementById('password2').value;

    const res = await fetch('http://localhost:3000/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });

    const data = await res.json();

    if (data.exists) {
        alert("Username already exists. Please login.");
        window.location.href = "/frontend/login.html";
    } else {
        // Now verify password (optional or via another /login endpoint)
        const addres = await fetch('http://localhost:3000/add-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username,password })
        });
    
        const adddata = await addres.json();
        console.log(adddata);
        if(adddata.success){
            alert("User registered. You can now login");
            window.location.href = "/frontend/login.html"
        }
        else{
            alert("Couldnt add user");
        }
        // Redirect to dashboard or call /login API
    }
});
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