import "./BlogPage.scss";
import CreatePost from './CreatePost';
import CreateBlogHeading from './CreateBlogHeading';

const MainCreate = () => {
  return (
    <div className='Main'>
      <div className='CreatePost'>
        <CreateBlogHeading />
        <CreatePost />
      </div>
    </div>
  );
};

export default MainCreate;