import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { AuthContext } from "../contexts/auth-context";

// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Button, Divider, CardMedia, Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import NavLogo from "../navlogo.png";
import axios from "axios";

export default function AccountMenu() {
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate("");
  const id = useContext(AuthContext).authState.id;
  const isAdmin = useContext(AuthContext).authState.isAdmin;
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!(id > 0)) {
      return;
    }
    console.log(id);
    axios
      .get(`http://localhost:3006/users/profile/${id}`, {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((res) => {
        // if (!res.data) {
        //   return;
        // }
        console.log(res.data);
        setUsername(res.data.username);
        if (!res.data.avatar) {
          setAvatarUrl("");
        } else {
          axios
            .get(`${res.data.avatar}`, {
              headers: { token: sessionStorage.getItem("token") },
            })
            .then((res) => {
              if (res.data) {
                setAvatarUrl(res.config.url);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const clearSession = () => {
    sessionStorage.removeItem("token");
    setAuthState(false);
    navigate("/login");
  };

  return (
    <React.Fragment>
      <Box
        bgcolor="white"
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "space-evenly",
          position: "fixed",
          top: 0,
          width: 1,
          zIndex: "tooltip",
          boxShadow: 1,
        }}
      >
        <Box
          to="/"
          onClick={scrollToTop}
          component={Link}
          sx={{ width: 1, height: 1 }}
        >
          <Tooltip title="Accueil">
            <CardMedia
              component="img"
              image={NavLogo}
              sx={{ width: 1, height: 65 }}
            />
          </Tooltip>
        </Box>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Tooltip title={username}>
          <Button
            component={Link}
            to={`/profile/${id}`}
            sx={{ width: 1, height: 65 }}
          >
            <Avatar src={avatarUrl} sx={{ fontSize: 50 }} />
          </Button>
        </Tooltip>

        <Divider orientation="vertical" variant="middle" flexItem />
        <Tooltip title="Nouvelle publication">
          <Button
            to="/createpost"
            component={Link}
            sx={{ width: 1, height: 65 }}
          >
            <PostAddIcon sx={{ fontSize: 50 }} />
          </Button>
        </Tooltip>

        {isAdmin && (
          <>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Tooltip title="Dashboard admin">
              <Button
                to="/admindashboard"
                component={Link}
                sx={{ width: 1, height: 65 }}
              >
                <AdminPanelSettingsIcon sx={{ fontSize: 50 }} />
              </Button>
            </Tooltip>
          </>
        )}

        <Divider orientation="vertical" variant="middle" flexItem />
        <Tooltip title="Se déconnecter">
          <Button onClick={clearSession} sx={{ width: 1, height: 65 }}>
            <LogoutIcon sx={{ fontSize: 50 }} />
          </Button>
        </Tooltip>

        <Divider />
      </Box>
    </React.Fragment>
  );
}
