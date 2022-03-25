import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Grid,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { formatDate } from "../services/utilities";
import { BackButton } from "./BackButton";

export default function Profile() {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  //   const [createdAt, setCreatedAt] = useState("");
  const navigate = useNavigate();
  const [listOfPosts, setListOfPosts] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:3006/users/profile/${id}`).then((res) => {
      setUsername(res.data.username);
      //   setCreatedAt(res.data.createdAt);
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
                <CardHeader
                  title={username}
                  component="div"

                  //   subheader={formatDate(createdAt)}
                ></CardHeader>
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
                <CardContent component="div">
                  <ListItem
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    Changer le mot de passe
                  </ListItem>
                  <ListItem
                    sx={{
                      color: "red",
                      "&:hover": {
                        cursor: "pointer",
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    Supprimer le compte
                  </ListItem>
                </CardContent>
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
