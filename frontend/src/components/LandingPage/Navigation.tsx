import React from 'react';
import './Landing.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {

  const {t} = useTranslation('common');
  return (
    <div className = "navigation-bar">
        <div>
            <a href ="/dashboard">{t('navbar.myhome')}</a>
        </div>
        <div>
            <a href ="/addFood">{t('navbar.food')}</a>
        </div>
        <div>
            <a href ="/addExercise">{t('navbar.exercise')}</a>
        </div>
        <div>
            <a href ="blogs">{t('navbar.blog')}</a>
        </div>
        <div>
            <a href ="/dietPlan">{t('navbar.dietplan')}</a>
        </div>
        <div>
            <a href ="/workoutPlan">{t('navbar.workoutplan')}</a>
        </div>
        <div>
        <Link to="/update-profile">{t('navbar.updateprofile')}</Link>
      </div>
    </div>
  );
};

export default Header;