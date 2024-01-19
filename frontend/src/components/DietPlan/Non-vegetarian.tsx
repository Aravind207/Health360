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
  const nonVegMeals = plan.meals.filter((meal) => meal.type.toLowerCase().includes('nv'));

  return (
    <div className="card">
      <h3>{plan.plan_name}</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Portion</th>
            <th>Calories</th>
          </tr>
        </thead>
        <tbody>
          {nonVegMeals.map((meal, index) => (
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

interface NonVegDietListProps {
  dietPlans: DietPlan[];
}

const NonVegDietList: React.FC<NonVegDietListProps> = ({ dietPlans }) => {
  return (
    <div className="diet-plan-list">
      {dietPlans.map((plan, index) => (
        <DietPlanCard key={index} plan={plan} />
      ))}
    </div>
  );
};


const NonVegDietApp: React.FC = () => {

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
  const nonVegDietPlans = dietPlans.filter((plan) =>
    plan.meals.some((meal) => meal.type.toLowerCase().includes('nv'))
  );

  return (
    <div className="App">
      <Header />
      <div className='pic'>
        <p className='dietname'>Non-Vegetarian Diet Plans</p>
        <NonVegDietList dietPlans={nonVegDietPlans} />
      </div>
    </div>
  );
};

export default NonVegDietApp;


