import React from "react";

export default function FlagDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton
        aria-label="flag"
        onClick={() => {
          handleClickOpen();
          log(value.id);
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
          <Button
            onClick={() => {
              reportPost(value.id);
              handleClose();
              log(value.id);
            }}
            autoFocus
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
