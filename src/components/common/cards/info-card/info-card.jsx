// React Imports
import React from "react";

// MUI Imports
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// Component Imports
import CustomPopover from "../../custom-popover/custom-popover";

// Local Imports
import "./info-card.scss";

const InfoCard = ({ data, showPopover, popoverTrigger }) => {
  const { title, message, actions, icon, popoverActions } = data;

  // Dynamically generate popover content
  const popoverContent = popoverActions ? (
    <List dense sx={{ p: 0, minWidth: 140 }}>
      {popoverActions.map((action, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton onClick={action.onClick}>
            <ListItemIcon style={{ minWidth: "35px" }}>
              {action.icon}
            </ListItemIcon>
            <ListItemText
              primary={action.label}
              primaryTypographyProps={{ sx: { fontSize: "0.875rem" } }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  ) : null;

  return (
    <div className="info-card">
      <div className="info-card-header">
        <span className="info-card-icon">
          <img
            src={icon || "/images/illustrations/fallback.svg"}
            alt="icon"
            className="info-card-icon-img"
          />
        </span>
        <p className="info-card-title">{title}</p>

        {showPopover && (
          <div className="popover-parent">
            <CustomPopover
              trigger={popoverTrigger}
              popoverContent={popoverContent}
            />
          </div>
        )}
      </div>

      <p className="info-card-body">{message}</p>

      <div className="info-card-actions">
        {actions?.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`info-card-btn ${
              action.type === "primary"
                ? "info-card-btn-primary"
                : "info-card-btn-secondary"
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;
