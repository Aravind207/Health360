import { useNavigate } from "react-router-dom";
import "./BlogPage.scss";

const Header = () => {
  const navigate = useNavigate();

  const handleCreateBlog = () => {
    // Navigate to the create blog page
    navigate("/blogs/create");
  };

  return (
    <div className="blogTitle">
      <div>
        <h1 className="typing-animation">Edit Your Blog</h1>
      </div>
    </div>
  );
};

export default Header;