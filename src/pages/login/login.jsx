// React Imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI Imports
import {
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Box,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Local Imports
import "./login.scss";
import Img_AdminLogin from "/images/illustrations/admin.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });
  const [step, setStep] = useState("login"); // login -> method -> otp
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpMethod, setOtpMethod] = useState(""); // "email" or "mobile"
  const [resendTimer, setResendTimer] = useState(0);
  const [otpDisabled, setOtpDisabled] = useState(false);

  // Variables
  const navigate = useNavigate();
  const otpRefs = React.useRef([...Array(4)].map(() => React.createRef()));

  useEffect(() => {
    const savedStep = sessionStorage.getItem("admin-login-step");
    const savedMethod = sessionStorage.getItem("admin-login-method");
    const isValidated =
      sessionStorage.getItem("admin-login-validated") === "true";

    if (isValidated && savedStep) {
      setStep(savedStep);
      if (savedMethod) {
        setOtpMethod(savedMethod);
      }
    } else {
      sessionStorage.clear(); // Clear session if validation is not confirmed
      setStep("login");
    }
  }, []);

  useEffect(() => {
    if (step === "otp") {
      const interval = setInterval(() => {
        const expiry = parseInt(sessionStorage.getItem("otp-expiry"), 10);
        const remaining = Math.max(0, Math.ceil((expiry - Date.now()) / 1000));
        setResendTimer(remaining);
        maskEmail(sessionStorage.getItem("admin-email") || "email@example.com");
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [step]);

  useEffect(() => {
    let timer;
    if (step === "otp" && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, step]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setFormErrors({ ...formErrors, [field]: "" });
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (formData.password.length > 16) {
      errors.password = "Password must not exceed 16 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      sessionStorage.setItem("admin-login-step", "method");
      sessionStorage.setItem("admin-login-validated", "true");
      sessionStorage.setItem("admin-email", formData.email);
      setStep("method");
    }
  };

  const handleSelectMethod = (method) => {
    setOtp(["", "", "", ""]);
    setOtpMethod(method);
    setStep("otp");
    sessionStorage.setItem("admin-login-step", "otp");
    sessionStorage.setItem("admin-login-method", method);
    sessionStorage.setItem("otp-expiry", Date.now() + 10 * 1000);
    setResendTimer(10);
  };

  const handleOtpChange = (index) => (e) => {
    let value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1]?.current?.focus();
    }

    setOtpError("");
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.length === otp.length) {
      setOtp(pasted.split(""));
      otpRefs.current[otp.length - 1]?.current?.focus();
      e.preventDefault();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    const dummyOtp = "1234";
    if (enteredOtp === dummyOtp) {
      sessionStorage.clear();
      navigate("/admin/dashboard");
    } else {
      setOtpError("Invalid OTP. Please try again.");
      setOtpDisabled(true);
      setTimeout(() => setOtpDisabled(false), 3000);
    }
  };

  const maskPhone = (phone) => phone.replace(/.(?=.{4})/g, "*");

  const maskEmail = (email) => {
    const [user, domain] = email.split("@");
    return user.slice(0, 2) + "*".repeat(user.length - 2) + "@" + domain;
  };

  const BackButton = () => {
    // const handleBack = () => {
    //   if (step === "otp") {
    //     setStep("method"); // 🡄 go to method selection
    //     sessionStorage.setItem("admin-login-step", "method");
    //   } else if (step === "method") {
    //     setStep("login"); // 🡄 go to login
    //     sessionStorage.clear(); // clear session
    //   }
    // };

    const handleBack = () => {
      if (step === "otp") {
        setStep("method");
        sessionStorage.setItem("admin-login-step", "method");
      } else if (step === "method") {
        setStep("login");
        sessionStorage.clear();
      } else if (step === "forgot_otp") {
        setStep("forgot");
        sessionStorage.setItem("admin-login-step", "forgot");
      } else if (step === "reset") {
        setStep("forgot_otp");
        sessionStorage.setItem("admin-login-step", "forgot_otp");
      } else if (step === "forgot") {
        setStep("login");
        sessionStorage.clear();
      }
    };

    if (step === "login") return null; // ❌ hide back button on login

    return (
      <Button className="back-btn" onClick={handleBack}>
        ← Back
      </Button>
    );
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-left">
        <img
          src={Img_AdminLogin}
          alt="Admin Login"
          className="admin-login-img"
        />
      </div>

      <div className="admin-login-right">
        <form
          role="form"
          className="admin-login-form"
          onSubmit={
            step === "login"
              ? handleLoginSubmit
              : step === "otp"
              ? handleOtpSubmit
              : undefined
          }
        >
          <h2 className={`form-title ${step !== "login" ? "text-center" : ""}`}>
            {step === "login"
              ? "Login to Dashboard"
              : step === "method"
              ? "Verify your Identity"
              : "Verification OTP"}
          </h2>

          {step === "login" && (
            <>
              <TextField
                label="Email Address*"
                type="email"
                fullWidth
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange("email")}
                error={!!formErrors.email}
                helperText={formErrors.email}
                autoComplete="off"
              />
              <FormControl
                variant="outlined"
                fullWidth
                error={!!formErrors.password}
              >
                <InputLabel>Password*</InputLabel>
                <OutlinedInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange("password")}
                  // inputProps={{ maxLength: 16 }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  autoComplete="off"
                />
                <FormHelperText>{formErrors.password}</FormHelperText>
              </FormControl>

              <div className="form-links">
                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => {
                    setStep("forgot");
                    sessionStorage.setItem("admin-login-step", "forgot");
                    navigate("/forgot-password");
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" fullWidth className="admin-login-btn">
                LOGIN
              </Button>
            </>
          )}

          {step === "method" && (
            <>
              <Button
                variant="outlined"
                onClick={() => handleSelectMethod("email")}
                className="admin-login-btn"
              >
                Verify via Email
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleSelectMethod("mobile")}
                className="admin-login-btn"
              >
                Verify via Mobile
              </Button>
            </>
          )}

          {step === "otp" && (
            <>
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                Enter the OTP sent to{" "}
                <b>
                  {otpMethod === "email"
                    ? maskEmail(
                        sessionStorage.getItem("admin-email") ||
                          "email@example.com"
                      )
                    : maskPhone("+91-9876543210")}
                </b>
              </div>
              <Box className="otp-box">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    ref={otpRefs.current[index]}
                    value={digit}
                    onChange={handleOtpChange(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[index] && index > 0) {
                        otpRefs.current[index - 1]?.current?.focus();
                      }
                    }}
                    onPaste={handleOtpPaste}
                    autoComplete="one-time-code"
                    aria-label={`OTP digit ${index + 1}`}
                    disabled={otpDisabled}
                  />
                ))}
              </Box>

              <div className="resend-otp-section">
                {resendTimer > 0 ? (
                  <p style={{ textAlign: "center", margin: "10px 0" }}>
                    You can resend OTP in <b>{resendTimer}s</b>
                  </p>
                ) : (
                  <Button
                    variant="text"
                    className="resend_otp"
                    onClick={() => {
                      // 👇 You can trigger OTP resend API here
                      console.log(`Resending OTP via ${otpMethod}`);
                      setOtp(["", "", "", ""]);
                      otpRefs.current[0]?.current?.focus();
                      sessionStorage.setItem(
                        "otp-expiry",
                        Date.now() + 10 * 1000
                      );
                      setResendTimer(10);
                    }}
                  >
                    Resend OTP
                  </Button>
                )}
              </div>

              {otpError && (
                <FormHelperText error sx={{ textAlign: "center" }}>
                  {otpError}
                </FormHelperText>
              )}
              <Button
                type="submit"
                variant="contained"
                className="admin-login-btn"
                disabled={otpDisabled || otp.some((digit) => digit === "")}
              >
                Verify OTP
              </Button>

              <Button
                className="try_different_method"
                onClick={() => {
                  setStep("method");
                  sessionStorage.setItem("admin-login-step", "method");
                }}
              >
                Try different method
              </Button>
            </>
          )}

          {step === "forgot" && (
            <>
              <TextField
                label="Registered Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange("email")}
              />
              <Button
                className="admin-login-btn"
                onClick={() => {
                  setOtp(["", "", "", ""]);
                  setOtpMethod("email");
                  setStep("forgot_otp");
                  sessionStorage.setItem("admin-login-step", "forgot_otp");
                  sessionStorage.setItem("admin-login-method", "email");
                  sessionStorage.setItem("otp-expiry", Date.now() + 10 * 1000);
                  setResendTimer(10);
                }}
              >
                Send Reset OTP
              </Button>
            </>
          )}

          {/* {step === "forgot_otp" && (
            <>
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                Enter the OTP sent to <b>{maskEmail(formData.email)}</b>
              </div>
              <Box className="otp-box">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    ref={otpRefs.current[index]}
                    value={digit}
                    onChange={handleOtpChange(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[index] && index > 0) {
                        otpRefs.current[index - 1]?.current?.focus();
                      }
                    }}
                    onPaste={handleOtpPaste}
                    autoComplete="one-time-code"
                    aria-label={`OTP digit ${index + 1}`}
                    disabled={otpDisabled}
                  />
                ))}
              </Box>

              <Button
                className="admin-login-btn"
                onClick={() => {
                  if (otp.join("") === "1234") {
                    setStep("reset");
                    sessionStorage.setItem("admin-login-step", "reset");
                  } else {
                    setOtpError("Invalid OTP");
                  }
                }}
                disabled={otp.some((d) => d === "")}
              >
                Verify OTP
              </Button>
            </>
          )} */}
          {step === "forgot_otp" && (
  <>
    <div style={{ textAlign: "center", marginBottom: "10px" }}>
      Enter the OTP sent to <b>{maskEmail(formData.email)}</b>
    </div>
    <Box className="otp-box">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          ref={otpRefs.current[index]}
          value={digit}
          onChange={handleOtpChange(index)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !otp[index] && index > 0) {
              otpRefs.current[index - 1]?.current?.focus();
            }
          }}
          onPaste={handleOtpPaste}
          autoComplete="one-time-code"
          aria-label={`OTP digit ${index + 1}`}
          disabled={otpDisabled}
        />
      ))}
    </Box>

    <Button
      className="admin-login-btn"
      onClick={() => {
        if (otp.join("") === "1234") {
          setStep("reset");
          sessionStorage.setItem("admin-login-step", "reset");
        } else {
          setOtpError("Invalid OTP");
        }
      }}
      disabled={otp.some((d) => d === "")}
    >
      Verify OTP
    </Button>

    {/* ADD THIS */}
    <Button
      className="try_different_method"
      onClick={() => {
        setStep("method");
        sessionStorage.setItem("admin-login-step", "method");
      }}
    >
      Try different method
    </Button>
  </>
)}


          {step === "reset" && (
            <>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                value={formData.newPassword || ""}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
              />
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                value={formData.confirmPassword || ""}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              <Button
                className="admin-login-btn"
                onClick={() => {
                  if (formData.newPassword !== formData.confirmPassword) {
                    alert("Passwords do not match!");
                    return;
                  }
                  if (
                    formData.newPassword.length < 6 ||
                    formData.newPassword.length > 16
                  ) {
                    alert("Password must be 6-16 characters long.");
                    return;
                  }

                  // simulate success
                  alert("Password successfully reset!");
                  sessionStorage.clear();
                  setStep("login");
                }}
              >
                Reset Password
              </Button>
            </>
          )}

          <BackButton />
        </form>
      </div>
    </div>
  );
};

export default Login;
