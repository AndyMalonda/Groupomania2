import axios from "axios";
import React, { useState } from "react";
import {
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import toast from "react-hot-toast";

import ReportIcon from "@mui/icons-material/Report";

export default function FlagDialog(props) {
  const [open, setOpen] = useState(false);
  const postId = props.postId;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const reportPost = () => {
    axios
      .put(`http://localhost:3006/posts/flag/${postId}`, {
        headers: {
          token: JSON.parse(sessionStorage.getItem("groupomaniaAndy")).token,
        },
      })
      .then((response) => {
        console.log(response.data);
        toast("Publication signalée !");
        handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <IconButton
        aria-label="flag"
        onClick={() => {
          handleClickOpen();
        }}
      >
        <Tooltip title="Signaler">
          <ReportIcon />
        </Tooltip>
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Signaler cette publication ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr·e de vouloir signaler cette publication ? Si oui la
            modération examinera si cette publication enfreint les standards de
            notre groupe.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={reportPost} autoFocus>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
