import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  CardMedia,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BackButton } from "./BackButton";
import { AuthContext } from "../contexts/auth-context";

export default function Profile() {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3006/users/profile/${id}`, {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((res) => {
        console.log(res.data);
        setUsername(res.data.username);
        if(res.data.avatar) {
          axios
          .get(`${res.data.avatar}`, {
            headers: { token: sessionStorage.getItem("token") },
          })
          .then((res) => {
            setAvatarUrl(res.config.url);
          })
          .catch((err) => {
            console.log(err);
          });
        } 
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`http://localhost:3006/posts/byuserId/${id}`, {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((res) => {
        if(res.data.error){
          throw new Error(res.data.error);
        }

        setListOfPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!authState) {
    navigate("/login");
  }

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", selectedFile);
    axios
      .put(`http://localhost:3006/users/avatar`, formData, {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((res) => {
        axios
          .get(`http://localhost:3006/users/profile/${id}`, {
            headers: { token: sessionStorage.getItem("token") },
          })
          .then((res) => {
            axios
              .get(`${res.data.avatar}`, {
                headers: { token: sessionStorage.getItem("token") },
              })
              .then((res) => {
                setAvatarUrl(res.config.url);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // possibilité de factoriser le code pour setAvatarUrl:
  /*   function setAvatar(res, setAvatarUrl) {
    axios
      .get(`http://localhost:3006${res.data.avatar}`, {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((res) => {
        setAvatarUrl(res.config.url);
      })
      .catch((err) => {
        console.log(err);
      });
  } */

  return (
    <div>
      <Box sx={{ flexGrow: 1, margin: 10 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <CardHeader title={username} component="div"></CardHeader>
                <CardMedia component="div">
                  <Avatar
                    size="md"
                    src={avatarUrl}
                    sx={{ width: 200, height: 200 }}
                  />
                </CardMedia>
                {authState.username === username && (
                  <List>
                    <ListItem>
                      <Button>
                        <form
                          onSubmit={handleSubmit}
                          encType="multipart/form-data"
                        >
                          <input type="file" onChange={changeHandler} />
                          <input type="submit" value="Upload File" />
                        </form>
                      </Button>
                    </ListItem>
                    <ListItem>
                      <Button href="/changepassword">
                        Changer le mot de passe
                      </Button>
                    </ListItem>
                    <ListItem>
                      <Button href="/deleteaccount" sx={{ color: "red" }}>
                        Supprimer le compte
                      </Button>
                    </ListItem>
                  </List>
                )}
              </Card>
            </Box>
          </Grid>
          <Grid item xs={8}>
            {listOfPosts && listOfPosts.map((value, key) => {
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
                      primary={value.title}
                      secondary={value.message}
                    ></ListItemText>
                  </ListItem>
                </React.Fragment>
              );
            })}
          </Grid>
        </Grid>
      </Box>
      <BackButton />
    </div>
  );
}
