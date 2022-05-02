// Scripts
import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LateralNav from "./LateralNav";
import TopNav from "./TopNav";

// Style
import toast, { Toaster } from "react-hot-toast";
import ReportIcon from "@mui/icons-material/Report";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

// Utilities
import { formatDate } from "../services/utilities";
import { AuthContext } from "../contexts/auth-context";

// MUI
import {
  Avatar,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  IconButton,
  SvgIcon,
  Tooltip,
  CardContent,
  Typography,
  Divider,
  Container,
  Button,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { red } from "@mui/material/colors";

// MUI
function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const notifyLike = () => toast("Vous aimez cette publication !");
  const notifyUnlike = () => toast("Vous n'aimez plus cette publication !");

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      console.log("no token in storage");
      navigate("/login");
      return;
    }
    if (!authState) {
      console.log("no authState");
      sessionStorage.removeItem("token");
      navigate("/login");
      return;
    } else {
      axios
        .get("http://localhost:3006/posts", {
          headers: { token: sessionStorage.getItem("token") },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
        })
        .catch((err) => {
          console.log(err);
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
        // render the new list of posts
        const modifiedPosts = listOfPosts.map((post) => {
          // if the postId matches the postId of the post we just liked
          if (post.id === postId) {
            if (response.data.liked) {
              notifyLike();
              // push the postId to the Likes array
              post.Likes.push(0);
              // return the post with the new Likes array
              return post;
            } else {
              const likesArray = post.Likes;
              // remove the last element of the Likes array
              likesArray.pop();
              notifyUnlike();
              // and return the post with the new array
              return { ...post, Likes: likesArray };
            }
          } else {
            return post;
          }
        });
        setListOfPosts(modifiedPosts);
        // if the likedPosts array contains the postId we just liked
        if (likedPosts.includes(postId)) {
          setLikedPosts(
            // filter the likedPosts array to remove the postId
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          // else add the postId to the likedPosts array and set the state
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  const reportPost = (postId) => {
    axios
      .put(
        `http://localhost:3006/posts/flag/${postId}`,
        { postId: postId },
        { headers: { token: sessionStorage.getItem("token") } }
      )
      .then((response) => {
        console.log(response.data);
        toast("Publication signalée !");
        axios
          .get("http://localhost:3006/posts", {
            headers: { token: sessionStorage.getItem("token") },
          })
          .then((response) => {
            setListOfPosts(response.data.listOfPosts);
          });
      });
  };

  const isNotAuthor = (post) => {
    if (post.UserId === authState.id) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className="Home">
      {/* {window.innerWidth < 768 ? <LateralNav /> : <TopNav />} */}
      <TopNav />
      {listOfPosts &&
        listOfPosts.map((value, key) => {
          return (
            <Container
              key={value.id}
              sx={{ justifyContent: "center", marginTop: 10 }}
            >
              <Card sx={{ maxWidth: 768, m: 2 }}>
                <CardHeader
                  avatar={
                    <>
                      <Tooltip title={value.User.username}>
                        <Link to={`/profile/${value.UserId}`}>
                          <Avatar src={value.User.avatar || "../icon.svg"} />
                        </Link>
                      </Tooltip>
                    </>
                  }
                  action={
                    <>
                      {!value.isFlagged && isNotAuthor(value) && (
                        <>
                          <IconButton
                            aria-label="flag"
                            onClick={() => {
                              reportPost(value.id);
                            }}
                          >
                            <Tooltip title="Signaler">
                              <ReportIcon />
                            </Tooltip>
                          </IconButton>
                        </>
                      )}
                    </>
                  }
                  title={value.title}
                  subheader={formatDate(value.createdAt)}
                />
                <Box
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => {
                    navigate(`/posts/${value.id}`);
                  }}
                >
                  {value.imageUrl ? (
                    <CardMedia
                      component="img"
                      height="400"
                      image={value.imageUrl}
                    />
                  ) : (
                    <Divider />
                  )}
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {value.message}
                    </Typography>
                  </CardContent>
                </Box>
                <Divider variant="middle" />

                <CardActions
                  disableSpacing
                  sx={{ justifyContent: "space-evenly" }}
                >
                  <Button
                    sx={{ width: 1 }}
                    aria-label="add to favorites"
                    onClick={() => {
                      likePost(value.id);
                    }}
                  >
                    <SvgIcon
                      sx={{ fontSize: 50, color: red[500] }}
                      component={
                        likedPosts.includes(value.id)
                          ? FavoriteIcon
                          : FavoriteBorderIcon
                      }
                    />
                    <div>{value.Likes && value.Likes.length}</div>
                  </Button>
                  <Divider orientation="vertical" variant="middle" flexItem />
                  <Button
                    sx={{ width: 1 }}
                    onClick={() => {
                      navigate(`/posts/${value.id}`);
                    }}
                  >
                    <ZoomOutMapIcon sx={{ fontSize: 50 }} />
                  </Button>
                </CardActions>
                <Accordion TransitionProps={{ unmountOnExit: true }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography align="center">
                      {value.Comments && value.Comments.length} commentaires
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List sx={{ mb: 2, maxHeight: 380, overflow: "auto" }}>
                      {value.Comments &&
                        value.Comments.map((comment) => {
                          return (
                            <ListItem key={comment.id}>
                              <ListItemAvatar>
                                <Avatar
                                  sx={{ bgcolor: red[500] }}
                                  aria-label="user avatar"
                                >
                                  {/* {getInitialsFromName(comment.username)} */}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={comment.message}
                                secondary={
                                  <>
                                    <Typography
                                      component="span"
                                      variant="body2"
                                      color="textPrimary"
                                    >
                                      {comment.username}
                                    </Typography>
                                    {" — "}
                                    <Typography
                                      component="span"
                                      variant="body2"
                                      color="textPrimary"
                                    >
                                      {formatDate(comment.createdAt)}
                                    </Typography>
                                  </>
                                }
                              />
                            </ListItem>
                          );
                        })}
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            sx={{ bgcolor: red[500] }}
                            aria-label="recipe"
                          >
                            You
                          </Avatar>
                        </ListItemAvatar>
                        <Button onClick={() => navigate(`/posts/${value.id}`)}>
                          Participer à la conversation
                        </Button>
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Card>
            </Container>
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
