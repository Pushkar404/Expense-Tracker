let expenses = [];
let goalAmount = 0;
let goalPeriod = "-";
const ctx = document.getElementById("expenseChart").getContext("2d");

const expenseChart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: [],
        datasets: [{
            label: "Expenses",
            data: [],
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
        }],
    },
    options: {
        scales: {
            y: { beginAtZero: true },
        },
    },
});

function addExpense() {
    const desc = document.getElementById("desc").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;

    if (!desc || !amount || !date) {
        alert("Please enter all fields!");
        return;
    }

    expenses.push({ desc, amount, date, category });
    updateUI();
}

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
    updateChart();
    updateStatus(totalExpense);
    renderExpenses();
}

function updateChart() {
    expenseChart.data.labels = expenses.map((exp) => exp.date);
    expenseChart.data.datasets[0].data = expenses.map((exp) => exp.amount);
    expenseChart.update();
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
    expenses.forEach((exp) => {
        const li = document.createElement("li");
        li.innerText = `${exp.date} - ${exp.desc}: ₹${exp.amount} (${exp.category})`;
        list.appendChild(li);
    });
}
