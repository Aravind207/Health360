import "../LandingPage/Landing.scss"
import "./BlogPage.scss"
import BlogFooter from "./BlogFooter"
import Header from "../LandingPage/Header"
import MainCreate from "./MainCreate"

const Blog = () => {
    return (
        <div className="blogPage">
            <Header />
            <MainCreate />
            <BlogFooter />
        </div>
    )
}

export default Blog