import { useEffect, useState } from 'react';
import './App.css';
import {db} from "./firebase-config";
import { getDocs, collection, addDoc, doc, deleteDoc } from 'firebase/firestore';

function App() {
  const [activity, setActivity] = useState('');
  const [expense, setExpense] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState('');
  const [net, setNet] = useState(0);

  const Items = collection(db, "Expense-items");

  useEffect(() =>{
    getItems();
  },[]);
  
  const getItems = async () =>{
    try {
      const data = await getDocs(Items);
      const filteredData = data.docs.map((doc) => (
        {
          ...doc.data(), 
          id: doc.id,
        }
      ))
      setExpenses(filteredData);
    } catch (err){
      console.log(err);
    }
  };

  const list = [...expenses].reverse();
  const total = expenses.reduce((acc, num) => {
    if(isNaN(parseInt(num.expense))){
      return acc;
    }
    else {
      return acc + parseInt(num.expense);
    }
  }, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(activity === '' || expense === '' ) return;
    try {
      await addDoc(Items, {
        activity: activity,
        expense: expense,
      });
    }
    catch(err){
      console.log(err);
    }

    // setExpenses([...expenses, {activity, expense}]);
    getItems();
    setNet(income-total-expense);
    setExpense('');
    setActivity('');
  };

const remove = async (expenseToRemove) => {
  const newExpenses = expenses.filter((expense) => expense !== expenseToRemove);

  try {
    const ItemDelete = doc(db, "Expense-items", expenseToRemove.id);
    await deleteDoc(ItemDelete);
  }
  catch(err){
    console.log(err);
  }

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
