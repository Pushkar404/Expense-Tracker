let expenses = [];
let goals = { Daily: 0, Weekly: 0, Monthly: 0, Yearly: 0 };
let charts = {}; // Store Chart.js instances

document.addEventListener("DOMContentLoaded", function () {
    createCharts();
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

function setGoal() {
    let amount = parseFloat(document.getElementById("goal-amount").value);
    let period = document.getElementById("goal-period").value;
    
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid goal amount!");
        return;
    }

    goals[period] = amount;
    updateGoalsUI();
}

function updateGoalsUI() {
    let goalList = document.getElementById("goal-list");
    goalList.innerHTML = "";

    for (let period in goals) {
        let goalValue = goals[period];
        if (goalValue > 0) {
            let li = document.createElement("li");
            li.innerHTML = `<strong>${period}:</strong> ₹${goalValue} <span id="${period}-status" class="green">✔ Within Limit</span>`;
            goalList.appendChild(li);
        }
    }
}

function updateUI() {
    let totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById("balance").innerText = totalExpense;
    updateStatus();
    renderExpenses();
    updateCharts();
}

function updateStatus() {
    let periodTotals = {
        Daily: getExpenseTotal("Daily"),
        Weekly: getExpenseTotal("Weekly"),
        Monthly: getExpenseTotal("Monthly"),
        Yearly: getExpenseTotal("Yearly")
    };

    for (let period in goals) {
        let goalValue = goals[period];
        let total = periodTotals[period];
        let statusEl = document.getElementById(`${period}-status`);

        if (!statusEl) continue;

        if (goalValue > 0) {
            if (total > goalValue) {
                statusEl.innerText = "❌ Over Limit!";
                statusEl.className = "red";
            } else if (total > goalValue * 0.6) {
                statusEl.innerText = "⚠ Warning: 60%+ Spent!";
                statusEl.className = "yellow";
            } else {
                statusEl.innerText = "✔ Within Limit";
                statusEl.className = "green";
            }
        }
    }
}

function getExpenseTotal(period) {
    const now = new Date();
    return expenses.filter(exp => isWithinPeriod(exp.date, period)).reduce((sum, exp) => sum + exp.amount, 0);
}

function isWithinPeriod(date, period) {
    const now = new Date();
    const expenseDate = new Date(date);

    switch (period) {
        case "Daily": return expenseDate.toDateString() === now.toDateString();
        case "Weekly": return (now - expenseDate) / (1000 * 60 * 60 * 24) < 7;
        case "Monthly": return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
        case "Yearly": return expenseDate.getFullYear() === now.getFullYear();
        default: return false;
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

function createCharts() {
    let ctxDaily = document.getElementById("expenseChartDaily").getContext("2d");
    let ctxWeekly = document.getElementById("expenseChartWeekly").getContext("2d");
    let ctxMonthly = document.getElementById("expenseChartMonthly").getContext("2d");
    
    charts.daily = new Chart(ctxDaily, { type: "line", data: { labels: [], datasets: [{ label: "Daily Expenses", data: [], backgroundColor: "blue" }] } });
    charts.weekly = new Chart(ctxWeekly, { type: "bar", data: { labels: [], datasets: [{ label: "Weekly Expenses", data: [], backgroundColor: "green" }] } });
    charts.monthly = new Chart(ctxMonthly, { 
        type: "pie", 
        data: { 
            labels: [], 
            datasets: [{ data: [], backgroundColor: ["red", "blue", "yellow", "purple", "orange"] }] 
        } 
    });
}

function updateCharts() {
    let dailyExpenses = getExpenseTotal("Daily");
    let weeklyExpenses = getExpenseTotal("Weekly");
    
    // Update Daily Chart
    charts.daily.data.labels = ["Today"];
    charts.daily.data.datasets[0].data = [dailyExpenses];
    charts.daily.update();

    // Update Weekly Chart
    charts.weekly.data.labels = ["This Week"];
    charts.weekly.data.datasets[0].data = [weeklyExpenses];
    charts.weekly.update();

    // Update Monthly Chart (Category-wise)
    let categoryTotals = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});

    charts.monthly.data.labels = Object.keys(categoryTotals);
    charts.monthly.data.datasets[0].data = Object.values(categoryTotals);
    charts.monthly.update();
}

function showChart(type) {
    document.getElementById("expenseChartDaily").style.display = "none";
    document.getElementById("expenseChartWeekly").style.display = "none";
    document.getElementById("expenseChartMonthly").style.display = "none";

    if (type === "Daily") {
        document.getElementById("expenseChartDaily").style.display = "block";
    } else if (type === "Weekly") {
        document.getElementById("expenseChartWeekly").style.display = "block";
    } else if (type === "Monthly") {
        document.getElementById("expenseChartMonthly").style.display = "block";
    }
}
