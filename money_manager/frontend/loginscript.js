document.getElementById('submit-button').addEventListener('click', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('http://localhost:3000/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
        // credentials:'include'
    });

    const data = await res.json();

    if (!data.exists) {
        alert("Username not found. Please sign up.");
        window.location.href = "/frontend/signup.html";
    } else {
        // Now verify password (optional or via another /login endpoint)
        
        // Redirect to dashboard or call /login API
        const loginres = await fetch('http://localhost:3000/check-user-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username,password }),
            // credentials:'include'
        });
        const recieved_data = await loginres.json();
        if(recieved_data.status === 'ok'){
            document.getElementById("logout-button").style.display = "block";
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', recieved_data.user_name); // Or any identifier
            alert("Welcome back! Logging in...");
            // const loggedInstatus = localStorage.getItem('loggedIn');
            // const usernamestatus = localStorage.getItem('username');
            // console.log(loggedInstatus,usernamestatus);
            window.location.href = "/frontend/dashboard.html";
        }
        else{
            alert("Incorrect password. Please try again");
        }
    }
});
document.getElementById('logout-button').addEventListener('click',() => {
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