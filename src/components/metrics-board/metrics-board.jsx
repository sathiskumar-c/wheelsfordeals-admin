// React Imports
import React from "react";

// MUI Imports
import {
  AttachMoney,
  Group,
  AssignmentTurnedIn,
  TrendingUp,
} from "@mui/icons-material";

// Component Imports
import MetricsCard from "../common/metric-card/metric-card";

// Local Imports
import "./metrics-board.scss";
import statsJson from "../../data/dashboard-stats.json";

const iconMap = {
  dollar: <AttachMoney />,
  users: <Group />,
  tasks: <AssignmentTurnedIn />,
  chart: <TrendingUp />,
};

const MetricsBoard = () => {
  return (
    <section className="dashboard-stats">
      {statsJson?.statsData?.map((stat, idx) => (
        <MetricsCard
          key={idx}
          title={stat.title}
          value={stat.value}
          icon={iconMap[stat.icon]}
          change={stat.change}
          changeType={stat.changeType}
          description={stat.description}
        />
      ))}
    </section>
  );
};

export default MetricsBoard;
