import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Post.css";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

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
      .post("http://localhost:3006/comments", {
        message: newComment,
        PostId: id,
      })
      .then((response) => {
        const commentToAdd = { message: newComment };
        setComments([...comments, commentToAdd]);
        setNewComment("");
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
            <div className="col-md-8 col-lg-6">
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
                    <button onClick={addComment}>Commenter</button>
                  </div>
                  {/* Comments section */}
                  <div className="listOfComments">
                    {comments.map((comment, key) => {
                      return (
                        <div key={key} className="card mb-4">
                          <div key={key} className="card-body">
                            <p key={comment.message}>{comment.message}</p>

                            <div className="d-flex justify-content-between">
                              <div className="d-flex flex-row align-items-center">
                                <img
                                  src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(4).webp"
                                  alt="avatar"
                                  width="25"
                                  height="25"
                                />
                                <p className="small mb-0 ms-2">John Doe</p>
                              </div>
                              <div className="d-flex flex-row align-items-center">
                                <p className="small text-muted mb-0">Upvote?</p>
                                <i className="far fa-thumbs-up mx-2 fa-xs text-black"></i>
                                <p className="small text-muted mb-0">3</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* <div className="card mb-4">
                    <div className="card-body">
                      <p>Type your note, and hit enter to add it</p>

                      <div className="d-flex justify-content-between">
                        <div className="d-flex flex-row align-items-center">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(4).webp"
                            alt="avatar"
                            width="25"
                            height="25"
                          />
                          <p className="small mb-0 ms-2">Martha</p>
                        </div>
                        <div className="d-flex flex-row align-items-center">
                          <p className="small text-muted mb-0">Upvote?</p>
                          <i className="far fa-thumbs-up mx-2 fa-xs text-black"></i>
                          <p className="small text-muted mb-0">3</p>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="card mb-4">
                    <div className="card-body">
                      <p>Type your note, and hit enter to add it</p>

                      <div className="d-flex justify-content-between">
                        <div className="d-flex flex-row align-items-center">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp"
                            alt="avatar"
                            width="25"
                            height="25"
                          />
                          <p className="small mb-0 ms-2">Johny</p>
                        </div>
                        <div className="d-flex flex-row align-items-center">
                          <p className="small text-muted mb-0">Upvote?</p>
                          <i className="far fa-thumbs-up mx-2 fa-xs text-black"></i>
                          <p className="small text-muted mb-0">4</p>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="card mb-4">
                    <div className="card-body">
                      <p>Type your note, and hit enter to add it</p>

                      <div className="d-flex justify-content-between">
                        <div className="d-flex flex-row align-items-center">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(31).webp"
                            alt="avatar"
                            width="25"
                            height="25"
                          />
                          <p className="small mb-0 ms-2">Mary Kate</p>
                        </div>
                        <div className="d-flex flex-row align-items-center text-primary">
                          <p className="small mb-0">Upvoted</p>
                          <i className="fas fa-thumbs-up mx-2 fa-xs"></i>
                          <p className="small mb-0">2</p>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="card">
                    <div className="card-body">
                      <p>Type your note, and hit enter to add it</p>

                      <div className="d-flex justify-content-between">
                        <div className="d-flex flex-row align-items-center">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp"
                            alt="avatar"
                            width="25"
                            height="25"
                          />
                          <p className="small mb-0 ms-2">Johny</p>
                        </div>
                        <div className="d-flex flex-row align-items-center">
                          <p className="small text-muted mb-0">Upvote?</p>
                          <i className="far fa-thumbs-up ms-2 fa-xs text-black"></i>
                        </div>
                      </div>
                    </div>
                  </div> */}
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
