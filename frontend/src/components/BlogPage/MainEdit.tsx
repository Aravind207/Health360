import "./BlogPage.scss";
import EditPost from './EditPost';
import EditBlogHeading from './EditBlogHeading';


const MainEdit = () => {
  return (
    <div className='Main'>
      <div className='CreatePost'>
        <EditBlogHeading />
        <EditPost />
      </div>
    </div>
  );
};

export default MainEdit;