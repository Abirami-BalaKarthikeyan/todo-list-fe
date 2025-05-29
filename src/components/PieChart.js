import React, { useState, useMemo } from "react";
import { ResponsivePie } from "@nivo/pie";
import data from "../utils/data5.json";

const DynamicTelecomPieChart = () => {
  // Sample data from the user

  // Get available Y-axis options
  const yAxisOptions = data["Y-Axis"];

  // State for selected Y-axis
  const [selectedYAxis, setSelectedYAxis] = useState(yAxisOptions[0]);

  // Extract label from x-axis data
  const extractLabel = (xAxisItem) => {
    const key = Object.keys(xAxisItem)[0];
    const value = xAxisItem[key];

    // Try to extract customer name (second part after splitting by '-')
    const parts = value.split("-");
    if (parts.length > 1) {
      return parts[1].trim();
    }

    // Fallback to first 30 characters if pattern doesn't match
    return value.length > 30 ? value.substring(0, 30) + "..." : value;
  };

  // Prepare pie chart data based on selected Y-axis
  const pieChartData = useMemo(() => {
    return data.data.y_axis
      .map((yItem, index) => {
        const xItem = data.data.x_axis[index];
        const label = extractLabel(xItem);
        const value = yItem[selectedYAxis] || 0;

        return {
          id: `${label}_${index}`,
          label: label,
          value: value,
        };
      })
      .filter((item) => item.value > 0); // Filter out zero values
  }, [selectedYAxis, data]);

  // Calculate total for the selected metric
  const totalValue = useMemo(() => {
    return data.data.y_axis.reduce(
      (sum, item) => sum + (item[selectedYAxis] || 0),
      0
    );
  }, [selectedYAxis, data]);

  // Pie chart configuration
  const pieProps = {
    margin: { top: 40, right: 80, bottom: 80, left: 80 },
    innerRadius: 0.4,
    padAngle: 0.7,
    cornerRadius: 1,
    activeOuterRadiusOffset: 8,
    borderWidth: 2,
    borderColor: {
      from: "color",
      modifiers: [["darker", 0.2]],
    },
    arcLinkLabelsSkipAngle: 10,
    arcLinkLabelsTextColor: "#333333",
    arcLinkLabelsThickness: 2,
    arcLinkLabelsColor: { from: "color" },
    arcLabelsSkipAngle: 10,
    arcLabelsTextColor: {
      from: "color",
      modifiers: [["darker", 2]],
    },
    colors: { scheme: "category10" },
    animate: true,
    motionConfig: "gentle",
    legends: [
      {
        anchor: "bottom",
        direction: "row",
        justify: false,
        translateX: 0,
        translateY: 56,
        itemsSpacing: 0,
        itemWidth: 100,
        itemHeight: 18,
        itemTextColor: "#999",
        itemDirection: "left-to-right",
        itemOpacity: 1,
        symbolSize: 18,
        symbolShape: "circle",
      },
    ],
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <label
                htmlFor="yaxis-select"
                className="text-lg font-semibold text-gray-700"
              >
                Select Metric:
              </label>
              <select
                id="yaxis-select"
                value={selectedYAxis}
                onChange={(e) => setSelectedYAxis(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
              >
                {yAxisOptions.map((option) => (
                  <option key={option} value={option}>
                    {option
                      .replace(/[()]/g, "")
                      .replace(/_/g, " ")
                      .toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600">Total: </span>
              <span className="text-xl font-bold text-blue-600">
                {totalValue}
              </span>
            </div>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
            {selectedYAxis
              .replace(/[()]/g, "")
              .replace(/_/g, " ")
              .toUpperCase()}{" "}
            Distribution
          </h2>

          <div className="h-96">
            {pieChartData.length > 0 ? (
              <ResponsivePie data={pieChartData} {...pieProps} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="text-6xl mb-4">📊</div>
                <div className="text-xl font-semibold">No Data Available</div>
                <div className="text-sm">
                  All values for "{selectedYAxis}" are zero
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicTelecomPieChart;
