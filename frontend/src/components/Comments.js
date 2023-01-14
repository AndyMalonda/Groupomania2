import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/auth-context";
import toast from "react-hot-toast";

import { formatDate, getHoursSincePost } from "../services/utilities";

// Style
import SendIcon from "@mui/icons-material/Send";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ReportIcon from "@mui/icons-material/Report";

// MUI
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";

function Comments(props) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  const postId = props.postId;

  useEffect(() => {
    axios
      .get(`http://localhost:3006/comments/${postId}`, {
        headers: {
          token: JSON.parse(sessionStorage.getItem("groupomaniaAndy")).token,
        },
      })
      .then((response) => {
        setComments(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const addComment = () => {
    axios
      .post(
        `http://localhost:3006/comments`,
        { message: newComment, PostId: postId },
        {
          headers: {
            token: JSON.parse(sessionStorage.getItem("groupomaniaAndy")).token,
          },
        }
      )
      .then((response) => {
        setComments(comments.concat(response.data));
        setNewComment("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3006/comments/${id}`, {
        headers: {
          token: JSON.parse(sessionStorage.getItem("groupomaniaAndy")).token,
        },
      })
      .then(() => {
        toast.success("Commentaire supprimé !");
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const flagComment = (commentId) => {
    axios
      .put(
        `http://localhost:3006/comments/flag/${commentId}`,
        { commentId: commentId },
        {
          headers: {
            token: JSON.parse(sessionStorage.getItem("groupomaniaAndy")).token,
          },
        }
      )
      .then((response) => {
        toast.success("Commentaire signalé !");
        // reset list of comments
        setComments(
          comments.map((val) => {
            if (val.id === commentId) {
              val.isFlagged = true;
            }
            return val;
          })
        );
      });
  };

  return (
    <List sx={{ mb: 2, maxHeight: 480, overflow: "auto" }}>
      {comments.map((comment, index) => {
        return (
          <React.Fragment key={index}>
            <ListItem
              sx={{
                backgroundColor:
                  comment.isFlagged && authState.isAdmin ? "#ffff85" : "",
              }}
            >
              <ListItemAvatar>
                <Avatar alt="Profile Picture" src={comment.User.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={comment.User.username}
                secondary={comment.message}
              />
              {authState.id === comment.UserId || authState.isAdmin === true ? (
                <>
                  <IconButton
                    size="small"
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    <HighlightOffIcon />
                  </IconButton>
                </>
              ) : comment.isFlagged ? (
                <></>
              ) : (
                <>
                  <IconButton
                    size="small"
                    onClick={() => {
                      flagComment(comment.id);
                    }}
                  >
                    <ReportIcon />
                  </IconButton>
                </>
              )}
            </ListItem>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Tooltip
                title={
                  comment && comment.createdAt
                    ? formatDate(comment.createdAt)
                    : ""
                }
              >
                <Typography variant="caption" color="text.secondary">
                  {comment && comment.createdAt
                    ? getHoursSincePost(comment.createdAt)
                    : ""}
                </Typography>
              </Tooltip>
            </Box>
            <Divider />
          </React.Fragment>
        );
      })}
      <ListItem>
        <TextField
          fullWidth
          id="outlined-multiline-flexible"
          label="Votre commentaire"
          multiline
          value={newComment}
          onChange={(event) => {
            setNewComment(event.target.value);
          }}
        />
        <IconButton edge="end" onClick={addComment}>
          <SendIcon />
        </IconButton>
      </ListItem>
    </List>
  );
}

export default Comments;
