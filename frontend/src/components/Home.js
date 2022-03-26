// Scripts
import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { flagDialog } from "./FlagDialog";
import LateralNav from "./LateralNav";
import TopNav from "./TopNav";

// Style
import toast, { Toaster } from "react-hot-toast";
import ReportIcon from "@mui/icons-material/Report";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ForumIcon from "@mui/icons-material/Forum";

// Utilities
import { formatDate, getInitials } from "../services/utilities";
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
  Chip,
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

  // Alert dialog
  const [openFlagDialog, setFlagDialogOpen] = useState(false);
  const handleFlagClick = () => {
    setFlagDialogOpen(true);
  };
  const handleFlagDialogClose = () => {
    setFlagDialogOpen(false);
  };

  return (
    <div className="Home">
      {window.innerWidth < 768 ? <LateralNav /> : <TopNav />}
      {listOfPosts.map((value, key) => {
        return (
          <Container sx={{ justifyContent: "center", marginTop: 10 }}>
            <Card sx={{ maxWidth: 768, m: 2 }} key={key}>
              <CardHeader
                avatar={
                  <>
                    <Tooltip title={value.username}>
                      <Link to={`/profile/${value.UserId}`}>
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                          {getInitials(value.username)}
                        </Avatar>
                      </Link>
                    </Tooltip>
                  </>
                }
                action={
                  <>
                    <IconButton aria-label="flag" onClick={handleFlagClick}>
                      <Tooltip title="Signaler">
                        <ReportIcon />
                      </Tooltip>
                    </IconButton>
                    {flagDialog(openFlagDialog, handleFlagDialogClose)}
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
                  <div>{value.Likes.length}</div>
                </Button>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Button
                  sx={{ width: 1 }}
                  onClick={() => {
                    navigate(`/posts/${value.id}`);
                  }}
                >
                  <ForumIcon sx={{ fontSize: 50 }} />
                  <div>{value.Likes.length}</div>
                </Button>
              </CardActions>
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
