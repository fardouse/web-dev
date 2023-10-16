import React from "react";
import { NavBar} from "./Navigation";
import { Link } from "react-router-dom";

export function HomePage(props) {
    const { homepageData } = props;
    return(
        <div>
            <NavBar />
            <CardList homepageData={homepageData}/>
            <Footer />
        </div>
    );
}

function Card(props) {
    const { homepageData } = props;

    return (
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card-body p-5">
            <span className="material-icons" style={{ fontSize: '100px' }} aria-hidden="true">{homepageData.icon}</span>
              <div className="col-sm">
                <h2 className="card-title">{homepageData.title}</h2>
                <p className="card-text">{homepageData.text}</p>
                <Link to={homepageData.link} className="btn btn-dark" aria-label={homepageData.button}>{homepageData.button}</Link>
              </div>
          </div>
        </div>
    );
}

function CardList(props) {
    const { homepageData } = props;

    return (
        <main>
            <h1>Welcome to DietBuddy</h1>
            <p className="index-title">What would you like to do today?</p>           
            <div className="row justify-content-md-center text-center">
                {homepageData.map((card) => (
                    <Card homepageData={card} />
                ))}
            </div>
        </main>
    );
}

export function Footer() {
    return (
        <footer>
            <p>&copy; 2023 DietBuddy. All rights reserved. </p>
        </footer>
    );
}