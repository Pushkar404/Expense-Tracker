document.addEventListener("DOMContentLoaded", loadExpenses);

function addExpense() {
    let desc = document.getElementById("desc").value;
    let amount = document.getElementById("amount").value;
    if (desc === "" || amount === "") {
        alert("Please enter description and amount");
        return;
    }

    let expense = { id: Date.now(), desc, amount: parseFloat(amount) };
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
    loadExpenses();
}

function loadExpenses() {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    let list = document.getElementById("expense-list");
    let balance = 0;
    
    list.innerHTML = "";
    expenses.forEach(exp => {
        balance += exp.amount;
        let li = document.createElement("li");
        li.innerHTML = `${exp.desc} - ₹${exp.amount} <button class="delete-btn" onclick="deleteExpense(${exp.id})">❌</button>`;
        list.appendChild(li);
    });

    document.getElementById("balance").innerText = balance;
}

function deleteExpense(id) {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses = expenses.filter(exp => exp.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenses();
}
