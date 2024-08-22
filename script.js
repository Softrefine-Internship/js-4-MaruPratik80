// write javascript here

const expenseName = document.getElementById('expense-name');
const amount = document.getElementById('amount');
const date = document.getElementById('date');
const category = document.getElementById('category');
const btnAdd = document.querySelector('.btn--add');

const filterCategory = document.getElementById('filter-category');
const table = document.querySelector('.tbody');
const totalExpense = document.querySelector('.total-expense');

const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Functions
const formatAmount = amount =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);

const formatDate = date =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));

const saveExpenses = function () {
  localStorage.setItem('expenses', JSON.stringify(expenses));
};

const updateTable = function () {
  const entries = !filterCategory.value
    ? expenses
    : expenses.filter(e => e.category === filterCategory.value);

  while (table.rows.length > 0) {
    table.deleteRow(0);
  }

  entries.forEach((expense, i) => {
    const row = table.insertRow();

    row.insertCell(0).textContent = expense.name;
    row.insertCell(1).textContent = formatAmount(expense.amount);
    row.insertCell(2).textContent = formatDate(expense.date);
    row.insertCell(3).textContent = expense.category;
    row.insertCell(
      4
    ).innerHTML = `<button class="btn btn--delete" data-index=${i}>Delete</button>`;
  });

  const total = entries.reduce((acc, e) => (acc += +e.amount), 0);
  totalExpense.textContent = formatAmount(total);
};
updateTable();

const addExpense = function (e) {
  e.preventDefault();

  if (expenseName.value && amount.value > 0 && date.value && category.value) {
    expenses.push({
      name: expenseName.value,
      amount: amount.value,
      date: date.value,
      category: category.value,
    });

    saveExpenses();
    updateTable();

    this.blur();
    expenseName.value = '';
    amount.value = '';
    date.value = '';
    category.value = '';
  }
};

const deleteExpense = function (e) {
  e.preventDefault();
  const btn = e.target.closest('.btn--delete');
  if (!btn) return;

  expenses.splice(btn.dataset.index, 1);
  saveExpenses();
  updateTable();
};

// Event handler
btnAdd.addEventListener('click', addExpense);
table.addEventListener('click', deleteExpense);

filterCategory.addEventListener('change', function (e) {
  e.preventDefault();
  updateTable();
  this.blur();
});
