import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../LandingPage/Header';
import {jwtDecode, JwtPayload} from 'jwt-decode'
import { useNavigate} from "react-router-dom"
import "./searchExercise.scss"

type ExerciseItem = {
  userId: string;
  date: string;
  exerciseName: string;
  caloriesBurned: number;
  minutes: number
}

type Params = {
  formattedDate: string;
}

interface JwtPayloadWithUserId extends JwtPayload {
    userId: string;
}

let userId: string;

const SearchFood: React.FC = () => {
  const navigate=useNavigate();
  const {formattedDate } = useParams<Params>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [initialCaloriesBurned, setInitialCaloriesBurned] = useState<number>(0);
  const [initialMinutes, setInitialMinutes] = useState<number>(0);
  const date = formattedDate!;

  const token = localStorage.getItem('token');
  if(token) {
    const decoded: JwtPayloadWithUserId = jwtDecode(token) as JwtPayloadWithUserId;
    userId = decoded.userId;
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const duration = parseInt(e.target.value);
    setSelectedDuration(duration);
  
    if (selectedExercise) {
      if (duration === 0 || Number.isNaN(duration)) {
        setSelectedExercise({ ...selectedExercise, caloriesBurned: initialCaloriesBurned, minutes: initialMinutes });

        const updatedSearchResults = searchResults.map((exercise: any) =>
        exercise && exercise.name === selectedExercise?.exerciseName ? { ...exercise, duration_min: initialMinutes} : exercise
        );
        setSearchResults(updatedSearchResults);
      } else {
        const updatedCaloriesBurned = Math.round((initialCaloriesBurned * duration * 100) / (initialMinutes * 100));
        const updatedMinutes = duration;
        const updatedSelectedExercise = { ...selectedExercise, caloriesBurned: updatedCaloriesBurned, minutes: updatedMinutes };
        setSelectedExercise(updatedSelectedExercise);

        const updatedSearchResults = searchResults.map((exercise: any) =>
        exercise && exercise.name === selectedExercise?.exerciseName ? { ...exercise, duration_min: updatedMinutes} : exercise
      );
      setSearchResults(updatedSearchResults);
    }
  }
};
  

  const searchExercise = async () => {
    try {
      setSearchResults([]);
      setSelectedExercise(null);
      if (searchTerm !== "") {
        const response = await axios.post(`https://trackapi.nutritionix.com/v2/natural/exercise`, 
        {
            query: searchTerm
        },
        {
            headers: {
                'Content-type': 'application/json',
                'x-app-id': '5694690a',
                'x-app-key': 'e2cae258b8e23d9a3619ad82895254ff'
            },
        });    

        if (response.data.exercises.length === 0) {
            setError("No results found!");
        }
        setSearchResults(response.data.exercises.slice(0, 5));
      } else {
        setError("Please provide a phrase to search for!");
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError("Error fetching search results!");
    }
  };

  const handleClick = async (exercise: any) => {

    const selectedExerciseObj: ExerciseItem = {
        userId: userId, 
        exerciseName: exercise.name,
        date: date,
        caloriesBurned: exercise.nf_calories,
        minutes: exercise.duration_min
    };

    setSelectedExercise(selectedExerciseObj);
    setInitialCaloriesBurned(exercise.nf_calories);
    setInitialMinutes(exercise.duration_min);
  };

    const handleSave = async () => {
        if (searchResults.length > 0) {
            try {
                const exercisesToSave: ExerciseItem[] = searchResults.map((exercise: any) => ({
                userId: userId,
                exerciseName: exercise.name,
                date: date,
                caloriesBurned: exercise.nf_calories,
                minutes: exercise.duration_min
                }));
        
                if (exercisesToSave.length > 0) {
                const res = await axios.post("http://localhost:3000/addExercises", exercisesToSave);
                if (res.status === 200) {
                    navigate("/addExercise");
                }
                } else {
                    setError("No exercises to save!");
                }
                } catch (error: any) {
                    setError("Error saving the values!");
                }
            } else {
                setError("Please search and select exercises to save!");
            }
    };

  return (
    <div className="search-exercise-page">
      <Header />
      <div className = "bg-img-exercise">
        <div className="search-exercise-container-wrapper">
            <div className = "search-exercise-page-container">
                <div className="search-exercise-input-section">
                <h2 className = "search-exercise-heading">Search Exercises</h2>
                <div>
                    <input 
                    className='search-exercise-input'
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setError("");
                    }}
                    placeholder={`(e.g.) swimming 1 hour, jogging 30 mins`}
                    />
                    <button className='search-exercise-btn' onClick={searchExercise}>Search</button>
                 </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <div className='search-exercise-result'>
              <h3>Search Results:</h3>
              {searchResults.length>0 && (
                    <div>
                        <p>Select to edit duration or view summary:</p>
                    </div>
                )}
              <ul className='search-exercise-list'>
                {searchResults.map((item, index) => (
                    <div>
                        <li className = "search-exercise-item" key={index} onClick={() => handleClick(item)}>
                        {item.name} ({item.duration_min} minutes)
                        </li>
                    </div>
                  
                ))}
              </ul>
            </div>

            <div className = "edit-exercise">
              {selectedExercise && (
                <div className='edit-exercise-container'>
                  <div className='select-exercise-and-edit'>
                    <h3 className='selected-exercise'>Selected Exercise: {selectedExercise.exerciseName.charAt(0).toUpperCase() + selectedExercise.exerciseName.slice(1)}</h3>
                    <div className='select-duration-container'>
                      <h3>Select Duration:</h3>
                      <input className='add-duration-input' name = "duration" value = {selectedDuration} type="number" placeholder='Change Duration' onChange={handleDurationChange}/>
                    </div>
                  </div>
                  <div className='exercise-summary'>
                    <h3>Exercise Summary:</h3>
                    <p>Calories Burned: {selectedExercise.caloriesBurned}</p>
                    <p>Duration in Minutes: {selectedExercise.minutes}</p>
                  </div>
                </div>
                
              )}
            </div>
            {searchResults.length>0 && (
            <div className='save-exercises-container'>
                {searchResults.length === 1 ? <button className='save-exercises-btn' onClick={handleSave}>Save</button> 
                : <button className='save-exercises-btn' onClick={handleSave}>Save All</button>}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFood;