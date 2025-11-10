// React Imports
import React from "react";

// MUI Imports
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";

// Local Imports
import "./custom-popover.scss";

const CustomPopover = ({
  trigger,
  popoverContent = "popover content",
  popoverId = "custom-popover",
  anchorOrigin = { vertical: "bottom", horizontal: "center" },
  transformOrigin = { vertical: "top", horizontal: "center" },
  contentStyle = {},
}) => {
  return (
    <PopupState variant="popover" popupId={popoverId}>
      {(popupState) => (
        <div>
          <span {...bindTrigger(popupState)} style={{ cursor: "pointer" }}>
            {trigger}
          </span>

          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
          >
            <Typography sx={{ p: 1, ...contentStyle }}>
              {popoverContent}
            </Typography>
          </Popover>
        </div>
      )}
    </PopupState>
  );
};

export default CustomPopover;
