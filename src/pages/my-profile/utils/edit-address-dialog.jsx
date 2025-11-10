// React Imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// MUI Imports
import { TextField, Grid, Button, Box } from "@mui/material";

// Component Imports
import CommonDialog from "../../../components/common/dialog/dialog";

const EditAddressDialog = ({ open, onClose, values, onChange, onSave }) => {
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateStreetAddress = (address) => {
    if (!address || address.trim() === "") {
      return "Street address is required";
    }
    return "";
  };

  const validateCity = (city) => {
    if (!city || city.trim() === "") {
      return "City is required";
    }
    return "";
  };

  const validatePostalCode = (postalCode) => {
    if (!postalCode || postalCode.trim() === "") {
      return "Postal code is required";
    }
    // Should be exactly 6 digits
    const postalRegex = /^\d{6}$/;
    if (!postalRegex.test(postalCode)) {
      return "Postal code must be exactly 6 digits";
    }
    return "";
  };

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Prevent invalid characters for postal code
    if (name === "postalCode") {
      // Remove non-numeric characters and limit to 6 digits
      newValue = value.replace(/[^0-9]/g, "").slice(0, 6);
    }

    // Call the original onChange with cleaned value
    onChange({
      target: {
        name,
        value: newValue,
      },
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};

    newErrors.streetAddress = validateStreetAddress(values.streetAddress);
    newErrors.city = validateCity(values.city);
    newErrors.postalCode = validatePostalCode(values.postalCode);

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Handle save with validation
  const handleSave = () => {
    if (validateForm()) {
      onSave();
    }
  };
  const footer = (
    <Button
      variant="contained"
      color="warning"
      onClick={handleSave}
      sx={{ px: 3 }}
    >
      Save Changes
    </Button>
  );

  const content = (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address"
            name="streetAddress"
            value={values.streetAddress || ""}
            onChange={handleInputChange}
            error={!!errors.streetAddress}
            helperText={errors.streetAddress}
            placeholder="Enter your street address"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={values.city || ""}
            onChange={handleInputChange}
            error={!!errors.city}
            helperText={errors.city}
            placeholder="Enter your city name"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Postal Code"
            name="postalCode"
            value={values.postalCode || ""}
            onChange={handleInputChange}
            error={!!errors.postalCode}
            helperText={errors.postalCode || ""}
            placeholder="Enter your 6-digit postal code"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value="Tamil Nadu"
            InputProps={{
              readOnly: true,
            }}
            helperText=" "
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <CommonDialog
      openDialog={open}
      onClose={onClose}
      title="Edit Address Information"
      content={content}
      footer={footer}
      width="500px"
    />
  );
};
EditAddressDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  values: PropTypes.shape({
    streetAddress: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    postalCode: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditAddressDialog;
