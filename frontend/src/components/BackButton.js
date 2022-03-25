import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";

export function BackButton() {
  return (
    <IconButton href="/" sx={{ position: "absolute", bottom: 10, right: 30 }}>
      <ArrowBackIcon sx={{ fontSize: 50 }} />
    </IconButton>
  );
}
