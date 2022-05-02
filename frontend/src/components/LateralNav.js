import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth-context";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PostAddIcon from "@mui/icons-material/PostAdd";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const actions = [
  { icon: <KeyboardArrowUpIcon />, name: "Retourner en haut" },
  { icon: <PostAddIcon />, name: "Nouvelle publication" },
  { icon: <AccountCircleIcon />, name: "Votre profil" },
  { icon: <AdminPanelSettingsIcon />, name: "Modération" },
  { icon: <LogoutIcon />, name: "Se déconnecter" },
];

export default function LateralNav() {
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate("");
  const id = useContext(AuthContext).authState.id;
  const isAdmin = useContext(AuthContext).authState.isAdmin;

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
    <Box
      sx={{
        height: 320,
        transform: "translateZ(0px)",
        flexGrow: 1,
        position: "fixed",
        bottom: 56,
        right: 16,
        zIndex: "tooltip",
      }}
    >
      <SpeedDial ariaLabel="SpeedDial" icon={<SpeedDialIcon />}>
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              switch (action.name) {
                case "Retourner en haut":
                  scrollToTop();
                  break;
                case "Nouvelle publication":
                  navigate(`/createpost`);
                  break;
                case "Votre profil":
                  navigate(`/profile/${id}`);
                  break;
                case "Se déconnecter":
                  clearSession();
                  break;
                case isAdmin === true && "Modération":
                  navigate(`/admindashboard`);
                  break;
              }
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
