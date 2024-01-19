import React from "react"
import "./Landing.scss"
import Header from "./Header"
import Main from "./Main"
import Review from "./Reviews"
import Footer from "./Footer"

const Landing = () => {
    return (
        <div className="landing">
            <Header />
            <Main />
            <Review />
            <Footer />
        </div>
    )
}

export default Landing