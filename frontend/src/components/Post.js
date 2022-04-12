import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/auth-context";
import toast, { Toaster } from "react-hot-toast";
import { BackButton } from "./BackButton";

// Style
import SendIcon from "@mui/icons-material/Send";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportIcon from "@mui/icons-material/Report";
import ReportOffIcon from "@mui/icons-material/ReportOff";

// MUI
import {
  Box,
  Grid,
  CssBaseline,
  Paper,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CardMedia,
  IconButton,
  ListItemIcon,
} from "@mui/material";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();
  const notifyNewComment = () =>
    toast.success("Vous avez commenté cette publication !");
  const notifyDeleteComment = () => toast.success("Commentaire supprimé !");
  const notifyDeletePost = () => toast.success("Publication supprimée !");

  useEffect(() => {
    axios
      .get(`http://localhost:3006/posts/${id}`, {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((response) => {
        setPostObject(response.data);
      });
    axios
      .get(`http://localhost:3006/comments/${id}`, {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((response) => {
        setComments(response.data);
        console.log(response.data);
      });
  }, [id]);

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
        } else {
          const commentToAdd = {
            message: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
          notifyNewComment();
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3006/comments/${id}`, {
        headers: { token: sessionStorage.getItem("token") },
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
        { headers: { token: sessionStorage.getItem("token") } }
      )
      .then((response) => {
        console.log(response.data);
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

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3006/posts/${id}`, {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then(() => {
        navigate("/");
        notifyDeletePost();
      });
  };

  const unflagPost = (postId) => {
    axios
      .put(
        `http://localhost:3006/posts/unflag/${postId}`,
        { postId: postId },
        { headers: { token: sessionStorage.getItem("token") } }
      )
      .then(() => {
        navigate("/");
        toast.success("Publication désignalée !");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container">
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={8}>
          <Box sx={{ boxShadow: 3 }}>
            <CardMedia
              component="img"
              key={postObject.imageUrl}
              image={postObject.imageUrl}
              alt={postObject.imageUrl}
              sx={{ maxHeight: 520 }}
            />
            <ListItem>
              <ListItemIcon>
                <Avatar>{postObject.username}</Avatar>
              </ListItemIcon>
              <ListItemText
                primary={postObject.title}
                secondary={postObject.message}
              />
            </ListItem>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <React.Fragment>
            <CssBaseline />
            <Paper>
              <Typography
                variant="h5"
                gutterBottom
                component="div"
                sx={{ p: 2, pb: 0 }}
              >
                Commentaires
              </Typography>
              <List sx={{ mb: 2, maxHeight: 480, overflow: "auto" }}>
                {comments.map((comment, key) => {
                  return (
                    <React.Fragment key={comment.id}>
                      <ListItem
                        sx={{
                          backgroundColor:
                            comment.isFlagged && authState.isAdmin
                              ? "#ffff85"
                              : "",
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            alt="Profile Picture"
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(4).webp"
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={comment.username}
                          secondary={comment.message}
                        />

                        {authState.username === comment.username ||
                        authState.isAdmin === true ? (
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
            </Paper>
          </React.Fragment>
        </Grid>
      </Grid>
      <BackButton />
      {(authState.username === postObject.username ||
        authState.isAdmin === true) && (
        <IconButton
          sx={{ position: "absolute", bottom: 10, right: 110 }}
          onClick={() => {
            deletePost(postObject.id);
            notifyDeletePost();
          }}
        >
          <DeleteIcon sx={{ fontSize: 50 }} />
        </IconButton>
      )}
      {authState.isAdmin === true && postObject.isFlagged === true && (
        <IconButton
          sx={{ position: "absolute", bottom: 10, right: 180 }}
          onClick={() => {
            unflagPost(postObject.id);
          }}
        >
          <ReportOffIcon sx={{ fontSize: 50 }} />
        </IconButton>
      )}

      <Toaster />
    </div>
  );
}

export default Post;
