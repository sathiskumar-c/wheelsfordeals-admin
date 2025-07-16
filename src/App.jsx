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

// Components Imports
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
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashBoard />} />

          <Route
            path="/newbike"
            element={<UploadNewBike onSubmit={handleFormSubmit} />}
          />

          <Route path="/login" element={<Login />} />

          <Route path="/page-not-found" element={<PageNotFound />} />
          <Route path="*" element={<Navigate to="/page-not-found" replace />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
};

export default App;
