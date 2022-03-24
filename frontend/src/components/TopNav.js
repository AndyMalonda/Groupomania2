import * as React from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { AuthContext } from "../contexts/auth-context";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Button, Divider, SvgIcon } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import CustomIcon2 from "../CustomIcon2";

export default function AccountMenu() {
  const { authState, setAuthState } = React.useContext(AuthContext);
  const navigate = useNavigate("");

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
        }}
      >
        <Button to="/" component={Link} sx={{ width: 1, height: 65 }}>
          <Tooltip title="Accueil">
            <SvgIcon component={CustomIcon2} inheritViewBox />
          </Tooltip>
        </Button>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Button to="/" component={Link} sx={{ width: 1, height: 65 }}>
          <Tooltip title="Votre compte">
            <AccountCircleIcon sx={{ fontSize: 50 }} />
          </Tooltip>
        </Button>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Button to="/createpost" component={Link} sx={{ width: 1, height: 65 }}>
          <Tooltip title="Nouvelle publication">
            <PostAddIcon sx={{ fontSize: 50 }} />
          </Tooltip>
        </Button>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Button onClick={clearSession} sx={{ width: 1, height: 65 }}>
          <Tooltip title="Se déconnecter">
            <LogoutIcon sx={{ fontSize: 50 }} />
          </Tooltip>
        </Button>
        <Divider />
      </Box>
    </React.Fragment>
  );
}
