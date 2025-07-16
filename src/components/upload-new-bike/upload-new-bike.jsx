import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Switch,
  FormControl,
  InputLabel,
  FormControlLabel,
  Button,
  Grid,
  Paper,
} from "@mui/material";

const UploadNewBike = () => {
  const [formData, setFormData] = useState({
    bike_id: "",
    brand: "",
    model: "",
    year_of_model: "",
    registration_year: "",
    original_price: "",
    discount_percent: "",
    bike_condition: "",
    km_driven: "",
    owner_count: "",
    location: "",
    color: "",
    rc_available: false,
    insurance_valid: false,
    accident_history: false,
    service_history: false,
    images: [{ url: "", alt: "", title: "" }],
    engine_and_performance: {
      engine_cc: "",
      max_torque: "",
      top_speed_kmph: "",
      mileage_kmpl: "",
      transmission_type: "",
      gear_count: "",
      fuel_type: "",
      fuel_tank_capacity_litres: "",
      emission_standard: "",
    },
    brakes: {
      front: "",
      rear: "",
      abs: false,
    },
    tyre_condition: "",
    body_type: "",
    rto: {
      rg_number: "",
      location_code: "",
    },
    seller_type: "",
    test_ride: {
      availability: false,
      range_km: "",
    },
    exchange: {
      availability: false,
      condition: "",
    },
    accessories_included: [],
    hold: {
      is_held: false,
      held_by_user_id: "",
      hold_start_time: "",
      hold_expiry_time: "",
    },
    selling_status: "",
    dealer_details: {
      name: "",
      dealer_id: "",
    },
    offers: [],
    slug: {
      brand: "",
      model: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (e, field, subField) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subField]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // Submit to API if needed
  };

  return (
    <Paper
      elevation={3}
      sx={{ padding: 3, maxWidth: 900, margin: "auto", mt: 5 }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Text fields */}
          {[
            { name: "bike_id", label: "Bike ID" },
            { name: "brand", label: "Brand" },
            { name: "model", label: "Model" },
            { name: "year_of_model", label: "Year of Model", type: "number" },
            {
              name: "registration_year",
              label: "Registration Year",
              type: "number",
            },
            { name: "original_price", label: "Original Price", type: "number" },
            { name: "discount_percent", label: "Discount %", type: "number" },
            { name: "km_driven", label: "KM Driven", type: "number" },
            { name: "location", label: "Location" },
            { name: "color", label: "Color" },
          ].map(({ name, label, type = "text" }) => (
            <Grid item xs={12} sm={6} key={name}>
              <TextField
                fullWidth
                label={label}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                type={type}
              />
            </Grid>
          ))}

          {/* Select fields */}
          {[
            {
              name: "bike_condition",
              label: "Condition",
              options: ["Excellent", "Good", "Fair", "Poor"],
            },
            {
              name: "owner_count",
              label: "Owner",
              options: ["1st Owner", "2nd Owner", "3rd Owner", "Above 3"],
            },
            {
              name: "body_type",
              label: "Body Type",
              options: ["Commuter", "Sports", "Cruiser", "Adventure"],
            },
            {
              name: "tyre_condition",
              label: "Tyre Condition",
              options: ["Excellent", "Good", "Fair", "Poor"],
            },
            {
              name: "seller_type",
              label: "Seller Type",
              options: ["Dealer", "Individual"],
            },
            {
              name: "selling_status",
              label: "Selling Status",
              options: ["available", "sold", "reserved"],
            },
          ].map(({ name, label, options }) => (
            <Grid item xs={12} sm={6} key={name}>
              <FormControl fullWidth>
                <InputLabel>{label}</InputLabel>
                <Select
                  label={label}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                >
                  {options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}

          {/* Switch fields */}
          {[
            { name: "rc_available", label: "RC Available" },
            { name: "insurance_valid", label: "Insurance Valid" },
            { name: "accident_history", label: "Accident History" },
            { name: "service_history", label: "Service History" },
            { name: "test_ride.availability", label: "Test Ride Available" },
            { name: "exchange.availability", label: "Exchange Available" },
            { name: "hold.is_held", label: "Hold Status" },
            { name: "brakes.abs", label: "ABS" },
          ].map(({ name, label }) => (
            <Grid item xs={12} sm={6} key={name}>
              <FormControlLabel
                control={
                  <Switch
                    checked={
                      formData[name.split(".")[0]][name.split(".")[1]] || false
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        e,
                        name.split(".")[0],
                        name.split(".")[1]
                      )
                    }
                    name={name}
                  />
                }
                label={label}
              />
            </Grid>
          ))}
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Submit
        </Button>
      </form>
    </Paper>
  );
};

export default UploadNewBike;
