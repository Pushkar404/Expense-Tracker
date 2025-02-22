let expenses = [];
let goalAmount = 0;
let goalPeriod = "-";
const ctxDaily = document.getElementById("expenseChartDaily").getContext("2d");
const ctxWeekly = document.getElementById("expenseChartWeekly").getContext("2d");
const ctxMonthly = document.getElementById("expenseChartMonthly").getContext("2d");

const dailyChart = new Chart(ctxDaily, {
    type: "bar",
    data: { labels: [], datasets: [{ label: "Daily Expenses", data: [], backgroundColor: "rgba(255, 99, 132, 0.2)", borderColor: "rgba(255, 99, 132, 1)", borderWidth: 1 }] },
    options: { scales: { y: { beginAtZero: true } } }
});

const weeklyChart = new Chart(ctxWeekly, {
    type: "bar",
    data: { labels: [], datasets: [{ label: "Weekly Expenses", data: [], backgroundColor: "rgba(54, 162, 235, 0.2)", borderColor: "rgba(54, 162, 235, 1)", borderWidth: 1 }] },
    options: { scales: { y: { beginAtZero: true } } }
});

const monthlyChart = new Chart(ctxMonthly, {
    type: "bar",
    data: { labels: [], datasets: [{ label: "Monthly Expenses", data: [], backgroundColor: "rgba(75, 192, 192, 0.2)", borderColor: "rgba(75, 192, 192, 1)", borderWidth: 1 }] },
    options: { scales: { y: { beginAtZero: true } } }
});

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

document.getElementById("desc").addEventListener("keypress", function(event) {
    if (event.key === "Enter") addExpense();
});

document.getElementById("amount").addEventListener("keypress", function(event) {
    if (event.key === "Enter") addExpense();
});

document.getElementById("date").addEventListener("keypress", function(event) {
    if (event.key === "Enter") addExpense();
});

function setGoal() {
    goalAmount = parseFloat(document.getElementById("goal-amount").value);
    goalPeriod = document.getElementById("goal-period").value;
    document.getElementById("goal").innerText = goalAmount;
    document.getElementById("goal-period-text").innerText = goalPeriod;
    updateUI();
}

function updateUI() {
    let totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById("balance").innerText = totalExpense;
    updateCharts();
    updateStatus(totalExpense);
    renderExpenses();
}

function updateCharts() {
    updateChart(dailyChart, "Daily");
    updateChart(weeklyChart, "Weekly");
    updateChart(monthlyChart, "Monthly");
}

function updateChart(chart, period) {
    let filteredExpenses = expenses.filter(exp => isWithinPeriod(exp.date, period));
    chart.data.labels = filteredExpenses.map(exp => exp.date);
    chart.data.datasets[0].data = filteredExpenses.map(exp => exp.amount);
    chart.update();
}

function isWithinPeriod(date, period) {
    const now = new Date();
    const expenseDate = new Date(date);
    switch (period) {
        case "Daily": return expenseDate.toDateString() === now.toDateString();
        case "Weekly": return (now - expenseDate) / (1000 * 60 * 60 * 24) < 7;
        case "Monthly": return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
        default: return false;
    }
}

function updateStatus(totalExpense) {
    let statusEl = document.getElementById("status");
    if (goalAmount > 0) {
        if (totalExpense > goalAmount) {
            statusEl.innerText = "❌ Over Limit!";
            statusEl.className = "red";
        } else if (totalExpense > goalAmount * 0.6) {
            statusEl.innerText = "⚠ Warning: 60%+ Spent!";
            statusEl.className = "yellow";
        } else {
            statusEl.innerText = "✔ Within Limit";
            statusEl.className = "green";
        }
    }
}

function renderExpenses() {
    const list = document.getElementById("expense-list");
    list.innerHTML = "";
    expenses.forEach(exp => {
        const li = document.createElement("li");
        li.innerText = `${exp.date} - ${exp.desc}: ₹${exp.amount} (${exp.category})`;
        list.appendChild(li);
    });
}
