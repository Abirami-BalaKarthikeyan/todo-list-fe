import React from "react";
import GaugeChart from "react-gauge-chart";

// This component expects a single value from the data to display on the gauge
const CustomGaugeChart = ({ data }) => {
  // For demonstration, use the first value in the data array (customize as needed)
  const value = data && data.length > 0 ? data[0].value || data[0].count || 0 : 0;
  // Normalize value between 0 and 1 for the gauge
  const percent = Math.min(Math.max(value / 100, 0), 1);

  return (
    <div style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
      <h2 className="text-center text-lg font-semibold mb-2">Gauge Chart</h2>
      <GaugeChart id="gauge-chart1" nrOfLevels={20} percent={percent} textColor="#000" />
      <div className="text-center mt-2">Value: {value}</div>
    </div>
  );
};

export default CustomGaugeChart;
