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

  useEffect(() => {
    axios.get(`http://localhost:3006/users/profile/${id}`).then((res) => {
      setUsername(res.data.username);
    });
    axios.get(`http://localhost:3006/posts/byuserId/${id}`).then((res) => {
      setListOfPosts(res.data);
    });
  }, []);

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
                    alt="Avatar"
                    src="https://medias.lavie.fr/api/v1/images/view/5f5fea37d286c2387a297417/width_1000/image.jpg"
                    sx={{
                      width: 300,
                      height: 300,
                    }}
                  />
                </CardMedia>
                {authState.username === username && (
                  <List>
                    <ListItem>
                      <Button href="/changepassword">
                        Changer le mot de passe
                      </Button>
                    </ListItem>
                    <ListItem>
                      <Button sx={{ color: "red" }}>Supprimer le compte</Button>
                    </ListItem>
                  </List>
                )}
              </Card>
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Card>
              <CardHeader title="Publications" />

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
                        primary={value.title}
                        secondary={value.message}
                      ></ListItemText>
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </Card>
          </Grid>
        </Grid>
      </Box>
      <BackButton />
    </div>
  );
}
