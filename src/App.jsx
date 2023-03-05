import { useState } from 'react'
import './App.css'

function App() {
  const [activity, setActivity] = useState('');
  const [expense, setExpense] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState('');
  const [net, setNet] = useState(0);

  const list = [...expenses].reverse();
  const total = expenses.reduce((acc, num) => {
    if(isNaN(parseInt(num.expense))){
      return acc;
    }
    else {
      return acc + parseInt(num.expense);
    }
  }, 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    if(activity === '' || expense === '' ) return;
    setExpenses([...expenses, {activity, expense}]);
    setNet(income-total-expense);
    setExpense('');
    setActivity('');
  };

const remove = (expenseToRemove) => {
  const newExpenses = expenses.filter((expense) => expense !== expenseToRemove);
  setNet(income - newExpenses.reduce((acc, expense) => parseInt(expense.expense) + acc, 0));
  setExpenses(newExpenses);
};

  return (
    <div className="App">
      <div className="card">
        <h1>My Expense Tracker</h1>

        <h2>Total Income: ${income}</h2>
        <h2>Total Cost: ${total}</h2>
        <h2>Left Over: ${net}</h2>

      <form onSubmit={handleSubmit}>
      <label>
      <input type="number" value={income} placeholder="Income: " onChange={(event) =>  setIncome(event.target.value)} />
      <div className="BFields">
      <input type="text" value={activity} placeholder="Activity: " onChange={(event) => setActivity(event.target.value)} />

      <input type="number" value={expense} placeholder="Expense: " onChange={(event) => setExpense(event.target.value)} />
      </div>
      </label>
      <input type="submit" value="Submit" />
    </form>

    <h2>Expenses List:</h2>
    <div className="list">
    <ul>
  {list.map((number, index) => (
    <div className="expense-item" key={index}>
      <li>{number.activity}</li>
      <li> ${number.expense}</li>
      <button onClick={() => remove(number)}>delete</button>
    </div>
  ))}
</ul>

      </div>
      </div>
    </div>
  )

  }
  

export default App
