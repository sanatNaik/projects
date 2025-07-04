
button_element = document.getElementById('add_button');
account_button_element = document.getElementById('add_account_button');


function addToBackend(inData){
    fetch("http://localhost:3000/add-data",{
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(inData)
    })
    .then(res => res.json())
    .then(data => {
        console.log("data added");
        //const outputDiv = document.getElementById('output-box');
        //outputDiv.innerHTML = JSON.stringify(data,null,2);
    })
    .catch(err => console.error("error fetching data:",err)); 
}

function updateAccountBackend(inUpData){
    fetch("http://localhost:3000/update-data",{
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(inUpData)
    })
    .then(res => res.json())
    .then(data => {
        console.log("data updated");
    })
    .catch(err => console.error("error fetching data:",err));
}

function addAccountBackend(inputAccData){
    console.log(inputAccData);
    fetch("http://localhost:3000/add-account-data",{
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(inputAccData)
    })
    .then(res => res.json())
    .then(data => {
        console.log("data added");
    })
    .catch(err => console.error("error fetching data:",err));
}
async function loadData(username) {
    try {
        const response = await fetch("http://localhost:3000/load-record-data",{
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({username})
        });
        const data = await response.json();
        const reversed = data.reverse();
        document.getElementById('output-box').innerHTML='';
        reversed.forEach(item=>addRecordToDisplay(item));
    } 
    catch (error) {
        console.error('Error fetching data:', error);
    }
}
async function loadMonthly(username) {
    try {
        const response = await fetch("http://localhost:3000/get-monthly",{
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({username})
        });
        const data = await response.json();
        const monthlyIncome = data.find(item => item.type === 'Income')?.["SUM(amount)"] || 0;
        const monthlyExpense = data.find(item => item.type === 'Expense')?.["SUM(amount)"] || 0;
        document.getElementById('income-monthly').innerHTML=`₹${monthlyIncome}`;
        document.getElementById('expense-monthly').innerHTML = `₹${monthlyExpense}`;
    } 
    catch (error) {
        console.error('Error fetching data:', error);
    }
}
async function loadAccountData(username) {
    try {
        const response = await fetch("http://localhost:3000/load-account-data",{
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({username})
        });
        const accountData = await response.json();
        const reversedAcc = accountData.reverse();
        document.getElementById('account-Ip-Box').innerHTML='';
        reversedAcc.forEach(item => addAccountToDisplay(item));
        document.getElementById('account-list').innerHTML='';
        reversedAcc.forEach(item => addBankToList(item.bankname));
    }
    catch(error){
        console.error('error fetching data:',error);
    }
}

function addBankToList(bank_Ip_name){
    const ip_list = document.getElementById('account-list');
    
    if(document.getElementById(bank_Ip_name)){
        console.log("item already exists");
        return;
    }
    else{
        ip_list.insertAdjacentHTML('beforeend',`
            <option id = "${bank_Ip_name}" value="${bank_Ip_name}">
        `);
    }
}
function getInData(){
    return {
        username: localStorage.getItem('username'),
        Type: document.querySelector('input[name="type_selector"]:checked').value,
        Account: document.getElementById('account').value,
        Amount: parseFloat(document.getElementById('amount').value),
        Tag: document.getElementById('tag').value,
        Date: document.getElementById('date').value
    };
}
function getAccountData(){
    return {
        username: localStorage.getItem('username'),
        Bank_Name: document.getElementById('bank_name').value,
        Balance: parseFloat(document.getElementById('account_balance').value)
    }
}
function resetData(){
    document.getElementById('it-block-form').reset();
}
function resetAccData(){
    document.getElementById('it-block-form-2').reset();
}
async function check(){
    const username =  localStorage.getItem('username');
    const typeSelected = document.querySelector('input[name="type_selector"]:checked');
    const accountSelected = document.getElementById('account').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    console.log(typeSelected);
    if(typeSelected && typeSelected.value === "Expense"){
        try{
            const response = await fetch("http://localhost:3000/load-account-data",{
                method:"POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({username})
            });
            const accountData = await response.json();
            const selectedAccount = accountData.find(acc => acc.bankname === accountSelected);
            console.log(selectedAccount);
            if(parseFloat(amount) > parseFloat(selectedAccount.balance)){
                document.getElementById('error_message').textContent = 'Insufficient Balance';
                return false;
            }
            else{
                document.getElementById('error_message').textContent = '';
            }
        }
        catch(error){
            console.error('error fetching data:',error);
        }
    }
    
    if(!typeSelected || !accountSelected || !amount || !date){
        console.log(accountSelected);
        return false;
    }
    else{
        return true;
    }
}
function check_account_button(){
    const bank_input = document.getElementById('bank_name').value;
    const balance_input = document.getElementById('account_balance').value;
    if(!bank_input || !balance_input){
        return false;
    }
    else{
        return true;
    }
}
function validateAccountInput() {
    const accountInput = document.getElementById("account");
    const accountList = [...document.querySelectorAll("#account-list option")].map(option => option.value);

    return accountList.includes(accountInput.value); // Returns true/false
}
//adding event listener on expenditure add form
button_element.addEventListener('click',async(event) => {
    event.preventDefault();
    const accvalid = validateAccountInput();
    if(!accvalid){
        const errormess = document.getElementById('error_message').textContent = "Invalid account entered";
    }
    else{
        const isvalid = await check();
        if(isvalid){
        const inputData = getInData();
        // addRecordToDisplay(inputData);
        addToBackend(inputData);
        updateAccountBackend(inputData);
        console.log("back to function");
        resetData();
        loadData(inputData.username); 
        loadAccountData(inputData.username);
        loadMonthly(inputData.username);
        }else{
            console.log("couldnt add data");
        }
    }
    });

//adding event listener on account add form
account_button_element.addEventListener('click',(event)=>{
    event.preventDefault();
    if(check_account_button()){
        const inputAccData = getAccountData();
        addAccountBackend(inputAccData);
        resetAccData();
        loadAccountData(inputAccData.username);
        loadMonthly(inputAccData.username);
    }
    else{
        console.log("Coudnt add account data");
    }
})

function addRecordToDisplay(data) {
    const container = document.getElementById('output-box');
    
    const div = document.createElement('div');
    div.className = 'record-item';
    const formattedDate = new Date(data.date).toISOString().split('T')[0];
    if(!data.tag){
        data.tag = "No Tag";
    }
    if(data.type == "Expense"){
        div.innerHTML =`
        <div style="font-size:2rem; color:red;">-₹${data.amount}</div>
        <div>${data.account}</div>
        <div>${data.tag}</div>
        <div>${formattedDate}</div>
    `;
    }
    else if(data.type == "Income"){
        div.innerHTML =`
        <div style="font-size:2rem; color:green;">+₹${data.amount}</div>
        <div>${data.account}</div>
        <div>${data.tag}</div>
        <div>${formattedDate}</div>
    `;
    }
    container.appendChild(div);
    return;
}

function addAccountToDisplay(ipData){
    const container2 = document.getElementById('account-Ip-Box');
    console.log(ipData);
    const div2 = document.createElement('div');
    div2.className = 'account-record-item';
    console.log(ipData);
    div2.innerHTML =`
        <div>${ipData.bankname}</div>
        <div>₹${ipData.balance}</div>
    `;
    console.log(div2);
    container2.appendChild(div2);
    return;
}
window.addEventListener('DOMContentLoaded', async () => {
    const loggedIn = localStorage.getItem('loggedIn');
    const username = localStorage.getItem('username');
    console.log(loggedIn,username);
    if (loggedIn === 'true' && username) {
        console.log("User is authenticated. Running dashboard functions...");
        runDashboardFeatures(username);
    } else {
        alert("You must be logged in to access the dashboard.");
        window.location.href = "/frontend/login.html";
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
// Function to initialize dashboard functionality
function runDashboardFeatures(username) {
    loadData(username);
    loadAccountData(username);
    loadMonthly(username);
    // Any other dashboard functions you need
}


