// React Imports
import React from "react";
import PropTypes from "prop-types";

// Local Imports
import "./metric-card.scss";

const MetricsCard = ({
  title,
  value,
  icon,
  change,
  changeType,
  description,
}) => {
  return (
    <div className="metrics-card" role="region" aria-label={title}>
      <div className="metrics-card__top">
        <div className="metrics-card__content">
          <p className="metrics-card__title">{title}</p>
          <p className="metrics-card__value">{value}</p>
          {change && (
            <p
              className={`metrics-card__change metrics-card__change--${changeType}`}
              aria-label={`Change: ${
                changeType === "up" ? "Increase" : "Decrease"
              } ${change}`}
            >
              {changeType === "up" ? "▲" : "▼"} {change}
              <span className="metrics-card__description">{description}</span>
            </p>
          )}
        </div>
        <div className="metrics-card__icon" aria-hidden="true">
          {icon}
        </div>
      </div>
    </div>
  );
};

MetricsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  change: PropTypes.string,
  changeType: PropTypes.oneOf(["up", "down"]),
  description: PropTypes.string,
};

export default MetricsCard;
