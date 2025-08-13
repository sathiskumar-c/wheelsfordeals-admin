// React Imports
import React, { useState, useRef } from "react";
import "./profile.scss";

// Local Image Imports
import Img_AdminLogin from "/images/illustrations/admin.png";

function Profile() {
  const [formData, setFormData] = useState({
    firstName: "Gopi",
    lastName: "kannan",
    email: "gopi710@gmail.com",
    phone: "9876543210",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("profile"); // profile | forgot | forgot_otp | reset
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpDisabled, setOtpDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([...Array(4)].map(() => React.createRef()));

  // ------------------ VALIDATION ------------------
  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s'-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    else if (!nameRegex.test(formData.firstName))
      newErrors.firstName = "Only letters, spaces, and hyphens allowed";

    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    else if (!nameRegex.test(formData.lastName))
      newErrors.lastName = "Only letters, spaces, and hyphens allowed";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Phone must be exactly 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------ HANDLERS ------------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: URL.createObjectURL(files[0]),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setFormData((prev) => ({ ...prev, phone: value }));
      setErrors((prev) => ({
        ...prev,
        phone: value.length === 10 ? "" : "Phone must be exactly 10 digits",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Data:", formData);
      alert("Form submitted successfully!");
    }
  };

  // ------------------ OTP HANDLERS ------------------
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

  const maskEmail = (email) => {
    const [user, domain] = email.split("@");
    return user.slice(0, 2) + "*".repeat(user.length - 2) + "@" + domain;
  };

  // ------------------ BACK BUTTON ------------------
  const BackButton = () => {
    const handleBack = () => {
      if (step === "forgot_otp") {
        setStep("forgot");
      } else if (step === "reset") {
        setStep("forgot_otp");
      } else if (step === "forgot") {
        setStep("profile");
      }
    };

    if (step === "profile") return null;

    return (
      <button className="back-btn" type="button" onClick={handleBack}>
        ← Back
      </button>
    );
  };

  return (
    <div className="account-container">
      {step === "profile" && (
        <>
          <div className="profile-section">
            <img
              className="profile-img"
              src={
                formData.image ||
                "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt="Profile"
              onError={(e) => {
                e.target.src =
                  "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
              }}
            />
            <h2 className="my-0">
              {formData.firstName} {formData.lastName}
            </h2>
            <label className="upload-btn">
              Upload picture
              <input type="file" name="image" onChange={handleChange} hidden />
            </label>
          </div>

          <form className="form-section" onSubmit={handleSubmit} noValidate>
            <h3>Profile</h3>
            <p>The information can be edited</p>

            <div className="form-grid">
              {[
                {
                  name: "firstName",
                  label: "First name",
                  type: "text",
                  value: formData.firstName,
                  error: errors.firstName,
                  onChange: handleChange,
                },
                {
                  name: "lastName",
                  label: "Last name",
                  type: "text",
                  value: formData.lastName,
                  error: errors.lastName,
                  onChange: handleChange,
                },
                {
                  name: "email",
                  label: "Email address",
                  type: "email",
                  value: formData.email,
                  error: errors.email,
                  onChange: handleChange,
                },
                {
                  name: "phone",
                  label: "Phone number",
                  type: "tel",
                  value: formData.phone,
                  error: errors.phone,
                  onChange: handlePhoneChange,
                },
              ].map((field, i) => (
                <div className="form-group" key={i}>
                  <input
                    type={field.type}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    className={field.value ? "filled" : ""}
                    required
                  />
                  <label className={field.value ? "filled" : ""}>
                    {field.label}
                  </label>
                  {field.error && (
                    <small className="error">{field.error}</small>
                  )}
                </div>
              ))}
            </div>

            <button type="submit" className="save-btn">
              Save details
            </button>

            <button
              type="button"
              className="forgot-password-link"
              onClick={() => setStep("forgot")}
            >
              Forgot password?
            </button>
          </form>
        </>
      )}
      {/* {step === "forgot" && (
        <div className="forgot-container">
          <div className="forgot-password-section">
            <h3>Forgot Password</h3>
            <input
              type="email"
              placeholder="Enter registered email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <button
              onClick={() => {
                setOtp(["", "", "", ""]);
                setStep("forgot_otp");
                setResendTimer(10);
                sessionStorage.setItem("otp-expiry", Date.now() + 10 * 1000);
              }}
            >
              Send Reset OTP
            </button>
            <BackButton />
          </div>
        </div>
      )} */}
      {step === "forgot" && (
  <div className="forgot-layout">
    <div className="forgot-left">
      <img
        src={Img_AdminLogin}
        alt="Illustration"
      />
    </div>
    <div className="forgot-right">
      <h3 className="forgot-title">Verification OTP</h3>
      <input
        type="email"
        placeholder="Registered Email"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
      />
      <button
        onClick={() => {
          setOtp(["", "", "", ""]);
          setStep("forgot_otp");
          setResendTimer(10);
          sessionStorage.setItem("otp-expiry", Date.now() + 10 * 1000);
        }}
      >
        Send Reset OTP
      </button>
      <BackButton />
    </div>
  </div>
)}

      {step === "forgot_otp" && (
        <div className="forgot-container">
          <div className="otp-section">
            <p>
              Enter the OTP sent to <b>{maskEmail(formData.email)}</b>
            </p>
            <div className="otp-box">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  ref={otpRefs.current[index]}
                  value={digit}
                  onChange={handleOtpChange(index)}
                  onPaste={handleOtpPaste}
                  disabled={otpDisabled}
                />
              ))}
            </div>
            <button
              onClick={() => {
                if (otp.join("") === "1234") {
                  setStep("reset");
                } else {
                  setOtpError("Invalid OTP");
                }
              }}
              disabled={otp.some((d) => d === "")}
            >
              Verify OTP
            </button>
            {otpError && <small className="error">{otpError}</small>}
            <BackButton />
          </div>
        </div>
      )}

      {step === "reset" && (
        <div className="forgot-container">
          <div className="reset-password-section">
            <h3>Reset Password</h3>
            <input
              type="password"
              placeholder="New password"
              value={formData.newPassword || ""}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword || ""}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <button
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
                alert("Password reset successful!");
                setStep("profile");
              }}
            >
              Reset Password
            </button>
            <BackButton />
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
