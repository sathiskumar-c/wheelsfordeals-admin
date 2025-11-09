// React Imports
import React, { useState } from "react";

// MUI Imports
import { TextField, Button, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

// Local Imports
import "./my-profile.scss";
import EditProfileDialog from "./utils/edit-profile-dialog";
import EditAddressDialog from "./utils/edit-address-dialog";

const MyProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "Natashia",
    lastName: "Khaleira",
    role: " Super Admin",
    email: "info@binary-fusion.com",
    phone: "+919876543210",
    streetAddress: "123 Main Street, Apartment 4B",
    city: "Leeds, East London",
    state: "Tamil Nadu",
    postalCode: "123456",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [tempProfileData, setTempProfileData] = useState({});
  const [tempAddressData, setTempAddressData] = useState({});

  // Handle changes in profile dialog
  const handleProfileChange = (e) => {
    setTempProfileData({
      ...tempProfileData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle changes in address dialog
  const handleAddressChange = (e) => {
    setTempAddressData({
      ...tempAddressData,
      [e.target.name]: e.target.value,
    });
  };

  // Open profile dialog and initialize temp data
  const openProfileDialog = () => {
    setTempProfileData({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
    });
    setOpenDialog(true);
  };

  // Open address dialog and initialize temp data
  const openAddressDialogHandler = () => {
    setTempAddressData({
      streetAddress: formData.streetAddress,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
    });
    setOpenAddressDialog(true);
  };

  // Save profile changes
  const handleSave = () => {
    setFormData({
      ...formData,
      ...tempProfileData,
    });
    console.log("Saved profile data:", { ...formData, ...tempProfileData });
    setOpenDialog(false);
    setTempProfileData({});
  };

  // Save address changes
  const handleAddressSave = () => {
    setFormData({
      ...formData,
      ...tempAddressData,
    });
    console.log("Saved address data:", { ...formData, ...tempAddressData });
    setOpenAddressDialog(false);
    setTempAddressData({});
  };

  // Close dialogs without saving
  const closeProfileDialog = () => {
    setOpenDialog(false);
    setTempProfileData({});
  };

  const closeAddressDialog = () => {
    setOpenAddressDialog(false);
    setTempAddressData({});
  };

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <header className="profile-header">
        <Avatar
          alt={`${formData.firstName} ${formData.lastName}`}
          src="https://i.pravatar.cc/150?img=12"
          sx={{ width: 80, height: 80 }}
        />
        <div>
          <h1 tabIndex="0">{`${formData.firstName} ${formData.lastName}`}</h1>
        </div>
      </header>

      {/* Personal Info Section */}
      <section
        className="profile-section"
        aria-labelledby="personal-info-heading"
      >
        <div className="section-header">
          <h2 id="personal-info-heading">Personal Information</h2>
          <Button
            variant="contained"
            color="warning"
            startIcon={<EditIcon />}
            onClick={openProfileDialog}
            aria-label="Edit personal information"
          >
            Edit
          </Button>
        </div>

        <div className="profile-form">
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />

          <TextField
            label="Role"
            name="role"
            value={formData.role}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            disabled
          />
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </div>
      </section>

      {/* Address Section */}
      <section className="profile-section" aria-labelledby="address-heading">
        <div className="section-header">
          <h2 id="address-heading">Address</h2>
          <Button
            variant="contained"
            color="warning"
            startIcon={<EditIcon />}
            onClick={openAddressDialogHandler}
            aria-label="Edit address information"
          >
            Edit
          </Button>
        </div>

        <div className="profile-form">
          <TextField
            label="Street Address"
            name="streetAddress"
            value={formData.streetAddress}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            multiline
          />
          <TextField
            label="City"
            name="city"
            value={formData.city}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />

          <TextField
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
          <TextField
            label="State"
            name="state"
            value="Tamil Nadu"
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </div>
      </section>

      <EditProfileDialog
        open={openDialog}
        onClose={closeProfileDialog}
        values={tempProfileData}
        onChange={handleProfileChange}
        onSave={handleSave}
      />

      <EditAddressDialog
        open={openAddressDialog}
        onClose={closeAddressDialog}
        values={tempAddressData}
        onChange={handleAddressChange}
        onSave={handleAddressSave}
      />
    </div>
  );
};

export default MyProfile;
