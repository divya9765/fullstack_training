import { useState, useEffect } from "react";
import axios from "axios";
import './App.css';  // ✅ Make sure this is imported

function App() {
  const [foodName, setFoodName] = useState("");
  const [days, setDays] = useState("");
  const [newFoodName, setNewFoodName] = useState("");
  const [foodList, setFoodList] = useState([]);

  // Fetch all food data
  const getFoods = () => {
    axios.get("http://localhost:3000/read")
      .then(res => setFoodList(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getFoods();
  }, []);

  // Add food
  const addFood = () => {
    if (!foodName || !days) return alert("Enter food name and days");

    axios.post("http://localhost:3000/insert", {
      foodName: foodName,
      daySinceIate: Number(days)
    })
      .then(() => {
        setFoodName("");
        setDays("");
        getFoods();
      })
      .catch(err => console.log(err));
  };

  // Update food name
  const updateFood = (id) => {
    if (!newFoodName) return;
    axios.put(`http://localhost:3000/update/${id}`, {
      newFoodName: newFoodName
    })
      .then(() => {
        setNewFoodName("");
        getFoods();
      })
      .catch(err => console.log(err));
  };

  // Delete food
  const deleteFood = (id) => {
    axios.delete(`http://localhost:3000/delete/${id}`)
      .then(() => getFoods())
      .catch(err => console.log(err));
  };

  return (
    <div className="App">
      <h1>Food Tracker</h1>

      <div className="input-section">
        <input
          placeholder="Food name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Days since ate"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
        <button onClick={addFood}>Add</button>
      </div>

      <hr />

      {foodList.map(food => (
        <div key={food._id} className="foodItem">
          <h3>{food.foodName}</h3>
          <p>Ate {food.daySinceIate} days ago</p>

          <input
            placeholder="New name"
            value={newFoodName}
            onChange={(e) => setNewFoodName(e.target.value)}
          />

          <div className="buttons">
            <button className="update-btn" onClick={() => updateFood(food._id)}>Update</button>
            <button className="delete-btn" onClick={() => deleteFood(food._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
