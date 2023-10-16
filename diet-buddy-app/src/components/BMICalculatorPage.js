import React, { useState, useEffect } from 'react';
import { NavBar} from "./Navigation";
import { Footer } from "./HomePage";
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import { getDatabase, ref, set as firebaseSet, push as firebasePush, onValue, remove as firebaseRemove} from 'firebase/database'

export function BMICalculatorPage(props) {
    const [bmiHistory, setBMIHistory] = useState([]);
    const db = getDatabase();

    const removeBMIRecord = (recordKey) => {
        const recordRef = ref(db, `bmiHistory/${recordKey}`);
        firebaseRemove(recordRef)
            .then(() => {
                setBMIHistory((prevBMIHistory) =>
                    prevBMIHistory.filter((record) => record.key !== recordKey)
                );
            })
            .catch((error) => {
                console.error("Error removing BMI record from Firebase: ", error);
            });
    };

    useEffect(() => {
        const bmiHistoryRef = ref(db, 'bmiHistory');

        const unregisterFunction = onValue(bmiHistoryRef, (snapshot) => {
            const bmiHistoryValue = snapshot.val();
            if (bmiHistoryValue) {
                const bmiHistoryArray = Object.keys(bmiHistoryValue).map((key) => ({
                    key: key,
                    date: bmiHistoryValue[key].date,
                    weight: bmiHistoryValue[key].weight,
                    bmi: bmiHistoryValue[key].bmi,
                }));
                setBMIHistory(bmiHistoryArray);
            }
        });

        function cleanup() {
            unregisterFunction();
        }
        return cleanup;
    }, [db]);


    const addBMIRecord = function(record) {
        const newRecordRef = firebasePush(ref(getDatabase(), 'bmiHistory'), record);
        const newRecordKey = newRecordRef.key;
        setBMIHistory([...bmiHistory, { ...record, key: newRecordKey }]);
    };

    return(
        <div>
            <NavBar />
            <main>
                <h1>Calculate Your BMI</h1>
                <div className="container-bmi">
                    <div className="row g-3 justify-content-center">
                        <div className="col-md-4 col-sm p-3">
                            <InputCard addBMIRecord={addBMIRecord} />
                        </div>
                        <div className="col-md-4 col-sm p-3">
                            <BMIHistory bmiHistory={bmiHistory} removeBMIRecord={removeBMIRecord} />
                        </div>
                        <div className="col-md-6 col-12 p-3">
                            <BMIGraph bmiHistory={bmiHistory} />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function InputCard({ addBMIRecord }) {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBMI] = useState('');

    const calculateBMI = function(event) {
        if (weight && height) {
            const bmiValue = (weight / (height * height) * 703).toFixed(2);
            setBMI(bmiValue);
        }
    };

    const handleAddRecord = function(event) {
        if (weight && height && bmi) {
            const newRecord = { 
                date: new Date().toLocaleDateString(), 
                weight,
                bmi };
            addBMIRecord(newRecord);          
        }

        setWeight('');
        setHeight('');
        setBMI('');
    };

    return (
        <div>
            <p className="card-heading">Enter your height and weight below</p>
            <div className="card-body p-5">
                <div className="card-text">
                    <form id="bmi-form">
                        <div className="form-group">
                            <label htmlFor="weight">Weight:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="weightInput"
                                placeholder="Enter weight in lbs"
                                value={weight}
                                onChange={(event) => setWeight(event.target.value)}
                                aria-label="Enter your weight in pounds"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="height">Height:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="heightInput"
                                placeholder="Enter height in inches"
                                value={height}
                                onChange={(event) => setHeight(event.target.value)}
                                aria-label="Enter your height in inches"
                            />
                        </div>
                        <button type="button" className="btn btn-dark" onClick={calculateBMI} aria-label="Calculate BMI">
                            Calculate BMI
                        </button>
                        <button type="button" className="btn btn-dark mt-2" onClick={handleAddRecord} aria-label="Add to BMI History">
                            Add to BMI History
                        </button>
                        <div className="form-group mt-3">
                            <label htmlFor="your_bmi" className="bmi-input">
                                Your BMI:
                            </label>
                            <input
                                readOnly
                                type="text"
                                id="bmiOutput"
                                placeholder="Your BMI"
                                value={bmi}
                                aria-label="Your calculated BMI"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


function BMIHistory({ bmiHistory, removeBMIRecord }) {
    return (
        <div>
            <p className="card-heading">BMI History</p>
            <table className="table table-striped transparent-table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Date</th>
                        <th scope="col">Weight</th>
                        <th scope="col">BMI</th>
                        <th scope="col">Actions</th> 
                    </tr>
                </thead>
                    <tbody>
                        {bmiHistory.map((record, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                    <td>{record.date}</td>
                                    <td>{record.weight}</td>
                                    <td>{record.bmi}</td>
                                    <td>
                                <button
                                    className="btn btn-dark"
                                    onClick={(event) => removeBMIRecord(record.key)}
                                >
                                    Remove
                                </button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
            </table>
      </div>
    );
}

function BMIGraph({ bmiHistory }) {
    const dates = bmiHistory.map(record => record.date);
    const weights = bmiHistory.map(record => record.weight);
    const bmis = bmiHistory.map(record => record.bmi);

    const bmiRanges = [
        { min: 0, max: 18.5, color: 'blue'},
        { min: 18.5, max: 24.9, color: 'green'},
        { min: 25, max: 29.9, color: 'orange'},
        { min: 30, max: 100, color: 'red'}
    ];

    const pointColors = bmis.map(bmi => {
        const range = bmiRanges.find(range => bmi >= range.min && bmi <= range.max);
        return range ? range.color : 'black';
    });
    
    const chartData = {
        labels: dates,
        datasets: [
            {
                label: 'BMI History Line Graph',
                data: bmis,
                borderColor: 'black',
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
                pointBackgroundColor: pointColors,
                pointBorderColor: 'black',
                pointRadius: 4,
                pointHoverRadius: 8
            }
        ]
    };

    return (
        <div>
            <Line data={chartData} />
        </div>    
    );
}
