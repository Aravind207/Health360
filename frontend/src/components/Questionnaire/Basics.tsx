import React, { FormEvent, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../LandingPage/Header";
import "./basics.scss";
import { JwtPayload, jwtDecode } from "jwt-decode";

let userIdVal: string;

interface JwtPayloadWithUserId extends JwtPayload {
  userId: string;
}

function Basics() {
  const navigate = useNavigate();
  interface FormData {
    age: number;
    height: number;
    weight: number;
    sexAtBirth: string;
    foodPreference: string;
    fitnessGoal: string;
  }

  interface FormErrors {
    ageError: boolean;
    heightError: boolean;
    weightError: boolean;
    sexAtBirthError: boolean;
    foodPreferenceError: boolean;
    fitnessGoalError: boolean;
  }

  const [formData, setFormData] = useState<FormData>({
    age: 0,
    height: 0,
    weight: 0,
    sexAtBirth: "",
    foodPreference: "",
    fitnessGoal: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    ageError: false,
    heightError: false,
    weightError: false,
    sexAtBirthError: false,
    foodPreferenceError: false,
    fitnessGoalError: false,
  });

  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = () => {
    let valid = true;
    const newErrors: FormErrors = { ...formErrors };

    for (const key in formData) {
      if (formData[key as keyof FormData] === 0 || formData[key as keyof FormData] === "") {
        newErrors[`${key}Error` as keyof FormErrors] = true;
        valid = false;
      }
    }

    setFormErrors(newErrors);
    return valid;
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (token) {
      const decoded: JwtPayloadWithUserId = jwtDecode(token) as JwtPayloadWithUserId;
      userIdVal = decoded.userId;
    }

    if (validateForm()) {
      try {
        const res = await axios.post(
          "http://localhost:3000/user-profile/",
          {...formData, userId: userIdVal}
        );
        if (res.status === 200) {
          navigate("/dashboard", { state: { id: localStorage.getItem("id") } });
        }
      } catch (error: any) {
        setErrorMessage(
          "An error occurred. Please check your details and try again."
        );
      }
    } else {
      setErrorMessage("Please fill in all required fields.");
    }
  };

  return (
    <div className="basics-container">
      <Header></Header>
      <p className="basics-heading">You have taken your first step towards a healthier lifestyle!<br/>
                    We would like to know more about you to provide a seamless fitness experience.</p>
      <form className="basics-form" onSubmit={submit}>
        <input
          className={formErrors.ageError ? "error" : ""}
          name="age"
          type="number"
          onChange={(e) => setFormData({ ...formData, age: +e.target.value })}
          placeholder="Age"
        />
        <input
          className={formErrors.heightError ? "error" : ""}
          name="height"
          type="number"
          onChange={(e) =>
            setFormData({ ...formData, height: +e.target.value })
          }
          placeholder="Height (in cm)"
        />
        <input
          className={formErrors.weightError ? "error" : ""}
          name="weight"
          type="number"
          onChange={(e) =>
            setFormData({ ...formData, weight: +e.target.value })
          }
          placeholder="Weight (in Pounds)"
        />
        <select
          className={formErrors.sexAtBirthError ? "error" : ""}
          name="sexAtBirth"
          onChange={(e) =>
            setFormData({ ...formData, sexAtBirth: e.target.value })
          }
        >
          <option value="" disabled selected>
            Select Sex at Birth
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          className={formErrors.foodPreferenceError ? "error" : ""}
          name="foodPreference"
          onChange={(e) =>
            setFormData({ ...formData, foodPreference: e.target.value })
          }
        >
          <option value="" disabled selected>
            Select Food Preference
          </option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
          <option value="Vegan">Vegan</option>
        </select>
        <select
          className={formErrors.fitnessGoalError ? "error" : ""}
          name="fitnessGoal"
          onChange={(e) =>
            setFormData({ ...formData, fitnessGoal: e.target.value })
          }
        >
          <option value="" disabled selected>
            Select Fitness Goal
          </option>
          <option value="Weight-Gain">Weight Gain</option>
          <option value="Weight-Loss">Weight Loss</option>
          <option value="Maintain-Weight">Maintain Weight</option>
        </select>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Basics;
