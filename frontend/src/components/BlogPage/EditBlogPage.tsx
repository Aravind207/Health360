import "../LandingPage/Landing.scss"
import "./BlogPage.scss"
import Header from "../LandingPage/Header"
import BlogFooter from "./BlogFooter"
import MainEdit from "./MainEdit"

const Blog = () => {
    return (
        <div className="blogPage">
            <Header />
            <MainEdit />
            <BlogFooter />
        </div>
    )
}

export default Blog