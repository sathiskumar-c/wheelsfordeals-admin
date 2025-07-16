// React Imports
import React from "react";
import { Link } from "react-router-dom";

// Local Imports
import "./page-not-found.scss";

const PageNotFound = () => {
  return (
    <section className="page-not-found">
      <div className="page-not-found__container">
        <p className="page-not-found__code">404</p>
        <h1 className="page-not-found__title">Page not found</h1>
        <p className="page-not-found__message">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="page-not-found__actions">
          <Link to="/" className="btn__primary">
            Go back home
          </Link>

          <Link to="/contact-us" className="btn btn__link">
            Contact support →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PageNotFound;
