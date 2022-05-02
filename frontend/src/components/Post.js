import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/auth-context";
import toast, { Toaster } from "react-hot-toast";
import { BackButton } from "./BackButton";
import { formatDate, getHoursSincePost } from "../services/utilities";

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
  Tooltip,
  Divider,
} from "@mui/material";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3006/posts/${id}`, {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((response) => {
        setPostObject(response.data);
        console.log(response.data);
      });
    axios
      .get(`http://localhost:3006/comments/${id}`, {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((response) => {
        setComments(response.data);
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
        try {
          console.log(response.data);
          const commentToAdd = response.data;
          setComments([...comments, commentToAdd]);
          setNewComment("");
          toast.success("Commentaire posté !");
        } catch (error) {
          console.log(error);
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
        toast.success("Publication supprimée !");
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
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        direction={window.innerWidth < 768 ? "column" : "row"}
      >
        <Grid item xs={8}>
          <Box
            sx={{ boxShadow: 3, paddingTop: window.innerWidth < 768 ? 10 : 0 }}
          >
            <CardMedia
              component="img"
              key={postObject.imageUrl}
              image={postObject.imageUrl}
              alt={postObject.imageUrl}
              sx={{ maxHeight: 520 }}
            />
            <ListItem>
              <ListItemIcon>
                <Avatar
                  src={
                    postObject && postObject.User ? postObject.User.avatar : "A"
                  }
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  postObject && postObject.User ? postObject.User.username : ""
                }
                secondary={
                  postObject && postObject.createdAt
                    ? formatDate(postObject.createdAt)
                    : ""
                }
              ></ListItemText>
            </ListItem>
            <ListItem>
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
                {comments.map((comment, index) => {
                  return (
                    <React.Fragment key={index}>
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
                            src={comment.User.avatar}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={comment.User.username}
                          secondary={comment.message}
                        />
                        {authState.id === comment.UserId ||
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
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
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
            </Paper>
          </React.Fragment>
        </Grid>
      </Grid>
      <BackButton />
      {(authState.id === postObject.UserId || authState.isAdmin === true) && (
        <IconButton
          sx={
            window.innerWidth < 768
              ? {
                  position: "absolute",
                  top: 10,
                  right: 110,
                  backgroundColor: "white",
                }
              : { position: "absolute", bottom: 10, right: 110 }
          }
          onClick={() => {
            deletePost(postObject.id);
          }}
        >
          <DeleteIcon sx={{ fontSize: 50 }} />
        </IconButton>
      )}
      {authState.isAdmin === true && postObject.isFlagged === true && (
        <IconButton
          onClick={() => {
            unflagPost(postObject.id);
          }}
          sx={
            window.innerWidth < 768
              ? {
                  position: "absolute",
                  top: 10,
                  right: 180,
                  backgroundColor: "white",
                }
              : { position: "absolute", bottom: 10, right: 180 }
          }
        >
          <ReportOffIcon sx={{ fontSize: 50 }} />
        </IconButton>
      )}

      <Toaster />
    </div>
  );
}

export default Post;
