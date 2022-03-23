// Scripts
import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { flagDialog } from "./FlagDialog";

// Style
import { AiOutlineComment } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReportIcon from "@mui/icons-material/Report";

// Utilities
import { formatDate } from "../services/utilities";
import { AuthContext } from "../contexts/auth-context";
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
    if (!authState.status) {
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
      {listOfPosts.map((value, key) => {
        return (
          <Container sx={{ justifyContent: "center" }}>
            <Card sx={{ maxWidth: 768, m: 2 }} key={value.id}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    AM
                  </Avatar>
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
              <CardActions disableSpacing>
                <IconButton
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
                </IconButton>

                <div>{value.Likes.length}</div>

                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    navigate(`/posts/${value.id}`);
                  }}
                >
                  <AiOutlineComment />
                </button>
                <div>cnt</div>
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
