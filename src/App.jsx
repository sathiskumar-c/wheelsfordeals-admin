// React & Router Imports
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages Imports
import Login from "./pages/login/login";
import DashBoard from "./pages/dashboard/dashboard";
import Account from "./pages/account/account";
import ForgotPassword from "./pages/forgot-password/forgot-password";
import Sales from "./pages/sales/sales";
import MyProfile from "./pages/my-profile/my-profile";
import Branches from "./pages/branches/branches";
import UserPages from "./pages/user-pages/user-pages";
import Bikes from "./pages/bikes/bikes";

// Components Imports
import NavbarDeskTop from "./components/common/navbar/navbar";
import PageNotFound from "./components/page-not-found/page-not-found";
import UploadNewBike from "./components/upload-new-bike/upload-new-bike";

// Local Imports
import "./App.scss";

const App = () => {
  const handleFormSubmit = (data) => {
    console.log("Submitted Data:", data);
  };

  return (
    <React.Fragment>
      <Router>
        <NavbarDeskTop />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/branches" element={<Branches />} />
          <Route
            path="/newbike"
            element={<UploadNewBike onSubmit={handleFormSubmit} />}
          />
          <Route path="/bikes" element={<Bikes />} />
          <Route path="/user-pages" element={<UserPages />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/page-not-found" element={<PageNotFound />} />
          <Route path="*" element={<Navigate to="/page-not-found" replace />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
};

export default App;
