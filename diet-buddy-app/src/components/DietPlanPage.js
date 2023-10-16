import React, { useState, useEffect } from "react";
import { NavBar } from "./Navigation";
import { Footer } from "./HomePage";
import Select from "react-select";
import FOOD_DATA from "../data/foods.json";
import { getDatabase, ref, set as firebaseSet, push as firebasePush, onValue, remove as firebaseRemove, off} from 'firebase/database';

export function DietPlanPage() {
  return (
    <div>
      <NavBar />
      <main>
        <h1 className="dietplan-title">My DietPlan</h1>
        <div className="container-dietplan">
          <div className="row g-3 justify-content-center">
            <div className="col-md-6">
              <AddFoodCard />
            </div>
            <div className="col-md-6">
              <DietPlan />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function AddFoodCard() {
  const [selectedFood, setSelectedFood] = useState(null);
  const [dietPlan, setDietPlan] = useState([]);
  const db = getDatabase();

  const transformedData = FOOD_DATA.map((food) => ({
    label: food.Display_Name,
    value: food.Display_Name,
    calories: food.Calories,
  }));

  const handleSubmit = function (event) {
    event.preventDefault();
    if (selectedFood) {
      const newFood = {
        food: selectedFood.label,
        calories: selectedFood.calories,
      };

      const foodRef = ref(db, "dietPlan");
      firebasePush(foodRef, newFood);

      setDietPlan([...dietPlan, newFood]);
      setSelectedFood(null);
    }
  };

  return (
    <div className="diet-input">
      <p className="card-heading">
        Select a food item to add to your diet plan:
      </p>
      <div className="card-body p-5">
        <div className="card-text">
          <form id="diet-form" className="mb-4" onSubmit={handleSubmit}>
            <div className="input-group">
              <Select
                options={transformedData}
                value={selectedFood}
                onChange={setSelectedFood}
                isSearchable
                placeholder="Select a food item"
                required
                aria-label="Select a food item"
              />
              <button
                type="submit"
                className="btn btn-dark"
                aria-label="Add to Diet Plan"
              >
                Add to Diet Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function DietPlan() {
  const [dietPlan, setDietPlan] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    const dietPlanRef = ref(db, "dietPlan");
    onValue(dietPlanRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const foods = Object.values(data);
        setDietPlan(foods);
      } else {
        setDietPlan([]);
      }
    });

    return () => {
      dietPlanRef.off();
    };
  }, [db]);

  const removeFood = (foodKey) => {
    const foodRef = ref(db, `dietPlan/${foodKey}`);
    firebaseRemove(foodRef)
      .then(() => {
        const updatedDietPlan = dietPlan.filter((food) => food.key !== foodKey);
        setDietPlan(updatedDietPlan);
      })
      .catch((error) => {
        console.error("Error removing food item from Firebase: ", error);
      });
  };

  return (
    <div className="diet-input">
      <p className="card-heading">My Diet Plan</p>
      <div className="card-body p-5">
        <div className="card-text">
          <div id="diet-table">
            <h2>Your Diet Plan</h2>
            <table className="table" aria-label="Your Diet Plan">
              <thead>
                <tr>
                  <th scope="col">Food Item</th>
                  <th scope="col">Calories</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody id="diet-table-body">
                {dietPlan.map((food, index) => (
                  <tr key={food.key}>
                    <td>{food.food}</td>
                    <td>{food.calories}</td>
                    <td>
                      <button
                        className="btn btn-dark"
                        onClick={() => removeFood(food.key)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
