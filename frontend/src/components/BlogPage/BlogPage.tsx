import "../LandingPage/Landing.scss"
import "./BlogPage.scss"
import Header from "../LandingPage/Header"
import BlogFooter from "./BlogFooter"
import Main from "./Main"


const Blog = () => {
    return (
        <div className="blogPage">
            <Header />
            <Main />
        </div>
    )
}

export default Blog