import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import Navigation from './Navigation';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { JwtPayload, jwtDecode } from 'jwt-decode';

interface JwtPayloadWithUserId extends JwtPayload {
  userId: string;
}

let userId: string;


const Header: React.FC = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const history = useNavigate();
  const [firstName, setFirstName] = useState<string>("");

  async function fetchUser(userId: string) {
    try {
      const userResponse = await axios.get(`http://localhost:3000/user/${userId}`);
      setFirstName(userResponse.data.firstName);
      return userResponse.data.firstName;
    } catch (error) {
      throw new Error("Failed to fetch user profile");
    }
  }

  if(isLoggedIn) {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded: JwtPayloadWithUserId = jwtDecode(token) as JwtPayloadWithUserId;
      userId = decoded.userId;
    }
    fetchUser(userId);
  }

  const {t} = useTranslation('common');
  const handleLogout = () => {
    dispatch(logout());
    history('/');
  };

  return (
    <div>
      <header className="navbar">
          <a href={isLoggedIn ? "/dashboard" : "/"} className="top-logo">
            <img className="logo" src={process.env.PUBLIC_URL + "/Health360LOGO.png"} alt="Logo" />
            <h2 className="name">{t('title')}</h2>
          </a>
        <nav>
          {isLoggedIn ? (
            <div className="nav-items">
              <p>{t('greeting.label')}, {firstName}</p>
              <a href="/" onClick={handleLogout}>
                {t('logout.button.label')}
              </a>
            </div>
          ) : (
            <a href="/login">Login</a>
          )}
        </nav>
      </header>
      <div>
        {isLoggedIn ? (
          <Navigation />
        ) : (<div></div>)}
      </div>
    </div>

  );
};

export default Header;