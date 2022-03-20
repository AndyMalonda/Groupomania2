import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/auth-context";

// Style
import "../styles/Post.css";
import { FaRegThumbsUp } from "react-icons/fa";
import { RiChatDeleteFill } from "react-icons/ri";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  let navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:3006/posts/${id}`).then((response) => {
      setPostObject(response.data);
    });
    axios.get(`http://localhost:3006/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3006/comments",
        {
          message: newComment,
          PostId: id,
        },
        { headers: { token: sessionStorage.getItem("token") } }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          navigate("/login");
        } else {
          const commentToAdd = {
            message: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3006/comments/${id}`, {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id != id;
          })
        );
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col w-90 p-3">
          <div className="card" key={postObject.id}>
            <img
              key={postObject.imageUrl}
              src={postObject.imageUrl}
              className="card-img-top"
              alt={postObject.imageUrl}
            />
            <div className="card-body">
              <h5 className="card-title" key={postObject.title}>
                {postObject.title}
              </h5>
              <p className="card-text" key={postObject.message}>
                {postObject.message}
              </p>
            </div>
          </div>
        </div>
        {/* Comment input section */}
        <div className="col w-90 p-3">
          <div className="row d-flex justify-content-center">
            <div className="col-md-8">
              {/* col-lg-6 */}
              <div className="card shadow-0 border">
                <div className="card-body p-4">
                  <div className="form-outline mb-4">
                    <input
                      type="text"
                      id="addComment"
                      className="form-control"
                      placeholder="Votre commentaire"
                      value={newComment}
                      onChange={(event) => {
                        setNewComment(event.target.value);
                      }}
                    />
                    <button className="btn btn-primary" onClick={addComment}>
                      Commenter
                    </button>
                  </div>
                  {/* Comments section */}
                  <div className="listOfComments">
                    {comments.map((comment, key) => {
                      return (
                        <div key={key} className="card mb-4">
                          <div key={key} className="card-body">
                            <p key={comment.message}>{comment.message}</p>
                            {authState.username === comment.username && (
                              <RiChatDeleteFill
                                onClick={() => {
                                  deleteComment(comment.id);
                                }}
                              />
                            )}

                            <div className="d-flex justify-content-between">
                              <div className="d-flex flex-row align-items-center">
                                <img
                                  src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(4).webp"
                                  alt="avatar"
                                  width="25"
                                  height="25"
                                />
                                <p className="small mb-0 ms-2">
                                  {comment.username}
                                </p>
                              </div>
                              <div className="d-flex flex-row align-items-center">
                                <FaRegThumbsUp />
                                <p className="small text-muted mb-0">Count</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
