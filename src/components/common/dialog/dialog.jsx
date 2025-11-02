// React imports
import React from "react";
import PropTypes from "prop-types";

// MUI Imports
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

// Styled Dialog with dynamic width support
const BootstrapDialog = styled(Dialog, {
  shouldForwardProp: (prop) => prop !== "customWidth",
})(({ theme, customWidth }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiPaper-root": {
    width: customWidth || "100%",
    margin: "auto",
    maxWidth: "none",
  },
}));

const CommonDialog = ({
  openDialog,
  onClose,
  title,
  content,
  footer,
  width,
}) => {
  return (
    <BootstrapDialog
      fullWidth
      maxWidth={false}
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={openDialog}
      customWidth={width}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {title}
      </DialogTitle>

      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent dividers>{content}</DialogContent>

      {footer && <DialogActions>{footer}</DialogActions>}
    </BootstrapDialog>
  );
};

CommonDialog.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  content: PropTypes.node,
  footer: PropTypes.node,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CommonDialog;
