// React Imports
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// MUI Imports
import { TextField, Box, Button, FormHelperText } from "@mui/material";

// Local Imports
import "./forgot-password.scss";
import Img_AdminLogin from "/images/illustrations/admin.png";

const ForgotPassword = () => {
  // State initialization with sessionStorage restore
  const [step, setStep] = useState(
    () => sessionStorage.getItem("admin-login-step") || "forgot"
  );
  // Hardcoded demo email and mobile
  const DEMO_EMAIL = "admin@example.com";
  const DEMO_MOBILE = "9876543210";
  const [formData, setFormData] = useState({
    email: DEMO_EMAIL,
    mobile: DEMO_MOBILE,
    newPassword: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const RESEND_LIMIT = 3;
  const [otpDisabled, setOtpDisabled] = useState(false);
  const [method, setMethod] = useState(
    () => sessionStorage.getItem("admin-login-method") || "email"
  );

  const navigate = useNavigate();
  const otpRefs = useRef([...Array(4)].map(() => React.createRef()));

  // Restore resend timer on OTP step
  useEffect(() => {
    if (step === "forgot_otp") {
      const interval = setInterval(() => {
        const expiry = parseInt(sessionStorage.getItem("otp-expiry"), 10);
        const remaining = Math.max(0, Math.ceil((expiry - Date.now()) / 1000));
        setResendTimer(remaining);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  // OTP change handler
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

  // OTP paste handler
  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.length === otp.length) {
      setOtp(pasted.split(""));
      otpRefs.current[otp.length - 1]?.current?.focus();
      e.preventDefault();
    }
  };

  // Email mask helper
  const maskEmail = (email) => {
    if (!email.includes("@")) return email;
    const [user, domain] = email.split("@");
    return (
      user.slice(0, 2) + "*".repeat(Math.max(0, user.length - 2)) + "@" + domain
    );
  };
  // Mobile mask helper
  const maskMobile = (mobile) => {
    if (!mobile || mobile.length < 4) return mobile;
    return "**********" + mobile.slice(-3);
  };

  // Back button
  const BackButton = () => {
    const handleBack = () => {
      if (step === "forgot_otp") {
        setStep(method === "email" ? "forgot" : "forgot_method");
        sessionStorage.setItem(
          "admin-login-step",
          method === "email" ? "forgot" : "forgot_method"
        );
      } else if (step === "reset") {
        setStep("forgot_otp");
        sessionStorage.setItem("admin-login-step", "forgot_otp");
      } else if (step === "forgot") {
        navigate("/login");
        sessionStorage.clear();
      } else if (step === "forgot_method") {
        setStep("forgot");
        sessionStorage.setItem("admin-login-step", "forgot");
      }
    };
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
          alt="Forgot Password"
          className="admin-login-img"
        />
      </div>

      <div className="admin-login-right">
        <form role="form" className="admin-login-form">
          <h2 className={`form-title text-center`}>
            {step === "forgot"
              ? "Forgot Password"
              : step === "forgot_otp"
              ? "Verification OTP"
              : "Reset Password"}
          </h2>

          {step === "forgot" && (
            <>
              <TextField
                label="Registered Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  sessionStorage.setItem("admin-login-email", e.target.value);
                }}
              />
              <Button
                className="admin-login-btn"
                onClick={() => {
                  setOtp(["", "", "", ""]);
                  sessionStorage.setItem("admin-login-step", "forgot_otp");
                  sessionStorage.setItem("admin-login-method", "email");
                  sessionStorage.setItem("otp-expiry", Date.now() + 10 * 1000);
                  setResendTimer(10);
                  setMethod("email");
                  setStep("forgot_otp");
                }}
              >
                Send Reset OTP
              </Button>
              <Button
                className="try_different_method"
                onClick={() => {
                  setStep("forgot_method");
                  sessionStorage.setItem("admin-login-step", "forgot_method");
                }}
              >
                Try different method
              </Button>
            </>
          )}

          {step === "forgot_otp" && (
            <>
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {method === "email" ? (
                  <>
                    Enter the OTP sent to <b>{maskEmail(formData.email)}</b>
                  </>
                ) : (
                  <>
                    Enter the OTP sent to your mobile{" "}
                    <b>{maskMobile(formData.mobile)}</b>
                  </>
                )}
              </div>
              <Box className="otp-box" role="group" aria-label="OTP Input">
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
                    aria-invalid={!!otpError}
                    disabled={otpDisabled}
                  />
                ))}
              </Box>

              {resendTimer > 0 ? (
                <p style={{ textAlign: "center", margin: "10px 0" }}>
                  You can resend OTP in <b>{resendTimer}s</b>
                </p>
              ) : (
                <Button
                  variant="text"
                  className="resend_otp"
                  onClick={() => {
                    if (resendCount < RESEND_LIMIT) {
                      setOtp(["", "", "", ""]);
                      otpRefs.current[0]?.current?.focus();
                      sessionStorage.setItem(
                        "otp-expiry",
                        Date.now() + 10 * 1000
                      );
                      setResendTimer(10);
                      setResendCount(resendCount + 1);
                    }
                  }}
                  disabled={resendCount >= RESEND_LIMIT}
                >
                  {resendCount >= RESEND_LIMIT
                    ? "Resend Limit Reached"
                    : "Resend OTP"}
                </Button>
              )}

              {otpError && (
                <FormHelperText error sx={{ textAlign: "center" }}>
                  {otpError}
                </FormHelperText>
              )}

              <Button
                className="admin-login-btn"
                onClick={() => {
                  if (otp.join("") === "1234") {
                    setStep("reset");
                    sessionStorage.setItem("admin-login-step", "reset");
                  } else {
                    setOtpError("Invalid OTP");
                    setOtpDisabled(true);
                    setTimeout(() => setOtpDisabled(false), 3000);
                  }
                }}
                disabled={otp.some((d) => d === "")}
              >
                Verify OTP
              </Button>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  className="try_different_method"
                  onClick={() => {
                    setStep("forgot_method");
                    sessionStorage.setItem("admin-login-step", "forgot_method");
                  }}
                >
                  Try different method
                </Button>
                <BackButton />
              </Box>
            </>
          )}

          {step === "reset" && (
            <>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                value={formData.newPassword}
                onChange={(e) => {
                  setFormData({ ...formData, newPassword: e.target.value });
                  setPasswordError("");
                }}
                aria-label="Enter new password (6-16 characters, must include uppercase, number, special character)"
              />
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  setPasswordError("");
                }}
                aria-label="Confirm new password"
              />
              {passwordError && (
                <FormHelperText error sx={{ textAlign: "center" }}>
                  {passwordError}
                </FormHelperText>
              )}
              <Button
                className="admin-login-btn"
                onClick={() => {
                  if (formData.newPassword !== formData.confirmPassword) {
                    setPasswordError("Passwords do not match!");
                    return;
                  }
                  if (
                    formData.newPassword.length < 6 ||
                    formData.newPassword.length > 16
                  ) {
                    setPasswordError("Password must be 6-16 characters long.");
                    return;
                  }
                  // Password strength: at least one uppercase, one number, one special character
                  if (!/[A-Z]/.test(formData.newPassword)) {
                    setPasswordError(
                      "Password must include at least one uppercase letter."
                    );
                    return;
                  }
                  if (!/[0-9]/.test(formData.newPassword)) {
                    setPasswordError(
                      "Password must include at least one number."
                    );
                    return;
                  }
                  if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)) {
                    setPasswordError(
                      "Password must include at least one special character."
                    );
                    return;
                  }
                  alert("Password successfully reset!");
                  sessionStorage.clear();
                  navigate("/login");
                }}
              >
                Reset Password
              </Button>
              <BackButton />
            </>
          )}
          {step === "forgot_method" && (
            <>
              <Button
                className="admin-login-btn"
                variant="outlined"
                onClick={() => {
                  setOtp(["", "", "", ""]);
                  sessionStorage.setItem("admin-login-method", "email");
                  sessionStorage.setItem("admin-login-step", "forgot_otp");
                  sessionStorage.setItem("otp-expiry", Date.now() + 10 * 1000);
                  setResendTimer(10);
                  setMethod("email");
                  setStep("forgot_otp");
                }}
              >
                Verify via Email
              </Button>
              <Button
                className="admin-login-btn"
                variant="outlined"
                onClick={() => {
                  setOtp(["", "", "", ""]);
                  sessionStorage.setItem("admin-login-method", "mobile");
                  sessionStorage.setItem("admin-login-step", "forgot_otp");
                  sessionStorage.setItem("otp-expiry", Date.now() + 10 * 1000);
                  setResendTimer(10);
                  setMethod("mobile");
                  setStep("forgot_otp");
                }}
              >
                Verify via Mobile
              </Button>
              <BackButton />
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
