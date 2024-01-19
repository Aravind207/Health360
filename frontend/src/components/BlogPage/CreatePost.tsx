import React, { useState, ChangeEvent, FormEvent } from "react";
import "react-quill/dist/quill.snow.css";
import { useNavigate} from "react-router-dom";
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  // const [author, setAuthor] = useState<string>("");
  
  // const [files, setFiles] = useState<File[]>([]);
const navigate = useNavigate();
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

    
  interface JwtPayloadWithUserId extends JwtPayload {
    userId: string;
}

let userId = 'string';
const token = localStorage.getItem('token');
if (token) {
    const decoded: JwtPayloadWithUserId = jwtDecode(token) as JwtPayloadWithUserId;
    userId = decoded.userId;
}

  async function createNewPost(ev: FormEvent) {
    ev.preventDefault();
    const data = {
      title: title,
      description: content,
      userId : userId,

    };

    console.log(data);

    try{
      const response = await fetch("http://localhost:3000/blogs", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
      console.log('RESPONSE', response)
      if(response.status === 200){
        navigate("/blogs");
      }
    }
    catch(error){
      console.log(error);
    }

  }

  return (
    <form className="createpost" onSubmit={createNewPost}>
      <br />
      <input
        type="text"
        className="title"
        placeholder={"Title"}
        value={title}
        onChange={(ev: ChangeEvent<HTMLInputElement>) => setTitle(ev.target.value)}
        required
      /> 
      <textarea
        placeholder="Content"
        value={content}
        onChange={(ev: ChangeEvent<HTMLTextAreaElement>) => setContent(ev.target.value)}
        required
        rows={4} // Adjust the number of rows as needed 
        cols={100} // Adjust the number of columns as needed
        ></textarea>

      <button className = "submit" type="submit">Create Post</button>

    </form>
      );
};

export default CreatePost;