import "../LandingPage/Landing.scss"

function BlogFooter() {
    return (
        <div>
            <footer className="footer">
            <p className="certificate">©2023 Health360, Inc.</p>
            <div className="social">
                <img className= "icon" src={process.env.PUBLIC_URL + "/instagram.png"} alt="icon"></img>
                <img className= "icon" src={process.env.PUBLIC_URL + "/facebook.png"} alt="icon"></img>
                <img className= "icon" src={process.env.PUBLIC_URL + "/twitterx.png"} alt="icon"></img>
                <img className= "icon" src={process.env.PUBLIC_URL + "/reddit.png"} alt="icon"></img>
            </div>
            </footer>
        </div>
    )
}

export default BlogFooter