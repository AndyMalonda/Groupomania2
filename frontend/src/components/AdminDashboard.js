import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Divider,
  // Icon,
  IconButton,
  ListItem,
  // ListItemButton,
  // ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { BackButton } from "./BackButton";
import { formatDate } from "../services/utilities";
import ReportOffIcon from "@mui/icons-material/ReportOff";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [listOfComments, setListOfComments] = useState([]);
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

  useEffect(() => {
    axios
      .get("http://localhost:3006/comments/read/flagged", {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((response) => {
        console.log(response);
        setListOfComments(response.data);
      });
  }, []);

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3006/comments/${id}`, {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then(() => {
        toast.success("Commentaire supprimé !");
        setListOfComments(
          listOfComments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const unflagComment = (commentId) => {
    axios
      .put(
        `http://localhost:3006/comments/unflag/${commentId}`,
        { commentId: commentId },
        { headers: { token: sessionStorage.getItem("token") } }
      )
      .then((response) => {
        console.log(response.data);
        toast.success("Commentaire désignalé !");
        setListOfComments(
          listOfComments.map((val) => {
            if (val.id === commentId) {
              val.isFlagged = false;
            }
            return val;
          })
        );
      });
  };

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
      <Divider />
      <Typography variant="h4" gutterBottom>
        Commentaires signalés
      </Typography>
      {listOfComments.map((value, key) => {
        return (
          <React.Fragment key={key}>
            <Divider />
            <ListItem>
              <IconButton>
                <ReportOffIcon
                  onClick={() => {
                    unflagComment(value.id);
                  }}
                />
              </IconButton>
              <IconButton
                onClick={() => {
                  deleteComment(value.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
              <ListItemText
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "#f5f5f5",
                  },
                }}
                onClick={() => {
                  navigate(`/posts/${value.PostId}`);
                }}
                primary={`${value.username} - ${formatDate(
                  value.createdAt
                )} - ${value.message} `}
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
