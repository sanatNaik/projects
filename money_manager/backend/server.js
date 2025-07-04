const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const connection = require('./db');
const port = 3000;

app.use(cors())
app.use(express.json());

// app.use(cors({
//     origin: 'http://127.0.0.1:5500',  // or wherever your frontend is
//     credentials: true
// }));

// app.use(session({
//     secret: 'y8G@!2kxP1tA9zM$3fW4&bE7uCqRzD0L', // keep this strong and hidden in real projects
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         httpOnly:true,
//         secure: false,           // false for HTTP, true for HTTPS
//         sameSite: 'lax'          
//     }
// }));

//login-sigup use

app.post('/check-user',(req,res) => {
    const {username} = req.body;
    const sql = "select * from users where BINARY username= ?";
    connection.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ error: err });

        if (results.length > 0) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    });
})

app.post('/add-user',(req,res) => {
    const {username,password} = req.body;
    const sql = "INSERT INTO users(username,password_hash) values(?,?);";
    connection.query(sql,[username,password],(err,results) => {
        if(err){
            console.error(err);
            return res.status(500).send(err);
        }
        res.status(200).json({ success:true,message: "Signup successful" });
    });
});

app.post('/check-user-password',(req,res) => {
    const {username,password} = req.body;
    const sql = "select * from users where BINARY username= ? AND BINARY password_hash= ?";
    connection.query(sql, [username,password], (err, results) => {
        if (err) return res.status(500).json({ error: err });

        if (results.length > 0) {
            console.log(req.session) ;
            return res.status(200).json({ status:'ok',user_name:username });
        } else {
            return res.status(200).json({ success: false });
        }
    });
})

// app.get('/check-auth', (req, res) => {
//     const loggedIn = localStorage.getItem('loggedIn');
//     if () {
//         res.json({ authenticated: true, user: req.session.user });
//     } else {
//         res.json({ authenticated: false });
//     }
// });
//changed
app.post('/get-monthly',(req,res) => {
    const {username} = req.body;
    const sql = "SELECT type,SUM(amount) FROM user_data where date >= CURRENT_DATE - INTERVAL 30 DAY AND user_id=(select id from users where binary username = ?) GROUP BY type;";
    connection.query(sql,[username],(err,results) => {
        if(err) return res.status(500).send(err);
        res.json(results);
    });
})

//updated
app.post('/add-data',(req,res) => {
    const {username,Type,Account,Amount,Tag,Date} = req.body;
    const getUserIdQuery = "SELECT id FROM users WHERE username = ?";
    connection.query(getUserIdQuery, [username], (err, result) => {
        if (err) return res.status(500).json({ error: "Error fetching user ID", details: err });

        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = result[0].id;
        console.log(userId);
        const insertQuery = "INSERT INTO user_data(user_id,type,amount,account,tag,date) VALUES (?, ?, ?, ? ,? , ?)";
        connection.query(insertQuery, [userId,Type,Amount,Account,Tag,Date], (err, results) => {
            if (err) {
                console.error("error inserting account data",err);
                return res.status(500).json({ error: "Error inserting account data", details: err });
            }
            return res.status(200).json({ success: true, message: "Account added successfully" });
        });
    });
});


//updated

app.post('/add-account-data', (req, res) => {
    const { username, Bank_Name, Balance } = req.body;
    
    const getUserIdQuery = "SELECT id FROM users WHERE username = ?";
    connection.query(getUserIdQuery, [username], (err, result) => {
        
        if (err){
            console.error("Error fetching user ID:", err);
            return res.status(500).json({ error: "Error fetching user ID", details: err });
        } 
        
        if (result.length === 0) {
            console.error("error user not found");
            return res.status(404).json({ error: "User not found" });
        }

        const userId = result[0].id;
        
        const insertQuery = "INSERT INTO user_account(user_id, bankname, balance) VALUES (?, ?, ?)";
        connection.query(insertQuery, [userId, Bank_Name, Balance], (err, results) => {
            if (err) {
                console.error("error inserting data",err);
                return res.status(500).json({ error: "Error inserting account data", details: err });
            }
            return res.status(200).json({ success: true, message: "Account added successfully" });
        });
    });
});

//changed
app.post('/update-data',(req,res) => {
    const username = req.body.username;
    const BANK_NAME = req.body.Account;
    const type = req.body.Type;
    const AMOUNT = parseFloat(req.body.Amount);
    console.log(BANK_NAME);
    if(type === "Expense"){
        const sql = "UPDATE user_account set balance = balance - (?) where BINARY bankname = (?) AND user_id = (select id from users where binary username = ?)";
        connection.query(sql,[AMOUNT,BANK_NAME,username],(err,results) =>{
            if(err) return res.status(500).send(err);
            return res.status(200).send({success:true,message: "Balance updated successfully", results });
        })
    }
    else{
        const sql = "UPDATE user_account set balance = balance + (?) where BINARY bankname = (?) AND user_id = (select id from users where binary username = ?)";
        connection.query(sql,[AMOUNT,BANK_NAME,username],(err,results) =>{
            if(err) return res.status(500).send(err);
            return res.status(200).send({success:true, message: "Balance updated successfully", results });
        })
    }
})

//changed
app.post('/load-account-data',(req,res) => {
    const {username} = req.body;
    const sql = "SELECT bankname,balance FROM user_account where user_id = (select id from users where binary username = ?)";
    connection.query(sql,[username],(err,results) => {
        if(err) {
            res.status(500).json({ error: err.message});
        }
        else{
            res.json(results);
        }
    });
})

//changed
app.post('/load-record-data',(req,res) => {
    const {username} = req.body;
    const sql = "SELECT type,amount,account,tag,date FROM user_data where user_id = (select id from users where binary username = ?)";
    connection.query(sql,[username],(err,results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
})
app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
});