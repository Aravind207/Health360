import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../LandingPage/Header';
import {jwtDecode, JwtPayload} from 'jwt-decode'
import { useNavigate} from "react-router-dom"
import "./searchFood.scss"

type FoodItem = {
  userId: string;
  mealType: string;
  date: string;
  foodName: string;
  servingSize: number;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  sodium: number;
  sugar: number;
}

type Params = {
  mealType: string;
  formattedDate: string;
}

interface JwtPayloadWithUserId extends JwtPayload {
    userId: string;
}

let userId: string;

const SearchFood: React.FC = () => {
  const navigate=useNavigate();
  const {mealType, formattedDate } = useParams<Params>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [initialCalories, setInitialCalories] = useState<number>(0);
  const [initialCarbs, setInitialCarbs] = useState<number>(0);
  const [initialFat, setInitialFat] = useState<number>(0);
  const [initialProtein, setInitialProtein] = useState<number>(0);
  const [initialSodium, setInitialSodium] = useState<number>(0);
  const [initialSugar, setInitialSugar] = useState<number>(0);
  const [initialServingSize, setInitialServingSize] = useState<number>(0);
  const meal = mealType!;
  const date = formattedDate!;

  const token = localStorage.getItem('token');
  if(token) {
    const decoded: JwtPayloadWithUserId = jwtDecode(token) as JwtPayloadWithUserId;
    userId = decoded.userId;
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value);
    setSelectedQuantity(quantity);

    if (selectedFood) {
      if(quantity === 0 || Number.isNaN(quantity)) {
        setSelectedFood({ ...selectedFood, servingSize: initialServingSize, calories: initialCalories, carbs: initialCarbs, 
        fat: initialFat, protein: initialProtein, sodium: initialSodium, sugar: initialSugar });
      } else {
        const updatedServingSize = Math.round(initialServingSize * quantity * 100) / 100;
        const updatedCalories = Math.round(initialCalories * quantity * 100) / 100;
        const updatedCarbs = Math.round(initialCarbs * quantity* 100) / 100;
        const updatedFat = Math.round(initialFat * quantity * 100) / 100;
        const updatedProtein = Math.round(initialProtein * quantity * 100) / 100;
        const updatedSodium = Math.round(initialSodium * quantity * 100) / 100;
        const updatedSugar = Math.round(initialSugar * quantity * 100) / 100;
        setSelectedFood({ ...selectedFood, servingSize: updatedServingSize, calories: updatedCalories, carbs: updatedCarbs, 
          fat: updatedFat, protein: updatedProtein, sodium: updatedSodium, sugar: updatedSugar });
      }
    }
  };

  const searchFood = async () => {
    try {
      setSearchResults([]);
      setSelectedFood(null);
      if (searchTerm !== "") {
        const response = await axios.get('https://trackapi.nutritionix.com/v2/search/instant', {
          headers: {
            'x-app-id': '5694690a',
            'x-app-key': 'e2cae258b8e23d9a3619ad82895254ff',
          },
          params: {
            query: searchTerm,
            branded: false
          },
        });

        if (response.data.common.length === 0) {
          setError("No results found!");
        }
        setSearchResults(response.data.common.slice(0, 5));
      } else {
        setError("Please provide a phrase to search for!");
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError("Error fetching search results!");
    }
  };

  const handleClick = async (food: any) => {
    const response = await axios.post(`https://trackapi.nutritionix.com/v2/natural/nutrients/`, 
        {
            query: food.food_name
        },
        {
            headers: {
                'Content-type': 'application/json',
                'x-app-id': '5694690a',
                'x-app-key': 'e2cae258b8e23d9a3619ad82895254ff'
            },
    });

    console.log(response.data);


    const selectedFoodObj = {
        userId: userId,
        foodName: food.food_name,
        date: date,
        mealType: meal,
        servingSize: response.data.foods[0].serving_weight_grams * response.data.foods[0].serving_qty,
        calories: response.data.foods[0].nf_calories,
        carbs: response.data.foods[0].nf_total_carbohydrate,
        fat: response.data.foods[0].nf_total_fat,
        protein: response.data.foods[0].nf_protein,
        sodium: response.data.foods[0].nf_sodium,
        sugar: response.data.foods[0].nf_sugars
      };

    setSelectedFood(selectedFoodObj);
    setInitialCalories(response.data.foods[0].nf_calories);
    setInitialServingSize(response.data.foods[0].serving_weight_grams * response.data.foods[0].serving_qty);
    setInitialCarbs(response.data.foods[0].nf_total_carbohydrate);
    setInitialFat(response.data.foods[0].nf_total_fat);
    setInitialProtein(response.data.foods[0].nf_protein);
    setInitialSodium(response.data.foods[0].nf_sodium);
    setInitialSugar(response.data.foods[0].nf_sugars);
  };

  const handleSave = async () => {
    if(selectedFood) {
        try {
          const res = await axios.post("http://localhost:3000/addfood", selectedFood);
          console.log(res);
          if (res.status === 200 ) {
            navigate("/addfood");
          }
        } catch (error: any) {
          setError("Error saving the values!");
        }
      } else {
        setError("Please select a food to save!");
      }
  };


  return (
    <div className="search-food-page">
      <Header />
      <div className = "bg-img-food">
        <div className="search-food-container-wrapper">
          <div className = "search-food-page-container">
            <div className="search-food-input-section">
              <h2 className = "search-heading">Search {mealType} Food</h2>
              <div>
                <input 
                  className='search-food-input'
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setError("");
                  }}
                  placeholder={`Search for ${mealType} food...`}
                />
                <button className='search-btn' onClick={searchFood}>Search</button>
              </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <div className='search-food-result'>
              <h3>Search Results:</h3>
              <ul className='search-list'>
                {searchResults.map((item, index) => (
                  <li className = "search-item" key={index} onClick={() => handleClick(item)}>
                    {item.food_name}
                  </li>
                ))}
              </ul>
            </div>

            <div className = "search-food-save">
              {selectedFood && (
                <div className='save-container'>
                  <div className='select-and-save'>
                    <h3 className='selected-food'>Selected Food: {selectedFood.foodName.charAt(0).toUpperCase() + selectedFood.foodName.slice(1)}</h3>
                    <div className='select-qty-container'>
                      <h3>Select Serving size:</h3>
                      <input className='add-qty-input' name = "quantity" value = {selectedQuantity} type="number" placeholder='Add Quantity' onChange={handleQuantityChange}/>
                    </div>
                    <button className='save-btn' onClick={handleSave}>Save</button>
                  </div>
                  <div className='nutrition-facts'>
                    <h3>Nutrition facts:</h3>
                    <p>Serving size: {selectedFood.servingSize}gm</p>
                    <p>Calories: {selectedFood.calories}kcal</p>
                    <p>Carbs: {selectedFood.carbs}gm</p>
                    <p>Fat: {selectedFood.fat}gm</p>
                    <p>Protein: {selectedFood.protein}gm</p>
                    <p>Sodium: {selectedFood.sodium}gm</p>
                    <p>Sugar: {selectedFood.sodium}gm</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFood;
