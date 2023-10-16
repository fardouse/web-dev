import React from "react";
import { HomePage } from "./HomePage";
import { BMICalculatorPage } from "./BMICalculatorPage";
import { CalorieCounterPage } from "./CalorieCounterPage";
import { DietPlanPage } from "./DietPlanPage";
import { Routes, Route } from "react-router-dom";

function App(props) {
    const { homepageData } = props;
    return (
        <Routes>
            <Route index element={<HomePage homepageData={homepageData} />} />
            <Route path="/bmi" element={<BMICalculatorPage />} />
            <Route path="/calorie-counter" element={<CalorieCounterPage />} />
            <Route path="/diet-plan" element={<DietPlanPage />} />
        </Routes>
    );
}

export default App;