// write javascript here

const expenseName = document.getElementById('expense-name');
const amount = document.getElementById('amount');
const date = document.getElementById('date');
const category = document.getElementById('category');
const inputs = [expenseName, amount, date, category];
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
  while (table.rows.length > 0) {
    table.deleteRow(0);
  }

  expenses.forEach((expense, i) => {
    if (filterCategory.value && expense.category !== filterCategory.value)
      return;

    const row = table.insertRow();

    row.insertCell(0).textContent = expense.name;
    row.insertCell(1).textContent = formatAmount(expense.amount);
    row.insertCell(2).textContent = formatDate(expense.date);
    row.insertCell(3).textContent = expense.category;
    row.insertCell(
      4
    ).innerHTML = `<button class="btn btn--delete" data-index=${i}>Delete</button>`;
  });

  const total = expenses
    .filter(e => !filterCategory.value || e.category === filterCategory.value)
    .reduce((acc, e) => (acc += +e.amount), 0);
  totalExpense.textContent = formatAmount(total);
};
updateTable();

const addExpense = function (e) {
  e.preventDefault();

  if (isValidExpense()) {
    expenses.push({
      name: expenseName.value,
      amount: amount.value,
      date: date.value,
      category: category.value,
    });

    saveExpenses();
    updateTable();

    inputs.forEach(input => (input.value = ''));
  }
  this.blur();
};

const deleteExpense = function (e) {
  e.preventDefault();
  const btn = e.target.closest('.btn--delete');
  if (!btn) return;

  expenses.splice(btn.dataset.index, 1);

  saveExpenses();
  updateTable();
};

// Form validation halper functions
function isValidExpense() {
  if (expenseName.value && amount.value > 0 && date.value && category.value)
    return true;

  inputs.forEach(input => {
    if (input === amount) return;
    valid.call(input);
    input.addEventListener('input', valid);
  });
  if (!(amount.value > 0)) {
    validA.call(amount);
    amount.addEventListener('input', validA);
  }
  return false;
}
function valid() {
  this.parentElement.dataset.err = !this.value ? '*This field is required' : '';
}
function validA() {
  if (!this.value) {
    this.parentElement.dataset.err = '*This field is required';
  } else if (this.value == '0') {
    this.parentElement.dataset.err = '*Amount should be greater than zero';
  } else {
    this.parentElement.dataset.err = '';
  }
}

// Event handler
btnAdd.addEventListener('click', addExpense);
table.addEventListener('click', deleteExpense);

filterCategory.addEventListener('change', function (e) {
  e.preventDefault();
  updateTable();
  this.blur();
});
