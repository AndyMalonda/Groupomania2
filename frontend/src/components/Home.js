import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import "./Home.css";
import "../bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function Home() {
  let navigate = useNavigate();

  const [listOfPosts, setListOfPosts] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3006/posts").then((response) => {
      console.log(response);
      setListOfPosts(response.data);
    });
  }, []);

  return (
    <div className="Home">
      {listOfPosts.map((value, key) => {
        return (
          <div
            className="card w-50 p-3"
            key={value.id}
            onClick={() => {
              navigate(`/posts/${value.id}`);
            }}
          >
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
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
