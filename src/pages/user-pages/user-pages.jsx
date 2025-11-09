// React Imports
import React from "react";
import { useNavigate } from "react-router-dom";

// MUI Imports
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";

// Component Imports
import InfoCard from "../../components/common/cards/info-card/info-card.jsx";

// Local Imports
import "./user-pages.scss";
import pagesData from "../../data/all-pages.json";

const UserPages = () => {
  // Initialiations
  const navigate = useNavigate();

  const handleEdit = (card) => {
    const editAction = card.actions.find((action) => action.type === "primary");
    if (editAction && editAction.link) navigate(editAction.link);
  };

  const handleDelete = (cardTitle) => {
    console.log(`Delete action triggered for: ${cardTitle}`);
  };

  // Popover actions array
  const popoverActions = (card) => [
    {
      label: "Edit",
      icon: <EditIcon fontSize="small" />,
      onClick: () => handleEdit(card),
    },
    {
      label: "Delete",
      icon: <DeleteIcon fontSize="small" />,
      onClick: () => handleDelete(card.title),
    },
    {
      label: "More Info",
      icon: <InfoIcon fontSize="small" />,
      onClick: () => console.log(`More Info clicked for: ${card.title}`),
    },
    {
      label: "Owner",
      icon: <PersonIcon fontSize="small" />,
      onClick: () => console.log(`Assign Owner clicked for: ${card.title}`),
    },
  ];

  return (
    <div className="user-pages container">
      {pagesData?.map((card, index) => (
        <InfoCard
          key={index}
          data={{
            ...card,
            popoverActions: popoverActions(card),
            actions: card.actions.map((action) => ({
              ...action,
              onClick: () => handleEdit(card),
            })),
          }}
          showPopover={true}
          popoverTrigger={
            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          }
        />
      ))}
    </div>
  );
};

export default UserPages;
