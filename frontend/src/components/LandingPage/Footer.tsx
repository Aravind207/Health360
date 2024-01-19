import React from 'react';
import "./Landing.scss"
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice'; 
import { useTranslation } from 'react-i18next';


const Footer = () => {
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const {t} = useTranslation('common');
    let navigate = useNavigate();
    const routeChange = () => {
        let path = `signup`;
        navigate(path);
    }
    return (
        <footer>
            <section>
                <div className="footer-logo">
                    <img className="logo" src={process.env.PUBLIC_URL + "/Health360LOGO.png"} alt="Logo"></img>
                    <p>{t('title')}</p>
                </div>
                <p className="slogan">{t('slogan')}</p>
            </section>
            {!isLoggedIn && (
                <button className="footer-start" onClick={routeChange}>
                    Start Now
                </button>
            )}
            <div>
                <p className="certificate">©2023 Health360, Inc.</p>
                <div className="social">
                    <img className="icon" src={process.env.PUBLIC_URL + "/instagram.png"} alt="icon"></img>
                    <img className="icon" src={process.env.PUBLIC_URL + "/facebook.png"} alt="icon"></img>
                    <img className="icon" src={process.env.PUBLIC_URL + "/twitterx.png"} alt="icon"></img>
                    <img className="icon" src={process.env.PUBLIC_URL + "/reddit.png"} alt="icon"></img>
                </div>
            </div>
        </footer>
    )
}

export default Footer