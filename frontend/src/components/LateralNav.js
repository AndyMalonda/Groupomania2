import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PostAddIcon from "@mui/icons-material/PostAdd";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const actions = [
  { icon: <KeyboardArrowUpIcon />, name: "Retourner en haut" },
  { icon: <PostAddIcon />, name: "Nouvelle publication" },
  { icon: <AccountCircleIcon />, name: "Votre profil" },
  { icon: <LogoutIcon />, name: "Se déconnecter" },
];

export default function LateralNav() {
  return (
    <Box
      sx={{
        height: 320,
        transform: "translateZ(0px)",
        flexGrow: 1,
        position: "fixed",
        bottom: 16,
        right: 16,
      }}
    >
      <SpeedDial ariaLabel="SpeedDial" icon={<SpeedDialIcon />}>
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
