import "./Landing.scss"
import {useNavigate} from 'react-router-dom';

const Main = () => {
    let navigate = useNavigate(); 
    const routeChange = () =>{ 
      let path = `signup`; 
      navigate(path);
    }
    return (
        <div className="main-area">
                <img src={process.env.PUBLIC_URL + "/mainpagepic.png"} alt="healthpic" className="healthpic"></img>
                <img className= "logo-inside" src={process.env.PUBLIC_URL + "/Health360LOGO.png"} alt="Logo"></img>
            <div className="img-item">
                <p className="fav">Your favourite fitness app</p>
                <p className="goal">Reach your Goals with</p>
                <p className="goalA">Health360</p>
                <p className="about">Build healthy habits with the all-in-one food, exercise, and calorie tracker.</p>
            </div>
        <button className= "sign-up" 
                    onClick={routeChange}>
                    Start Your Journey Now
        </button>
        </div>
    )
}

export default Main


