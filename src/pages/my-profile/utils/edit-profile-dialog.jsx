// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// MUI Imports
import {
  TextField,
  Grid,
  Button,
  Avatar,
  Box,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";

// Local Imports
import CommonDialog from "../../../components/common/dialog/dialog";

const EditProfileDialog = ({ open, onClose, values, onChange, onSave }) => {
  const [errors, setErrors] = useState({});
  const [debouncedValues, setDebouncedValues] = useState(values);
  const [isTyping, setIsTyping] = useState(false);

  // OTP related states
  const [otpStates, setOtpStates] = useState({
    email: {
      otp: "",
      isOtpSent: false,
      isVerified: false,
      isLoading: false,
      timer: 0,
      originalValue: "",
    },
    phone: {
      otp: "",
      isOtpSent: false,
      isVerified: false,
      isLoading: false,
      timer: 0,
      originalValue: "",
    },
  });

  // Debounce values to prevent flickering OTP sections
  useEffect(() => {
    setIsTyping(true);
    const debounceTimer = setTimeout(() => {
      setDebouncedValues(values);
      setIsTyping(false);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [values]);

  // Store original values when dialog opens
  useEffect(() => {
    if (open) {
      setOtpStates((prev) => ({
        email: {
          ...prev.email,
          originalValue: values.email || "",
          // Only reset OTP state if email actually changed
          isOtpSent:
            prev.email.originalValue === values.email
              ? prev.email.isOtpSent
              : false,
          isVerified:
            prev.email.originalValue === values.email
              ? prev.email.isVerified
              : false,
          otp: prev.email.originalValue === values.email ? prev.email.otp : "",
          timer:
            prev.email.originalValue === values.email ? prev.email.timer : 0,
        },
        phone: {
          ...prev.phone,
          originalValue: values.phone || "",
          // Only reset OTP state if phone actually changed
          isOtpSent:
            prev.phone.originalValue === values.phone
              ? prev.phone.isOtpSent
              : false,
          isVerified:
            prev.phone.originalValue === values.phone
              ? prev.phone.isVerified
              : false,
          otp: prev.phone.originalValue === values.phone ? prev.phone.otp : "",
          timer:
            prev.phone.originalValue === values.phone ? prev.phone.timer : 0,
        },
      }));
    }
  }, [open, values.email, values.phone]);

  // Timer effect for OTP countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setOtpStates((prev) => ({
        email: {
          ...prev.email,
          timer: prev.email.timer > 0 ? prev.email.timer - 1 : 0,
        },
        phone: {
          ...prev.phone,
          timer: prev.phone.timer > 0 ? prev.phone.timer - 1 : 0,
        },
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // OTP Functions
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const simulateOTPSend = (type, contact) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const otp = generateOTP();
        console.log(`OTP sent to ${type}: ${contact} - OTP: ${otp}`);
        resolve(otp);
      }, 2000);
    });
  };

  const sendOTP = async (type) => {
    const contact = type === "email" ? values.email : values.phone;

    if (
      !contact ||
      (type === "email" && validateEmail(contact)) ||
      (type === "phone" && validatePhone(contact))
    ) {
      return;
    }

    setOtpStates((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        isLoading: true,
      },
    }));

    try {
      const generatedOTP = await simulateOTPSend(type, contact);

      setOtpStates((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          isOtpSent: true,
          isLoading: false,
          timer: 60,
          generatedOTP: generatedOTP, // Store for validation (in real app, this would be server-side)
        },
      }));
    } catch (err) {
      console.error("Failed to send OTP:", err);
      setOtpStates((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          isLoading: false,
        },
      }));
    }
  };

  const verifyOTP = (type) => {
    const enteredOTP = otpStates[type].otp;
    const generatedOTP = otpStates[type].generatedOTP;

    if (enteredOTP === generatedOTP) {
      setOtpStates((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          isVerified: true,
        },
      }));
      return true;
    } else {
      setErrors((prev) => ({
        ...prev,
        [`${type}Otp`]: "Invalid OTP. Please try again.",
      }));
      return false;
    }
  };

  const handleOTPChange = (type, value) => {
    // Only allow 6 digits
    const otpValue = value.replace(/[^0-9]/g, "").slice(0, 6);

    setOtpStates((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        otp: otpValue,
      },
    }));

    // Clear OTP error when user starts typing
    if (errors[`${type}Otp`]) {
      setErrors((prev) => ({
        ...prev,
        [`${type}Otp`]: "",
      }));
    }

    // Auto-verify when 6 digits are entered
    if (otpValue.length === 6) {
      setTimeout(() => verifyOTP(type), 500);
    }
  };

  // Check if value has changed and needs OTP verification
  const needsOTPVerification = (type) => {
    const currentValue =
      type === "email" ? debouncedValues.email : debouncedValues.phone;
    const originalValue = otpStates[type].originalValue;

    // Ensure we have meaningful values to compare
    if (!currentValue || !originalValue) return false;

    // For phone, compare without +91 prefix for better comparison
    if (type === "phone") {
      const currentPhone = currentValue.replace("+91", "").trim();
      const originalPhone = originalValue.replace("+91", "").trim();
      return currentPhone !== originalPhone && currentPhone.length >= 10;
    }

    // For email, ensure it's valid before showing OTP
    if (type === "email") {
      const emailValid = !validateEmail(currentValue);
      return currentValue !== originalValue && emailValid;
    }

    return currentValue !== originalValue;
  };

  // Ensure phone always has +91 prefix when dialog opens
  useEffect(() => {
    if (open && values.phone && !values.phone.startsWith("+91")) {
      // If phone doesn't start with +91, add it
      const cleanPhone = values.phone.replace(/[^0-9]/g, "");
      if (cleanPhone.length <= 10) {
        onChange({
          target: {
            name: "phone",
            value: "+91" + cleanPhone,
          },
        });
      }
    } else if (open && (!values.phone || values.phone.trim() === "")) {
      // If phone is empty, set to +91
      onChange({
        target: {
          name: "phone",
          value: "+91",
        },
      });
    }
  }, [open, values.phone, onChange]);

  // Validation functions
  const validateName = (name, fieldName) => {
    if (!name || name.trim() === "") {
      return `${fieldName} is required`;
    }
    // Allow only alphabetic characters and spaces
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      return `${fieldName} should contain only letters and spaces`;
    }
    if (name.trim().length < 2) {
      return `${fieldName} should be at least 2 characters long`;
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === "") {
      return "Email is required";
    }
    // Comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone || phone.trim() === "") {
      return "Phone number is required";
    }
    // Remove +91 prefix for validation
    const phoneNumber = phone.replace("+91", "").trim();
    // Should be exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return "Phone number should be exactly 10 digits";
    }
    return "";
  };

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Prevent invalid characters for names
    if (name === "firstName" || name === "lastName") {
      // Remove numbers, special characters, and emojis
      newValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    // Prevent invalid characters for phone
    if (name === "phone") {
      // Ensure +91 prefix is always present
      if (!value.startsWith("+91")) {
        newValue = "+91";
      } else {
        // Extract only the number part after +91
        const phoneNumberPart = value.substring(3).replace(/[^0-9]/g, "");
        // Limit to 10 digits
        const limitedPhoneNumber = phoneNumberPart.slice(0, 10);
        newValue = "+91" + limitedPhoneNumber;
      }
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

  // Validate all fields including OTP verification
  const validateForm = () => {
    const newErrors = {};

    newErrors.firstName = validateName(values.firstName, "First Name");
    newErrors.lastName = validateName(values.lastName, "Last Name");
    newErrors.email = validateEmail(values.email);
    newErrors.phone = validatePhone(values.phone);

    // Check OTP verification for changed values
    if (needsOTPVerification("email") && !otpStates.email.isVerified) {
      newErrors.email = "Please verify your new email address with OTP";
    }

    if (needsOTPVerification("phone") && !otpStates.phone.isVerified) {
      newErrors.phone = "Please verify your new phone number with OTP";
    }

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Handle save with validation and OTP verification
  const handleSave = () => {
    if (validateForm()) {
      // Add verification info to the console log
      const changedFields = [];
      if (needsOTPVerification("email"))
        changedFields.push("email (OTP verified)");
      if (needsOTPVerification("phone"))
        changedFields.push("phone (OTP verified)");

      console.log("Saving profile with verified changes:", changedFields);
      onSave();
    }
  };
  const footer = (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Button
        variant="contained"
        color="warning"
        onClick={handleSave}
        sx={{ px: 3 }}
        disabled={
          (needsOTPVerification("email") && !otpStates.email.isVerified) ||
          (needsOTPVerification("phone") && !otpStates.phone.isVerified)
        }
      >
        {(needsOTPVerification("email") && !otpStates.email.isVerified) ||
        (needsOTPVerification("phone") && !otpStates.phone.isVerified)
          ? "Verify & Save Changes"
          : "Save Changes"}
      </Button>
    </Box>
  );

  const content = (
    <Box sx={{ mt: 2 }}>
      <Box display="flex" justifyContent="center" mb={3}>
        <Avatar
          src="https://i.pravatar.cc/100"
          alt="Profile"
          sx={{ width: 80, height: 80 }}
        />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={values.firstName || ""}
            onChange={handleInputChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            placeholder="Enter your first name"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={values.lastName || ""}
            onChange={handleInputChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            placeholder="Enter your last name"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={values.email || ""}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            placeholder="Enter your email address"
            InputProps={{ readOnly: true }}
          />

          {needsOTPVerification("email") && !isTyping && (
            <Box sx={{ mt: 2 }}>
              {!otpStates.email.isOtpSent ? (
                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => sendOTP("email")}
                    disabled={otpStates.email.isLoading || !!errors.email}
                    startIcon={
                      otpStates.email.isLoading && (
                        <CircularProgress size={16} />
                      )
                    }
                    sx={{ mb: 1, minWidth: "160px" }}
                  >
                    {otpStates.email.isLoading
                      ? "Sending OTP..."
                      : "Send OTP to Email"}
                  </Button>
                </Box>
              ) : (
                <Box>
                  <TextField
                    fullWidth
                    size="small"
                    label="Enter Email OTP"
                    value={otpStates.email.otp}
                    onChange={(e) => handleOTPChange("email", e.target.value)}
                    error={!!errors.emailOtp}
                    helperText={errors.emailOtp}
                    placeholder="Enter 6-digit verification code"
                    inputProps={{ maxLength: 6 }}
                    sx={{ mb: 1 }}
                  />

                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    {otpStates.email.isVerified ? (
                      <Chip label="✓ Verified" color="success" size="small" />
                    ) : (
                      <Box>
                        {otpStates.email.timer > 0 ? (
                          <Typography variant="caption" color="textSecondary">
                            Resend OTP in {otpStates.email.timer}s
                          </Typography>
                        ) : (
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => sendOTP("email")}
                            disabled={otpStates.email.isLoading}
                          >
                            Resend OTP
                          </Button>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={values.phone || "+91"}
            onChange={handleInputChange}
            error={!!errors.phone}
            placeholder="Enter your phone number"
          />

          {needsOTPVerification("phone") && !isTyping && (
            <Box sx={{ mt: 2 }}>
              {!otpStates.phone.isOtpSent ? (
                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => sendOTP("phone")}
                    disabled={otpStates.phone.isLoading || !!errors.phone}
                    startIcon={
                      otpStates.phone.isLoading && (
                        <CircularProgress size={16} />
                      )
                    }
                    sx={{ mb: 1, minWidth: "160px" }}
                  >
                    {otpStates.phone.isLoading
                      ? "Sending SMS..."
                      : "Send OTP to Phone"}
                  </Button>
                </Box>
              ) : (
                <Box>
                  <TextField
                    fullWidth
                    size="small"
                    label="Enter SMS OTP"
                    value={otpStates.phone.otp}
                    onChange={(e) => handleOTPChange("phone", e.target.value)}
                    error={!!errors.phoneOtp}
                    helperText={errors.phoneOtp}
                    placeholder="Enter 6-digit verification code"
                    inputProps={{ maxLength: 6 }}
                    sx={{ mb: 1 }}
                  />

                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    {otpStates.phone.isVerified ? (
                      <Chip label="✓ Verified" color="success" size="small" />
                    ) : (
                      <Box>
                        {otpStates.phone.timer > 0 ? (
                          <Typography variant="caption" color="textSecondary">
                            Resend OTP in {otpStates.phone.timer}s
                          </Typography>
                        ) : (
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => sendOTP("phone")}
                            disabled={otpStates.phone.isLoading}
                          >
                            Resend OTP
                          </Button>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <CommonDialog
      openDialog={open}
      onClose={onClose}
      title="Edit Personal Information"
      content={content}
      footer={footer}
      width="500px"
    />
  );
};
EditProfileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  values: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    state: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditProfileDialog;
