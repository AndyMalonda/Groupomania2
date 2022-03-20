import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { FaRegThumbsUp } from "react-icons/fa";
import { AiOutlineComment } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";

function Home() {
  let navigate = useNavigate();

  const [listOfPosts, setListOfPosts] = useState([]);
  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/login");
    } else {
      axios.get("http://localhost:3006/posts").then((response) => {
        console.log(response);
        setListOfPosts(response.data);
      });
    }
  }, []);

  const likePost = (postId) => {
    axios
      .post(
        "http://localhost:3006/like",
        { PostId: postId },
        { headers: { token: sessionStorage.getItem("token") } }
      )
      .then((response) => {
        console.log(response.data);
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id == postId) {
              if (response.data.liked) {
                notifyLike();
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                notifyUnlike();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );
      });
  };

  const notifyLike = () => toast("Vous aimez cette publication !");
  const notifyUnlike = () => toast("Vous n'aimez plus cette publication !");

  return (
    <div className="Home">
      {listOfPosts.map((value, key) => {
        return (
          <div className="card w-50 p-3" key={value.id}>
            <div>{value.createdAt}</div>
            <img
              key={value.imageUrl}
              src={value.imageUrl}
              className="card-img-top"
              alt={value.imageUrl}
            />
            <div className="card-body">
              <h5 className="card-title" key={value.title}>
                {value.title}
              </h5>
              <p className="card-text" key={value.message}>
                {value.message}
              </p>
              <div className="d-flex justify-content-center">
                <div>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      likePost(value.id);
                    }}
                  >
                    <FaRegThumbsUp />
                  </button>
                  <div>{value.Likes.length}</div>
                </div>
                <div>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      navigate(`/posts/${value.id}`);
                    }}
                  >
                    <AiOutlineComment />
                  </button>
                  <div>cnt</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}

export default Home;
