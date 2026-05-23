import { useState, useEffect } from "react";
import "./App.css";

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Other"];

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description || !amount) return;
    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
    };
    setExpenses([...expenses, newExpense]);
    setDescription("");
    setAmount("");
    setCategory("Food");
  }

  function handleDelete(id) {
    setExpenses(expenses.filter((e) => e.id !== id));
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const filteredExpenses =
    filter === "All"
      ? expenses
      : expenses.filter((e) => e.category === filter);

  const categoryTotals = CATEGORIES.map((cat) => ({
    name: cat,
    total: expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0),
  })).filter((c) => c.total > 0);

  const topCategory =
    categoryTotals.length > 0
      ? categoryTotals.reduce((a, b) => (a.total > b.total ? a : b))
      : null;

  return (
    <div className="app">
      <header className="header">
        <h1>Expense Tracker</h1>
      </header>

      <main className="main">

        {expenses.length > 0 && (
          <div className="summary-card">
            <div className="summary-item">
              <span className="summary-label">Total Spent</span>
              <span className="summary-value">₹{total.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Expenses</span>
              <span className="summary-value">{expenses.length}</span>
            </div>
            {topCategory && (
              <div className="summary-item top-cat">
                <span className="summary-label">Highest Spend</span>
                <span className="summary-value">{topCategory.name}</span>
                <span className="summary-sub">₹{topCategory.total.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        {categoryTotals.length > 0 && (
          <section className="breakdown-card">
            <h2>Spending by category</h2>
            {categoryTotals
              .sort((a, b) => b.total - a.total)
              .map((cat) => (
                <div key={cat.name} className="breakdown-row">
                  <div className="breakdown-left">
                    <span className={`expense-cat cat-${cat.name.toLowerCase()}`}>
                      {cat.name}
                    </span>
                    <div className="breakdown-bar-wrap">
                      <div
                        className={`breakdown-bar bar-${cat.name.toLowerCase()}`}
                        style={{ width: `${(cat.total / total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="breakdown-amount">₹{cat.total.toFixed(2)}</span>
                </div>
              ))}
          </section>
        )}

        <section className="form-card">
          <h2>Add Expense</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                placeholder="e.g. Lunch at canteen"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-add">Add Expense</button>
          </form>
        </section>

        <section className="list-section">
          <div className="list-header">
            <h2>Expenses {filteredExpenses.length > 0 && `(${filteredExpenses.length})`}</h2>
            <div className="filter-tabs">
              {["All", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  className={`filter-tab ${filter === cat ? "active" : ""}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredExpenses.length === 0 ? (
            <p className="empty-msg">
              {filter === "All" ? "No expenses yet. Add one above." : `No ${filter} expenses yet.`}
            </p>
          ) : (
            <ul className="expense-list">
              {filteredExpenses.map((expense) => (
                <li key={expense.id} className="expense-item">
                  <div className="expense-left">
                    <span className="expense-desc">{expense.description}</span>
                    <span className={`expense-cat cat-${expense.category.toLowerCase()}`}>
                      {expense.category}
                    </span>
                  </div>
                  <div className="expense-right">
                    <span className="expense-amount">₹{expense.amount.toFixed(2)}</span>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(expense.id)}
                      aria-label="Delete expense"
                    >✕</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

      </main>
    </div>
  );
}

export default App;