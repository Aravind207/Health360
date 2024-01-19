import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../LandingPage/Header';
import './addExercise.scss';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FaTrash } from 'react-icons/fa';

interface ExerciseData {
  _id:string;
  caloriesBurned: number;
  minutes: number;
  exerciseName: string;
  date: string;
  userId: string;
}

interface JwtPayloadWithUserId extends JwtPayload {
  userId: string;
}

let userId: string;

const AddExercise: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [exerciseData, setExerciseData] = useState<ExerciseData[]>([]);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState<number>(0);
  const [totalMinutes, setTotalMinutes] = useState<number>(0);


  const token = localStorage.getItem('token');
  if (token) {
    const decoded: JwtPayloadWithUserId = jwtDecode(token) as JwtPayloadWithUserId;
    userId = decoded.userId;
  }

  let navigate = useNavigate();

  const routeChange = () => {
    let formattedDate = '';
    if (selectedDate) {
      const timezoneOffset = selectedDate.getTimezoneOffset();
      const adjustedDate = new Date(selectedDate.getTime() - timezoneOffset * 60000);
      formattedDate = adjustedDate.toISOString().split('T')[0];
    }
    let path = `/searchExercise/${formattedDate}`;
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

  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      const response = await axios.delete(`http://localhost:3000/exercise/${exerciseId}`);
      if (response.status === 200) {
        fetchExerciseData();
      } else {
        console.error('Failed to delete meal');
      }
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const fetchExerciseData = async () => {
    if (!selectedDate) return;

    try {
      const timezoneOffset = selectedDate.getTimezoneOffset();
      const adjustedDate = new Date(selectedDate.getTime() - timezoneOffset * 60000);
      const formattedDate = adjustedDate.toISOString().split('T')[0];

      let exerciseData: ExerciseData[] = []
      try {
          const response = await axios.get<ExerciseData[]>(
            `http://localhost:3000/exercise/${userId}/${formattedDate}`
          );
          exerciseData = response.data.map((exercise) => ({ ...exercise, userId }));
        } catch (error) {
          console.error(`Error fetching data:`, error);
      }

      console.log('Exercise data:', exerciseData);


      let totalCaloriesBurned = 0;
      let totalMinutes = 0;
      if(exerciseData.length > 0) {
        for(let i = 0; i < exerciseData.length; i++) {
          totalCaloriesBurned +=exerciseData[i].caloriesBurned;
          totalMinutes += exerciseData[i].minutes;
        }
      }

      setTotalCaloriesBurned(Math.round(totalCaloriesBurned * 100) / 100);
      setTotalMinutes(totalMinutes);
      setExerciseData(exerciseData);
    } catch (error) {
      console.error('Error fetching exercise data:', error);
      setExerciseData([]);
    }
  };

  useEffect(() => {
    fetchExerciseData();
  }, [selectedDate]);

  return (
    <div className = "exercise-page">
      <Header />
      <div className = "bg-img-exercise">
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
        <div className="exercise-container">
          <div className="exercise-name-heading">Exercise name</div>
          <div className="calories-burned-heading">Calories Burned</div>
          <div className="minutes-heading">Minutes</div>

          <div className="exercise-heading row-heading">
            <h3>Exercise</h3>
            <button onClick={() => routeChange()}>+</button>
          </div>

          <div className={`exercise-name`}>
            {exerciseData.length > 0 ? (
              exerciseData.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex}>{exercise ? <div className="item-name">{exercise.exerciseName}</div> : <div className="item-name">-</div>}</div>
              ))
            ) : (
              <div className="item-name">-</div>
            )}
          </div>

          <div className={`exercise-calories-burned`}>
            {exerciseData.length > 0 ? (
              exerciseData.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex}>{exercise ? <div className="item-calories-burned">{exercise.caloriesBurned}</div> : <div className="item-calories-burned">-</div>}</div>
              ))
            ) : (
              <div className="item-calories-burned">-</div>
            )}
          </div>

          <div className={`exercise-minutes`}>
            {exerciseData.length > 0 ? (
              exerciseData.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex}>{exercise ? <div className="item-minutes">{exercise.minutes}</div> : <div className="item-minutes">-</div>}</div>
              ))
            ) : (
              <div className="item-minutes">-</div>
            )}
          </div>

          <div className={`exercise-delete`}>
                  {exerciseData.length>0 ? (
                    exerciseData.map((exercise, exerciseIndex) => (
                      <div key={exerciseIndex}>{exercise ? 
                      <FaTrash className="item-delete" onClick={() => handleDeleteExercise(exercise._id)} />
                       : 
                       <div className="item-delete">-</div>}</div>
                    ))
                  ) : (
                    <div className="item-delete">-</div>
                  )}
                </div>

          <div className = "total-heading">
            <h3>Total</h3>
          </div>
          <div className = "total-calories-burned">{totalCaloriesBurned !== 0 ? totalCaloriesBurned: ""}</div>
          <div className = "total-minutes">{totalMinutes !== 0 ? totalMinutes: ""}</div>
        </div>
      </div>
    </div>
  );  
};

export default AddExercise;