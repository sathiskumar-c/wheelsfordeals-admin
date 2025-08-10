// React Imports
import React, { useState } from "react";

// Local Imports
import "./profile.scss";

function Profile() {
  const [formData, setFormData] = useState({
    firstName: "Gopi",
    lastName: "kannan",
    email: "gopi710@gmail.com",
    phone: "9876543210",
    image: null,
  });

  const [errors, setErrors] = useState({});

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
      setFormData((prev) => ({
        ...prev,
        phone: value,
      }));

      if (value.length !== 10) {
        setErrors((prev) => ({
          ...prev,
          phone: "Phone must be exactly 10 digits",
        }));
      } else {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Data:", formData);
      alert("Form submitted successfully!");
    } else {
      console.warn("Form has validation errors.");
    }
  };

  return (
    <div className="account-container">
      <div className="profile-section">
        <img
          className="profile-img"
          src={
            formData.image ||
            "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
          }
          alt="Profile"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
          }}
        />
        <h2 className="my-0">
          {formData.firstName || "First Name"}{" "}
          {formData.lastName || "Last Name"}
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
          ].map((field, index) => (
            <div className="form-group" key={index}>
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
              {field.error && <small className="error">{field.error}</small>}
            </div>
          ))}
        </div>

        <button type="submit" className="save-btn">
          Save details
        </button>
      </form>
    </div>
  );
}
export default Profile;
