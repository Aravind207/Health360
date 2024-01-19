import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../LandingPage/Header';
import './addFood.scss';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FaTrash } from 'react-icons/fa';

interface MealData {
  _id: string;
  mealType: string;
  calories: number;
  foodName: string;
  date: string;
  userId: string;
  carbs: number;
  fat: number;
  protein: number;
  sodium: number;
  sugar: number;
}

interface JwtPayloadWithUserId extends JwtPayload {
  userId: string;
}

let userId: string;

const AddFood: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [mealData, setMealData] = useState<MealData[][]>([]);
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [totalCarbs, setTotalCarbs] = useState<number>(0);
  const [totalFat, setTotalFat] = useState<number>(0);
  const [totalProtein, setTotalProtein] = useState<number>(0);
  const [totalSodium, setTotalSodium] = useState<number>(0);
  const [totalSugar, setTotalSugar] = useState<number>(0);


  const token = localStorage.getItem('token');
  if (token) {
    const decoded: JwtPayloadWithUserId = jwtDecode(token) as JwtPayloadWithUserId;
    userId = decoded.userId;
  }

  let navigate = useNavigate();

  const routeChange = (mealType: string) => {
    let formattedDate = '';
    if (selectedDate) {
      const timezoneOffset = selectedDate.getTimezoneOffset();
      const adjustedDate = new Date(selectedDate.getTime() - timezoneOffset * 60000);
      formattedDate = adjustedDate.toISOString().split('T')[0];
    }
    let path = `/searchfood/${mealType}/${formattedDate}`;
    navigate(path);
  };

  const handlePreviousDay = () => {
    if (selectedDate) {
      const previousDay = new Date(selectedDate);
      previousDay.setDate(selectedDate.getDate() - 1);
      setSelectedDate(previousDay);
    }
  };

  const handleNextDay = () => {
    if (selectedDate) {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);
      setSelectedDate(nextDay);
    }
  };

  const CustomDatePickerInput = ({ value, onClick }: any) => (
    <div className="custom-datepicker-input">
      <input type="text" value={value} readOnly={true} onClick={onClick} />
      <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
    </div>
  );

  const fetchMealData = async () => {
    if (!selectedDate) return;

    try {
      const timezoneOffset = selectedDate.getTimezoneOffset();
      const adjustedDate = new Date(selectedDate.getTime() - timezoneOffset * 60000);
      const formattedDate = adjustedDate.toISOString().split('T')[0];

      const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
      const promises = mealTypes.map(async (type) => {
        try {
          const response = await axios.get<MealData[]>(
            `http://localhost:3000/food/${userId}/${type}/${formattedDate}`
          );
          const mealDataByType = response.data.map((meal) => ({ ...meal, userId }));
          return mealDataByType;
        } catch (error) {
          console.error(`Error fetching ${type} data:`, error);
          return [];
        }
      });

      const mealData = await Promise.all(promises);
      let totalCalories = 0;
      let totalCarbs = 0;
      let totalFat = 0;
      let totalProtein = 0;
      let totalSodium = 0;
      let totalSugar = 0;
      for(let i = 0; i < 4; i++) {
        if(mealData[i].length > 0) {
          for(let j = 0; j < mealData[i].length; j++) {
            totalCalories +=mealData[i][j].calories;
            totalCarbs += mealData[i][j].carbs;
            totalFat += mealData[i][j].fat;
            totalProtein += mealData[i][j].protein;
            totalSodium += mealData[i][j].sodium;
            totalSugar += mealData[i][j].sugar;
          }
        }
      }
      setTotalCalories(Math.round(totalCalories * 100) / 100);
      setTotalCarbs(Math.round(totalCarbs * 100) / 100);
      setTotalFat(Math.round(totalFat * 100) / 100);
      setTotalProtein(Math.round(totalProtein * 100) / 100);
      setTotalSodium(Math.round(totalSodium * 100) / 100);
      setTotalSugar(Math.round(totalSugar * 100) / 100);
      setMealData(mealData);
    } catch (error) {
      console.error('Error fetching meal data:', error);
      setMealData([]);
    }
  };

  useEffect(() => {

    fetchMealData();
  }, [selectedDate]);

  const handleDeleteMeal = async (mealId: string) => {
    try {
      const response = await axios.delete(`http://localhost:3000/food/${mealId}`);
      if (response.status === 200) {
        fetchMealData();
      } else {
        console.error('Failed to delete meal');
      }
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };


  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className = "food-page">
      <Header />
      <div className = "bg-img-food">
        <div className="date-bar">
          <h3 className="select-date">Your food log for:</h3>
          <div className="arrow-icon" onClick={handlePreviousDay}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>

          <div className="datepicker-container">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              customInput={<CustomDatePickerInput />}
            />
          </div>

          <div className="arrow-icon" onClick={handleNextDay}>
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        </div>
        <div className="meal-container">
          <div className="food-heading">Food name</div>
          <div className="calories-heading">Calories</div>
          <div className='carbs-heading'>Carbs</div>
          <div className='fat-heading'>Fat</div>
          <div className="protein-heading">Protein</div>
          <div className="sodium-heading">Sodium</div>
          <div className="sugar-heading">Sugar</div>
          {mealTypes.map((type) => {
            const mealTypeArray = mealData.find((meal) => meal[0]?.mealType === type);

            return (
              <React.Fragment key={type}>
                <div className={`${type}-heading row-heading`}>
                  <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                  <button onClick={() => routeChange(type)}>+</button>
                </div>

                <div className={`${type}-name`}>
                  {mealTypeArray ? (
                    mealTypeArray.map((meal, mealIndex) => (
                    <div key={mealIndex}>{meal ? <div className="item-name">{meal.foodName}</div> : <div className="item-name">-</div>}</div>
                    ))
                    ) : (
                    <div className="item-name">-</div>
                    )}  
                </div>

                <div className={`${type}-calories`}>
                  {mealTypeArray ? (
                    mealTypeArray.map((meal, mealIndex) => (
                      <div key={mealIndex}>{meal ? <div className="item-calories">{meal.calories}</div> : <div className="item-calories">-</div>}</div>
                    ))
                  ) : (
                    <div className="item-calories">-</div>
                  )}
                </div>

                <div className={`${type}-carbs`}>
                  {mealTypeArray ? (
                    mealTypeArray.map((meal, mealIndex) => (
                      <div key={mealIndex}>{meal ? <div className="item-carbs">{meal.carbs}</div> : <div className="item-carbs">-</div>}</div>
                    ))
                  ) : (
                    <div className="item-carbs">-</div>
                  )}
                </div>

                <div className={`${type}-fat`}>
                  {mealTypeArray ? (
                    mealTypeArray.map((meal, mealIndex) => (
                      <div key={mealIndex}>{meal ? <div className="item-fat">{meal.fat}</div> : <div className="item-fat">-</div>}</div>
                    ))
                  ) : (
                    <div className="item-fat">-</div>
                  )}
                </div>

                <div className={`${type}-protein`}>
                  {mealTypeArray ? (
                    mealTypeArray.map((meal, mealIndex) => (
                      <div key={mealIndex}>{meal ? <div className="item-protein">{meal.protein}</div> : <div className="item-protein">-</div>}</div>
                    ))
                  ) : (
                    <div className="item-protein">-</div>
                  )}
                </div>

                <div className={`${type}-sodium`}>
                  {mealTypeArray ? (
                    mealTypeArray.map((meal, mealIndex) => (
                      <div key={mealIndex}>{meal ? <div className="item-sodium">{meal.sodium}</div> : <div className="item-sodium">-</div>}</div>
                    ))
                  ) : (
                    <div className="item-sodium">-</div>
                  )}
                </div>

                <div className={`${type}-sugar`}>
                  {mealTypeArray ? (
                    mealTypeArray.map((meal, mealIndex) => (
                      <div key={mealIndex}>{meal ? <div className="item-sugar">{meal.sugar}</div> : <div className="item-sugar">-</div>}</div>
                    ))
                  ) : (
                    <div className="item-sugar">-</div>
                  )}
                </div>
                <div className={`${type}-delete`}>
                  {mealTypeArray ? (
                    mealTypeArray.map((meal, mealIndex) => (
                      <div key={mealIndex}>{meal ? 
                      //   <button
                      //   className="delete-button"
                      //   onClick={() => handleDeleteMeal(meal._id)} // Pass the meal ID to delete
                      // >
                      //   Delete
                      // </button>
                      <FaTrash className="item-delete" onClick={() => handleDeleteMeal(meal._id)} />
                       : 
                       <div className="item-delete">-</div>}</div>
                    ))
                  ) : (
                    <div className="item-delete">-</div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
          <div className = "total-calories-heading">
            <h3>Total</h3>
          </div>
          <div className = "total-calories-value">{totalCalories !== 0 ? totalCalories: ""}</div>
          <div className = "total-carbs-value">{totalCarbs !== 0 ? totalCarbs: ""}</div>
          <div className = "total-fat-value">{totalFat !== 0 ? totalFat: ""}</div>
          <div className = "total-protein-value">{totalProtein !== 0 ? totalProtein: ""}</div>
          <div className = "total-sodium-value">{totalSodium !== 0 ? totalSodium: ""}</div>
          <div className = "total-sugar-value">{totalSugar !== 0 ? totalSugar: ""}</div>

        </div>
      </div>
    </div>
  );  
};

export default AddFood;

