import React, { useState, useEffect } from "react";
import { NavBar} from "./Navigation";
import { Footer } from "./HomePage";
import FOOD_DATA from '../data/foods.json';
import Select from "react-select";
import { getDatabase, ref, set as firebaseSet, push as firebasePush, onValue, remove as firebaseRemove, off} from 'firebase/database';

export function CalorieCounterPage(props) {
    const [consumedFoods, setConsumedFoods] = useState([]);
    const [consumedCalories, setConsumedCalories] = useState(0);
    const db = getDatabase();

    const removeFood = (foodIndex) => {
      const removedFood = consumedFoods[foodIndex];
  
      const foodRef = ref(db, `consumedFoods/${removedFood.key}`);
      firebaseRemove(foodRef)
        .then(() => {
          const updatedFoods = [...consumedFoods];
          updatedFoods.splice(foodIndex, 1); 
          setConsumedFoods(updatedFoods);
        })
        .catch((error) => {
          console.error("Error removing food item from Firebase: ", error);
        });
    };
  
    useEffect(() => {
      const foodRef = ref(db, "consumedFoods");
      onValue(foodRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const foods = Object.keys(data).map((key) => ({
            key: key,
            food: data[key].food,
            calories: data[key].calories,
          }));
          setConsumedFoods(foods);
        } else {
          setConsumedFoods([]);
        }
      });
  
      return () => {
        off(foodRef);
      };
    }, [db]);

    return(
        <div>
            <NavBar />
            <main>
                <h1 className="calorie-title">Calorie Counter</h1>           
                <div className="row justify-content-md-center">
                    <div className="col-xl-4 col-md-6 mb-4 p-4">
                        <CalorieInputCard 
                            consumedFoods={consumedFoods}
                            setConsumedFoods={setConsumedFoods}
                            setConsumedCalories={setConsumedCalories}
                        />
                    </div>
                    <div className="col-xl-4 col-md-6 mb-4 p-4">
                        <CaloriesConsumed consumedFoods={consumedFoods} removeFood={removeFood} />
                    </div>
                    {/* <div className="col-xl-4 col-md-6 mb-4 p-4">
                        <CalorieProgress 
                            goalCalories={goalCalories}
                            consumedCalories={consumedCalories}
                            setGoalCalories={setGoalCalories}
                            setConsumedCalories={setConsumedCalories}
                        />
                    </div> */}
                </div>
            </main>
            <Footer />
        </div>

    );
}

    function CalorieInputCard({ consumedFoods, setConsumedFoods, consumedCalories, setConsumedCalories }) {
        const [selectedFood, setSelectedFood] = useState(null);
        const db = getDatabase();

        const transformedData = FOOD_DATA.map((food) => ({
            label: food.Display_Name,
            value: food.Display_Name,
            calories: food.Calories,
        }));

        const handleSubmit = function(event) {
            event.preventDefault();
            if (selectedFood) {
                const newFood = { 
                    food: selectedFood.label, 
                    calories: selectedFood.calories, 
                };

                const foodRef = ref(db, "consumedFoods");
                firebasePush(foodRef, newFood);

                setConsumedFoods([...consumedFoods, newFood]);
                setSelectedFood(null);

                const totalConsumedCalories = consumedCalories + newFood.calories;
                setConsumedCalories(totalConsumedCalories); 
            }
        };

        return (
            <div>
                <p className="card-heading">Enter Food & Calorie amount below</p>
                <div className="card-body p-5">
                <div className="card-text">
                    <form id="calorie-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="food">Food:</label>
                        <Select
                        options={transformedData} 
                        value={selectedFood}
                        onChange={setSelectedFood}
                        isSearchable
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="calories">Calories:</label>
                        <input
                        type="number"
                        className="form-control"
                        id="calories"
                        placeholder="Calories"
                        value={selectedFood ? selectedFood.calories : ''}
                        readOnly
                        />
                    </div>
                    <button type="submit" className="btn btn-dark">
                        Add to Counter
                    </button>
                    </form>
                </div>
                </div>
            </div>
            );
    }


function CaloriesConsumed({ consumedFoods, removeFood }) {
    const totalCalories = consumedFoods.reduce((total, food) => total + food.calories * 1, 0);

    return (
        <div>
            <p className="card-heading">Calories Consumed</p>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Food Item</th>
                        <th scope="col">Calories</th>
                        <th scope="col">Actions</th> 
                    </tr>
                </thead>
                    <tbody id="calorie-table-body">
                        {consumedFoods.map((food, index) => (
                            <tr key={index}>
                                <td>{food.food}</td>
                                <td>{food.calories}</td>
                                <td>
                                <button
                                    className="btn btn-dark"
                                    onClick={() => removeFood(index)} 
                                > Remove </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
            </table>
            <p>Total Calories Consumed: {totalCalories}</p>
        </div>
    );
}

