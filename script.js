let expenses = [];
let goals = {};

// Function to Add Expense
function addExpense() {
    const desc = document.getElementById("desc").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    let category = document.getElementById("category").value;
    
    if (category === "Custom") {
        category = prompt("Enter custom category name:");
        if (!category) return;
    }

    if (!desc || !amount || !date) {
        alert("Please enter all fields!");
        return;
    }

    expenses.push({ desc, amount, date, category });
    updateUI();
}

// Enter Key Navigation
document.getElementById("desc").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("amount").focus();
    }
});

document.getElementById("amount").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("date").focus();
    }
});

document.getElementById("date").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("category").focus();
    }
});

document.getElementById("category").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addExpense();
    }
});

// Function to Set Multiple Goals
function setGoal() {
    let amount = parseFloat(document.getElementById("goal-amount").value);
    let period = document.getElementById("goal-period").value;
    
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid goal amount!");
        return;
    }

    goals[period] = amount; // Save goal for selected period
    updateGoalsUI();
}

// Function to Display All Goals
function updateGoalsUI() {
    let goalList = document.getElementById("goal-list");
    goalList.innerHTML = ""; // Clear previous list

    for (let period in goals) {
        let goalValue = goals[period];
        if (goalValue > 0) {
            let li = document.createElement("li");
            li.innerText = `${period}: ₹${goalValue}`;
            goalList.appendChild(li);
        }
    }
}

// Function to Update UI
function updateUI() {
    let totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById("balance").innerText = totalExpense;
    updateStatus(totalExpense);
    renderExpenses();
}

// Function to Update Status Based on Goals
function updateStatus(totalExpense) {
    let statusEl = document.getElementById("status");
    let warning = "✔ Within Limit";
    let statusClass = "green";

    for (let period in goals) {
        let goalValue = goals[period];
        if (goalValue > 0 && totalExpense > goalValue) {
            warning = "❌ Over Limit!";
            statusClass = "red";
        } else if (goalValue > 0 && totalExpense > goalValue * 0.6) {
            warning = "⚠ Warning: 60%+ Spent!";
            statusClass = "yellow";
        }
    }

    statusEl.innerText = warning;
    statusEl.className = statusClass;
}

// Function to Render Expenses in a List
function renderExpenses() {
    const list = document.getElementById("expense-list");
    list.innerHTML = "";
    expenses.forEach(exp => {
        const li = document.createElement("li");
        li.innerText = `${exp.date} - ${exp.desc}: ₹${exp.amount} (${exp.category})`;
        list.appendChild(li);
    });
}
