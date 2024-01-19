import "./Landing.scss"

const Review = () => {
    return ( 
        <div>
            <div className="rating">
                <img className= "starrating" src={process.env.PUBLIC_URL + "/starrating.png"}></img>
                <p className="rating-stat">2 Million 5-Star Reviews</p>
            </div>
            <ul className="reviews">
                <li>
                    <div className="image">
                        <img src = {process.env.PUBLIC_URL + "/John.png"} alt="user" className="user"/>
                        <p>Omar Siphron</p>
                    </div>
                    <p>Not only are the tools super helpful, the customer service is insanely awesome!</p>
                </li>
                <li>
                    <div className="image">
                        <img src = {process.env.PUBLIC_URL + "/Kaiya.png"} alt="user" className="user"/>
                        <p>Kaiya Lubin</p>
                    </div>
                    <p>Love this app. It keeps me on track with my nutritional goals.</p>
                </li>
                <li>
                    <div className="image">
                        <img src = {process.env.PUBLIC_URL + "/Erin.png"} alt="user" className="user"/>
                        <p>Erin Septimus</p>
                    </div>
                    <p>Friendly, easy-to-use app that keeps me accountable.</p>
                </li>
                <li>
                    <div className="image">
                        <img src = {process.env.PUBLIC_URL + "/Cristofer.png"} alt="user" className="user"/>
                        <p>Omar Siphron</p>
                    </div>
                    <p>Helped me get moving on my goals and tracking my weight loss and bodybuilding.</p>
                </li>
            </ul>
        </div>
    )
}

export default Review