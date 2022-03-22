// Scripts
import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Style
import "../styles/Home.css";
import { FaRegThumbsUp } from "react-icons/fa";
import { AiOutlineComment } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";

// Utilities
import { formatDate } from "../services/utilities";
import { AuthContext } from "../contexts/auth-context";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const notifyLike = () => toast("Vous aimez cette publication !");
  const notifyUnlike = () => toast("Vous n'aimez plus cette publication !");

  useEffect(() => {
    if (!authState.status) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3006/posts", {
          headers: { token: sessionStorage.getItem("token") },
        })
        .then((response) => {
          console.log(response);
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
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
            if (post.id === postId) {
              if (response.data.liked) {
                notifyLike();
                post.Likes.push(0);
                return post;
                // return { ...post, Likes: [...post.Likes, 0] };
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
        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  return (
    <div className="Home">
      {listOfPosts.map((value, key) => {
        return (
          <div className="card w-50 p-3" key={value.id}>
            <div>{formatDate(value.createdAt)}</div>
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
                    // className="btn btn-outline-primary"
                    className={
                      likedPosts.includes(value.id)
                        ? "btn btn-primary"
                        : "btn btn-outline-primary"
                    }
                    onClick={() => {
                      likePost(value.id);
                    }}
                  >
                    <FaRegThumbsUp
                      className={
                        likedPosts.includes(value.id)
                          ? "unlike-btn"
                          : "like-btn"
                      }
                    />
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
