// React Imports
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// MUI Imports
import { Button, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";

// Components Imports
import InfoCard from "../../components/common/cards/info-card/info-card.jsx";
import CommonDialog from "../../components/common/dialog/dialog.jsx";

// Local Imports
import "./page-components.scss";

const PageComponent = () => {
  const { "page-name": pageSlug } = useParams();
  const [pageData, setPageData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the confirmation dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  // const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const loadPageData = async () => {
      if (pageSlug) {
        try {
          setLoading(true);
          // Dynamically import the JSON file based on the pageSlug
          const data = await import(`../../data/pages/${pageSlug}.json`);
          setPageData(data.default);
        } catch (error) {
          console.error("Failed to load page component data:", error);
          setPageData([]); // Set to empty array on error
        } finally {
          setLoading(false);
        }
      }
    };
    loadPageData();
  }, [pageSlug]);

  // handlers for popover actions
  const handleEdit = () => setDialogOpen(true);
  const handleDelete = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  // Popover actions
  const popoverActions = (card) => [
    {
      label: "Edit",
      icon: <EditIcon fontSize="small" />,
      onClick: () => handleEdit(card),
    },
    {
      label: "Delete",
      icon: <DeleteIcon fontSize="small" />,
      onClick: () => handleDelete(card),
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

  if (loading) {
    return <div className="container">Loading page components...</div>;
  }

  return (
    <div className="user-pages container">
      {pageData?.map((card, index) => (
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

      <CommonDialog
        openDialog={dialogOpen}
        onClose={closeDialog}
        title="We are working on this."
        content="We are working on it now. Please try again later."
        footer={
          <Button onClick={closeDialog} color="primary">
            Close
          </Button>
        }
        width="400px"
      />
    </div>
  );
};

export default PageComponent;
