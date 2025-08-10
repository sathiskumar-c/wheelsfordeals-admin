// // ForgotPassword.jsx
// import React, { useEffect, useRef, useState } from "react";
// import "./forgot-password.scss";
// import Img_AdminLogin from "/images/illustrations/admin.png";

// export default function ForgotPassword() {
//   const [step, setStep] = useState("forgot"); // forgot | method | forgot_otp | reset
//   const [formData, setFormData] = useState({
//     email: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [otpError, setOtpError] = useState("");
//   const [otpMethod, setOtpMethod] = useState(""); // "email" | "mobile"
//   const [otpDisabled, setOtpDisabled] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0);
//   const otpRefs = useRef([...Array(4)].map(() => React.createRef()));

//   // Restore state from session (if any)
//   useEffect(() => {
//     const savedStep = sessionStorage.getItem("forgot-step");
//     const savedMethod = sessionStorage.getItem("forgot-method");
//     const savedEmail = sessionStorage.getItem("forgot-email");
//     if (savedEmail) setFormData((s) => ({ ...s, email: savedEmail }));
//     if (savedStep) setStep(savedStep);
//     if (savedMethod) setOtpMethod(savedMethod);
//   }, []);

//   // Timer based on otp-expiry (accurate countdown)
//   useEffect(() => {
//     if (step !== "forgot_otp") {
//       setResendTimer(0);
//       return;
//     }
//     const updateRemaining = () => {
//       const expiry = parseInt(sessionStorage.getItem("otp-expiry"), 10) || 0;
//       const remaining = Math.max(0, Math.ceil((expiry - Date.now()) / 1000));
//       setResendTimer(remaining);
//     };
//     updateRemaining();
//     const interval = setInterval(updateRemaining, 1000);
//     return () => clearInterval(interval);
//   }, [step]);

//   // basic input handler
//   const handleChange = (field) => (e) => {
//     setFormData((prev) => ({ ...prev, [field]: e.target.value }));
//   };

//   const maskEmail = (email) => {
//     if (!email) return "email@example.com";
//     const [user, domain] = email.split("@");
//     if (!domain) return email;
//     return user.slice(0, 2) + "*".repeat(Math.max(0, user.length - 2)) + "@" + domain;
//   };
//   const maskPhone = (phone = "+91-9876543210") => phone.replace(/.(?=.{4})/g, "*");

//   // OTP handlers
//   const handleOtpChange = (index) => (e) => {
//     const value = e.target.value.replace(/\D/g, "");
//     if (value.length > 1) return;
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     setOtpError("");
//     if (value && index < otp.length - 1) otpRefs.current[index + 1]?.current?.focus();
//   };

//   const handleOtpPaste = (e) => {
//     const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
//     if (pasted.length === otp.length) {
//       setOtp(pasted.split(""));
//       otpRefs.current[otp.length - 1]?.current?.focus();
//       e.preventDefault();
//     }
//   };

//   // select method (email/mobile) and send OTP (set expiry)
//   const handleSelectMethod = (method) => {
//     if (!formData.email && method === "email") {
//       alert("Please enter your registered email first.");
//       return;
//     }
//     setOtp(["", "", "", ""]);
//     setOtpMethod(method);
//     setStep("forgot_otp");
//     sessionStorage.setItem("forgot-step", "forgot_otp");
//     sessionStorage.setItem("forgot-method", method);
//     sessionStorage.setItem("forgot-email", formData.email || "");
//     const expiry = Date.now() + 10 * 1000; // 10s demo
//     sessionStorage.setItem("otp-expiry", expiry.toString());
//     setResendTimer(Math.ceil((expiry - Date.now()) / 1000));
//     // focus first OTP input a tick later
//     setTimeout(() => otpRefs.current[0]?.current?.focus(), 50);
//   };

//   const handleOtpSubmit = (e) => {
//     e?.preventDefault();
//     const entered = otp.join("");
//     const dummy = "1234";
//     if (entered === dummy) {
//       // success -> move to reset
//       setStep("reset");
//       sessionStorage.setItem("forgot-step", "reset");
//       setOtpError("");
//     } else {
//       setOtpError("Invalid OTP");
//       setOtpDisabled(true);
//       setTimeout(() => setOtpDisabled(false), 3000);
//     }
//   };

//   const handleResend = () => {
//     // simulate resend
//     setOtp(["", "", "", ""]);
//     otpRefs.current[0]?.current?.focus();
//     const expiry = Date.now() + 10 * 1000;
//     sessionStorage.setItem("otp-expiry", expiry.toString());
//     setResendTimer(Math.ceil((expiry - Date.now()) / 1000));
//     // in real app call resend API here
//   };

//   // Back button component
//   const BackButton = () => {
//     const handleBack = () => {
//       if (step === "forgot_otp") {
//         setStep("method");
//         sessionStorage.setItem("forgot-step", "method");
//       } else if (step === "method") {
//         setStep("forgot");
//         sessionStorage.setItem("forgot-step", "forgot");
//       } else if (step === "reset") {
//         setStep("forgot_otp");
//         sessionStorage.setItem("forgot-step", "forgot_otp");
//       }
//     };
//     if (step === "forgot") return null;
//     return (
//       <button className="back-btn" type="button" onClick={handleBack}>
//         ← Back
//       </button>
//     );
//   };

//   // Reset password submission
//   const handleResetSubmit = () => {
//     if (formData.newPassword !== formData.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }
//     if (!formData.newPassword || formData.newPassword.length < 6 || formData.newPassword.length > 16) {
//       alert("Password must be 6-16 characters long.");
//       return;
//     }
//     // success
//     alert("Password reset successful!");
//     sessionStorage.clear();
//     setFormData({ email: "", newPassword: "", confirmPassword: "" });
//     setOtp(["", "", "", ""]);
//     setOtpMethod("");
//     setStep("forgot"); // or redirect to login page
//   };

//   return (
//     <div className="forgot-layout">
//       <div className="forgot-left">
//         <img src={Img_AdminLogin} alt="Illustration" />
//       </div>

//       <div className="forgot-right">
//         {/* Step: ask email */}
//         {step === "forgot" && (
//           <>
//             <h3 className="forgot-title">Reset your password</h3>
//             <input
//               type="email"
//               placeholder="Registered Email"
//               value={formData.email}
//               onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
//             />
//             <button
//               onClick={() => {
//                 if (!formData.email) {
//                   alert("Enter your registered email to continue.");
//                   return;
//                 }
//                 setStep("method");
//                 sessionStorage.setItem("forgot-step", "method");
//                 sessionStorage.setItem("forgot-email", formData.email);
//               }}
//             >
//               Continue
//             </button>
//             <BackButton />
//           </>
//         )}

//         {/* Step: method selection */}
//         {step === "method" && (
//           <>
//             <h3 className="forgot-title">Select verification method</h3>
//             <button onClick={() => handleSelectMethod("email")}>Verify via Email</button>
//             <button onClick={() => handleSelectMethod("mobile")}>Verify via Mobile</button>
//             <BackButton />
//           </>
//         )}

//         {/* Step: OTP */}
//         {step === "forgot_otp" && (
//           <>
//             <p>
//               Enter the OTP sent to{" "}
//               <b>{otpMethod === "email" ? maskEmail(formData.email || sessionStorage.getItem("forgot-email")) : maskPhone()}</b>
//             </p>

//             <div className="otp-box">
//               {otp.map((d, i) => (
//                 <input
//                   key={i}
//                   type="text"
//                   maxLength={1}
//                   ref={otpRefs.current[i]}
//                   value={d}
//                   onChange={handleOtpChange(i)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Backspace" && !otp[i] && i > 0) {
//                       otpRefs.current[i - 1]?.current?.focus();
//                     }
//                   }}
//                   onPaste={handleOtpPaste}
//                   disabled={otpDisabled}
//                 />
//               ))}
//             </div>

//             {resendTimer > 0 ? (
//               <p style={{ textAlign: "center", margin: "10px 0" }}>
//                 You can resend OTP in <b>{resendTimer}s</b>
//               </p>
//             ) : (
//               <button className="resend_otp" onClick={handleResend}>
//                 Resend OTP
//               </button>
//             )}

//             {otpError && <small className="error">{otpError}</small>}

//             <button className="verify-btn" onClick={handleOtpSubmit} disabled={otp.some((d) => d === "")}>
//               Verify OTP
//             </button>

//             <button className="try_different_method" onClick={() => { setStep("method"); sessionStorage.setItem("forgot-step", "method"); }}>
//               Try different method
//             </button>

//             <BackButton />
//           </>
//         )}

//         {/* Step: reset password */}
//         {step === "reset" && (
//           <>
//             <h3>Reset Password</h3>
//             <input
//               type="password"
//               placeholder="New password"
//               value={formData.newPassword}
//               onChange={(e) => setFormData((p) => ({ ...p, newPassword: e.target.value }))}
//             />
//             <input
//               type="password"
//               placeholder="Confirm password"
//               value={formData.confirmPassword}
//               onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
//             />
//             <button onClick={handleResetSubmit}>Reset Password</button>
//             <BackButton />
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// React Imports
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// MUI Imports
import { TextField, Box, Button, FormHelperText } from "@mui/material";

// Local Imports
import "./forgot-password.scss";
import Img_AdminLogin from "/images/illustrations/admin.png";

const ForgotPassword = () => {
  const [step, setStep] = useState("forgot"); // forgot -> forgot_otp -> reset
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [otpDisabled, setOtpDisabled] = useState(false);

  const navigate = useNavigate();
  const otpRefs = useRef([...Array(4)].map(() => React.createRef()));

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
    const [user, domain] = email.split("@");
    return user.slice(0, 2) + "*".repeat(user.length - 2) + "@" + domain;
  };

  // Back button
  const BackButton = () => {
    const handleBack = () => {
      if (step === "forgot_otp") {
        setStep("forgot");
        sessionStorage.setItem("admin-login-step", "forgot");
      } else if (step === "reset") {
        setStep("forgot_otp");
        sessionStorage.setItem("admin-login-step", "forgot_otp");
      } else if (step === "forgot") {
        navigate("/login");
        sessionStorage.clear();
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
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <Button
                className="admin-login-btn"
                onClick={() => {
                  setOtp(["", "", "", ""]);
                  sessionStorage.setItem("admin-login-step", "forgot_otp");
                  sessionStorage.setItem("admin-login-method", "email");
                  sessionStorage.setItem("otp-expiry", Date.now() + 10 * 1000);
                  setResendTimer(10);
                  setStep("forgot_otp");
                }}
              >
                Send Reset OTP
              </Button>
            </>
          )}

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

              {resendTimer > 0 ? (
                <p style={{ textAlign: "center", margin: "10px 0" }}>
                  You can resend OTP in <b>{resendTimer}s</b>
                </p>
              ) : (
                <Button
                  variant="text"
                  className="resend_otp"
                  onClick={() => {
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

              <Button
                className="try_different_method"
                onClick={() => {
                  setStep("forgot_method");
                  sessionStorage.setItem("admin-login-step", "forgot");
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
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
              />
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                value={formData.confirmPassword}
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

                  alert("Password successfully reset!");
                  sessionStorage.clear();
                  navigate("/login");
                }}
              >
                Reset Password
              </Button>
            </>
          )}
          {step === "forgot_method" && (
            <>
              <Button
                variant="outlined"
                onClick={() => {
                  setOtp(["", "", "", ""]);
                  sessionStorage.setItem("admin-login-method", "email");
                  sessionStorage.setItem("otp-expiry", Date.now() + 10 * 1000);
                  setResendTimer(10);
                  setStep("forgot_otp");
                }}
              >
                Verify via Email
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setOtp(["", "", "", ""]);
                  sessionStorage.setItem("admin-login-method", "mobile");
                  sessionStorage.setItem("otp-expiry", Date.now() + 10 * 1000);
                  setResendTimer(10);
                  setStep("forgot_otp");
                }}
              >
                Verify via Mobile
              </Button>
            </>
          )}

          <BackButton />
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
