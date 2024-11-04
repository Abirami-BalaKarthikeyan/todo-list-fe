import styled from "@emotion/styled";
import { Tooltip, tooltipClasses } from "@mui/material";

const CssTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#FFD1DE",
    color: "#AA336A",
    fontSize: 14,
    padding: "8px 16px",
    borderRadius: 10,
    opacity: 0.9,
  },
  [`& .${tooltipClasses.arrow}`]: {
    "&::before": {
      backgroundColor: "#FFD1DE",
    },
  },
}));

export default CssTooltip;
