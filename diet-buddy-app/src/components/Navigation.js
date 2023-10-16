import React from "react";
import { Link } from "react-router-dom";

export function NavBar() {
    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-light">
                <Link to="/" className="navbar-brand">DietBuddy</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav m-auto">
                        <Link to="/" className="nav-item nav-link active" href="#">Home</Link>
                        <Link to="/bmi" className="nav-item nav-link">BMI Calculator</Link>
                        <Link to="/calorie-counter" className="nav-item nav-link">Calorie Counter</Link>
                        <Link to="/diet-plan" className="nav-item nav-link">My DietPlan</Link>
                    </div>
                </div>
            </nav>
      </header>
    );
}