import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import data5 from "../utils/data5.json";

const MultiAxisChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [selectedBarMetrics, setSelectedBarMetrics] = useState([
    "total_submissions",
  ]);
  const [selectedLineMetrics, setSelectedLineMetrics] = useState([
    "sum(submission_success)",
  ]);

  // Helper function to extract customer name from x_axis string
  const extractCustomerName = (xAxisString) => {
    const parts = xAxisString.split("-");
    return parts.length > 1 ? parts[1] : xAxisString;
  };

  // Helper function to extract supplier name from x_axis string
  const extractSupplier = (xAxisString) => {
    const parts = xAxisString.split("-");
    return parts.length > 3 ? parts[3] : xAxisString;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Transform data5 for the multi-axis chart
      const transformDataLocal = (barMetrics, lineMetrics) => {
        if (!data5.data || !data5.data.x_axis || !data5.data.y_axis) {
          return { barData: [], lineData: [] };
        }

        // Create combined data for both bar and line charts
        const combinedData = data5.data.x_axis.map((xItem, index) => {
          const xAxisKey = Object.keys(xItem)[0];
          const xAxisValue = xItem[xAxisKey];
          const yAxisData = data5.data.y_axis[index] || {};

          const customerName = extractCustomerName(xAxisValue);
          const supplier = extractSupplier(xAxisValue);
          const label = `${customerName} - ${supplier}`;

          return {
            id: label,
            label: label,
            customerName,
            supplier,
            originalKey: xAxisValue,
            ...yAxisData,
          };
        });

        // Sort by total_submissions and show all data
        const sortedData = combinedData
          .sort(
            (a, b) => (b.total_submissions || 0) - (a.total_submissions || 0)
          )
          .filter((item) => (item.total_submissions || 0) > 0);

        // Create bar chart data
        const barChartData = sortedData.map((item) => {
          const barItem = { id: item.id, label: item.label };
          barMetrics.forEach((metric) => {
            barItem[metric] = item[metric] || 0;
          });
          return barItem;
        });

        // Create line chart data
        const lineChartData = lineMetrics.map((metric) => ({
          id: metric
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          data: sortedData.map((item, index) => ({
            x: index, // Use index for consistent x-axis
            y: item[metric] || 0,
            label: item.label,
            originalData: item,
          })),
        }));

        return { barData: barChartData, lineData: lineChartData };
      };

      const { barData, lineData: transformedLineData } = transformDataLocal(
        selectedBarMetrics,
        selectedLineMetrics
      );

      setChartData(barData);
      setLineData(transformedLineData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedBarMetrics, selectedLineMetrics]);

  if (isLoading) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Processing chart data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="mb-6 space-y-4">
        {/* Bar metrics selector */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="text-lg font-medium text-blue-800 mb-3">
            Bar Chart Metrics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data5["Y-Axis"].map((metric) => (
              <label
                key={metric}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedBarMetrics.includes(metric)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Remove from line metrics if it's there
                      setSelectedLineMetrics(
                        selectedLineMetrics.filter((m) => m !== metric)
                      );
                      setSelectedBarMetrics([...selectedBarMetrics, metric]);
                    } else {
                      // Prevent unchecking if it's the last selected metric
                      if (selectedBarMetrics.length > 1) {
                        setSelectedBarMetrics(
                          selectedBarMetrics.filter((m) => m !== metric)
                        );
                      }
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {metric
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Line metrics selector */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 className="text-lg font-medium text-red-800 mb-3">
            Line Chart Metrics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data5["Y-Axis"].map((metric) => (
              <label
                key={metric}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedLineMetrics.includes(metric)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Remove from bar metrics if it's there
                      setSelectedBarMetrics(
                        selectedBarMetrics.filter((m) => m !== metric)
                      );
                      setSelectedLineMetrics([...selectedLineMetrics, metric]);
                    } else {
                      // Prevent unchecking if it's the last selected metric
                      if (selectedLineMetrics.length > 1) {
                        setSelectedLineMetrics(
                          selectedLineMetrics.filter((m) => m !== metric)
                        );
                      }
                    }
                  }}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">
                  {metric
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>


      </div>

      {chartData.length > 0 ? (
        <div className="space-y-6">
          {/* Combined Multi-Axis Chart */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
              Multi-Axis Chart: Dynamic Metric Visualization
            </h3>
            <div
              style={{
                height: "500px",
                position: "relative",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              {/* Bar Chart Layer */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1,
                }}
              >
                <ResponsiveBar
                  data={chartData}
                  keys={selectedBarMetrics}
                  indexBy="id"
                  margin={{ top: 20, right: 130, bottom: 80, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: "linear" }}
                  indexScale={{ type: "band", round: true }}
                  colors={["#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"]} // Blue gradient for light theme
                  borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  theme={{
                    background: "transparent",
                    textColor: "#374151",
                    fontSize: 11,
                    axis: {
                      domain: {
                        line: {
                          stroke: "#9ca3af",
                          strokeWidth: 1,
                        },
                      },
                      legend: {
                        text: {
                          fontSize: 12,
                          fill: "#374151",
                        },
                      },
                      ticks: {
                        line: {
                          stroke: "#9ca3af",
                          strokeWidth: 1,
                        },
                        text: {
                          fontSize: 11,
                          fill: "#6b7280",
                        },
                      },
                    },
                    grid: {
                      line: {
                        stroke: "#e5e7eb",
                        strokeWidth: 1,
                      },
                    },
                  }}
                  axisTop={null}
                  axisRight={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: selectedBarMetrics
                      .map((m) =>
                        m
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())
                      )
                      .join(" & "),
                    legendPosition: "middle",
                    legendOffset: 40,
                  }}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: "Customer - Supplier",
                    legendPosition: "middle",
                    legendOffset: 60,
                    format: (value) =>
                      value.length > 15 ? `${value.slice(0, 15)}...` : value,
                  }}
                  axisLeft={null}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                  }}
                  animate={true}
                  motionConfig="wobbly"
                  enableGridX={false}
                  enableGridY={false}
                  tooltip={({ data, value, color }) => (
                    <div
                      style={{
                        background: "white",
                        padding: "12px 16px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        maxWidth: "300px",
                      }}
                    >
                      <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                        {data.label}
                      </div>
                      <div style={{ color, fontWeight: "bold" }}>
                        Bar Value: {value}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginTop: "4px",
                        }}
                      >
                        <div>
                          Total Submissions: {data.total_submissions || 0}
                        </div>
                        <div>
                          Submission Success:{" "}
                          {data["sum(submission_success)"] || 0}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>

              {/* Line Chart Layer */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                <ResponsiveLine
                  data={lineData}
                  margin={{ top: 20, right: 130, bottom: 80, left: 60 }}
                  xScale={{ type: "linear" }}
                  yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: false,
                    reverse: false,
                  }}
                  theme={{
                    background: "transparent",
                    textColor: "#374151",
                    fontSize: 11,
                    axis: {
                      domain: {
                        line: {
                          stroke: "#9ca3af",
                          strokeWidth: 1,
                        },
                      },
                      legend: {
                        text: {
                          fontSize: 12,
                          fill: "#374151",
                        },
                      },
                      ticks: {
                        line: {
                          stroke: "#9ca3af",
                          strokeWidth: 1,
                        },
                        text: {
                          fontSize: 11,
                          fill: "#6b7280",
                        },
                      },
                    },
                    grid: {
                      line: {
                        stroke: "#e5e7eb",
                        strokeWidth: 1,
                      },
                    },
                  }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={null}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: selectedLineMetrics
                      .map((m) =>
                        m
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())
                      )
                      .join(" & "),
                    legendPosition: "middle",
                    legendOffset: -40,
                  }}
                  pointSize={10}
                  pointColor={{ from: "color" }}
                  pointBorderWidth={3}
                  pointBorderColor={{ from: "serieColor" }}
                  pointLabelYOffset={-12}
                  useMesh={false}
                  colors={["#ef4444", "#f87171", "#fca5a5", "#fecaca"]} // Red gradient for light theme
                  animate={true}
                  motionConfig="wobbly"
                  enableGridX={false}
                  enableGridY={true}
                  gridYValues={5}
                  lineWidth={3}
                  enablePoints={true}
                  enablePointLabel={false}
                  enableArea={false}
                  areaOpacity={0.1}
                  curve="monotoneX"
                />
              </div>

              {/* Custom Legend */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "rgba(255, 255, 255, 0.95)",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  zIndex: 3,
                  minWidth: "200px",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "8px",
                    fontSize: "14px",
                    color: "#374151",
                  }}
                >
                  Chart Legend
                </div>

                {/* Bar Metrics */}
                {selectedBarMetrics.length > 0 && (
                  <div style={{ marginBottom: "8px" }}>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#3b82f6",
                        marginBottom: "4px",
                      }}
                    >
                      Bar Charts:
                    </div>
                    {selectedBarMetrics.map((metric, index) => (
                      <div
                        key={metric}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "2px",
                        }}
                      >
                        <div
                          style={{
                            width: "16px",
                            height: "12px",
                            backgroundColor:
                              ["#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"][
                                index
                              ] || "#3b82f6",
                            marginRight: "6px",
                            borderRadius: "2px",
                          }}
                        ></div>
                        <span style={{ fontSize: "11px", color: "#6b7280" }}>
                          {metric
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Line Metrics */}
                {selectedLineMetrics.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#ef4444",
                        marginBottom: "4px",
                      }}
                    >
                      Line Charts:
                    </div>
                    {selectedLineMetrics.map((metric, index) => (
                      <div
                        key={metric}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "2px",
                        }}
                      >
                        <div
                          style={{
                            width: "16px",
                            height: "3px",
                            backgroundColor:
                              ["#ef4444", "#f87171", "#fca5a5", "#fecaca"][
                                index
                              ] || "#ef4444",
                            marginRight: "6px",
                            borderRadius: "2px",
                          }}
                        ></div>
                        <span style={{ fontSize: "11px", color: "#6b7280" }}>
                          {metric
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
};

export default MultiAxisChart;
