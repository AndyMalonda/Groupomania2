import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Divider, ListItem, ListItemText, Typography } from "@mui/material";
import { BackButton } from "./BackButton";
import { formatDate } from "../services/utilities";

export default function AdminDashboard() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3006/posts/read/flagged", {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((response) => {
        console.log(response);
        setListOfPosts(response.data);
      });
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Publications signalées
      </Typography>
      {listOfPosts.map((value, key) => {
        return (
          <React.Fragment key={key}>
            <Divider />
            <ListItem
              sx={{
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "#f5f5f5",
                },
              }}
              onClick={() => {
                navigate(`/posts/${value.id}`);
              }}
            >
              <ListItemText
                primary={`${value.username} - ${formatDate(
                  value.createdAt
                )} - ${value.title} `}
                secondary={value.message}
              ></ListItemText>
            </ListItem>
          </React.Fragment>
        );
      })}
      <BackButton />
    </div>
  );
}
