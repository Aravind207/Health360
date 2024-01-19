import React, { useState, useEffect } from 'react';
import "./dietplan.scss"
import Header from '../LandingPage/Header'
import axios from 'axios';

interface Meal {
  type: string;
  name: string;
  description: string;
  portion: string;
  calories: number;
}

interface DietPlan {
  goal: string;
  plan_name: string;
  meals: Meal[];
}

interface DietPlanCardProps {
  plan: DietPlan;
}

const DietPlanCard: React.FC<DietPlanCardProps> = ({ plan }) => {


  const vegetarianMeals = plan.meals.filter((meal) => meal.type.toLowerCase().includes('vegetarian'));

  return (
    <div className="card">
      <h3 className='plannum'>{plan.plan_name}</h3>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Portion</th>
            <th>Calories</th>
          </tr>
        </thead>
        <tbody>
          {vegetarianMeals.map((meal, index) => (
            <tr key={index}>
              <td>{meal.name}</td>
              <td>{meal.description}</td>
              <td>{meal.portion}</td>
              <td>{meal.calories} calories</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface VegetarianDietListProps {
  dietPlans: DietPlan[];
}

const VegetarianDietList: React.FC<VegetarianDietListProps> = ({ dietPlans }) => {
  return (
    <div className="diet-plan-list">
      {dietPlans.map((plan, index) => (
        <DietPlanCard key={index} plan={plan} />
      ))}
    </div>
  );
};


const VegetarianDietApp: React.FC = () => {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/diets');
        setDietPlans(response.data[0].diet_plans);
        setLoading(false);
        console.log(response.data[0].diet_plans);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const vegetarianDietPlans = dietPlans.filter((plan) =>
    plan.meals.some((meal) => meal.type.toLowerCase().includes('vegetarian'))
  );

  return (
    <div className="App">
      <Header />
      <div className='pic'>
        <p className='dietname'>Vegetarian Diet Plans</p>
        <div className="diet-plan-list">
          {vegetarianDietPlans.map((plan, index) => (
            <DietPlanCard key={index} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VegetarianDietApp;


