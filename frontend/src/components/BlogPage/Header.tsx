import "./BlogPage.scss";

const Header = () => {
  return (
    <div>
      <header className="navbar">
        <div className="top-logo">
          <img className="logo" src={process.env.PUBLIC_URL + "/Health360LOGO.png"} alt="Logo" />
          <h2 className="name">Health360</h2>
        </div>
        <nav>
          <a href="/login">Login</a>
        </nav>
      </header>
    </div>
  );
};

export default Header;
