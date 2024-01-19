import React from "react"
import "./DietPlanDashboard.scss"
import Header from "../LandingPage/Header"
import {useNavigate} from 'react-router-dom';

const DietPlanDashboard = () => {
    let navigate = useNavigate(); 
    const routeChange = (path: any) =>{  
      navigate(path);
    }

    return (
        <div>
            <Header />
            <div className="dietpic"/>
            <div className="dietplan-container">
                <p className="dietplan">Diet Plan</p>
                <div>
                    <button className="options" onClick={() => routeChange('vegetarian')}>Vegetarian</button>
                    <button className="options" onClick={() => routeChange('nonvegetarian')}>Non-Vegetarian</button>
                    <button className="options" onClick={() => routeChange('vegan')}>Vegan</button>
                </div>
                
            </div>
        </div>
        
    )
}

export default DietPlanDashboard