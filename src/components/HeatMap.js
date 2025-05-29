import React, { useState } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import data from "../utils/data5.json";

const DynamicHeatmap = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const inputData = data;

  // Calculate total pages
  const totalItems = inputData.data.x_axis.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return {
      x_axis: inputData.data.x_axis.slice(startIndex, endIndex),
      y_axis: inputData.data.y_axis.slice(startIndex, endIndex),
    };
  };

  const currentPageData = getCurrentPageData();

  // Transform data for Nivo heatmap
  const transformDataForHeatmap = () => {
    const xAxisLabels = currentPageData.x_axis;
    const yAxisData = currentPageData.y_axis;
    const yAxisMetrics = inputData["Y-Axis"];

    return xAxisLabels.map((xItem, index) => {
      const xLabel = Object.values(xItem)[0];
      const shortLabel = extractShortLabel(xLabel);

      return {
        id: shortLabel,
        data: yAxisMetrics.map((metric) => {
          return {
            x: metric,
            y: yAxisData[index] ? yAxisData[index][metric] || 0 : 0,
          };
        }),
      };
    });
  };

  // Helper function to extract a meaningful short label from the full string
  const extractShortLabel = (fullLabel) => {
    if (!fullLabel) return "Unknown";

    const parts = fullLabel.split("-");
    if (parts.length >= 2) {
      const customer = parts[1];
      const supplier = parts.length > 3 ? parts[3] : "";
      return `${customer}${
        supplier ? "-" + supplier.substring(0, 15) : ""
      }`.substring(0, 25);
    }

    return fullLabel.substring(0, 25);
  };

  const heatmapData = transformDataForHeatmap();

  // Calculate max value for color scaling (from all data, not just current page)
  const allValues = inputData.data.y_axis.flatMap((item) =>
    inputData["Y-Axis"].map((metric) => item[metric] || 0)
  );
  const maxValue = Math.max(...allValues, 1);
  const minValue = Math.min(...allValues, 0);

  // Color Legend Component
  const ColorLegend = () => {
    const steps = 8;
    const stepSize = (maxValue - minValue) / (steps - 1);
    
    // Generate color scale values
    const legendItems = Array.from({ length: steps }, (_, i) => {
      const value = minValue + (stepSize * i);
      return {
        value: Math.round(value),
        intensity: i / (steps - 1)
      };
    });

    // Red color scale similar to Nivo's 'reds' scheme
    const getRedColor = (intensity) => {
      const baseRed = 255;
      const baseGreen = Math.round(245 - (intensity * 200)); // From light to dark
      const baseBlue = Math.round(238 - (intensity * 200));
      return `rgb(${baseRed}, ${baseGreen}, ${baseBlue})`;
    };

    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Color Scale</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 mr-2">Low</span>
          <div className="flex">
            {legendItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                style={{
                  width: '24px',
                  height: '20px',
                  backgroundColor: getRedColor(item.intensity),
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
              >
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">High</span>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-600">
          <span>{minValue}</span>
          <span>{maxValue}</span>
        </div>
      </div>
    );
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      {/* Header with pagination info */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Performance Heatmap
          </h2>
          <p className="text-gray-600">
            Showing routes {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
          </p>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                const isCurrentPage = page === currentPage;

                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        isCurrentPage
                          ? "bg-blue-500 text-white"
                          : "border border-gray-300 bg-white hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Color Legend */}
      <ColorLegend />

      <div
        className="bg-white rounded-lg shadow-lg p-4"
        style={{ height: "600px" }}
      >
        <ResponsiveHeatMap
          data={heatmapData}
          margin={{ top: 80, right: 120, bottom: 100, left: 180 }}
          valueFormat=">-.0f"
          axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: "Metrics",
            legendPosition: "middle",
            legendOffset: -60,
          }}
          axisRight={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Routes",
            legendPosition: "middle",
            legendOffset: 90,
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 45,
            legend: "Metrics",
            legendPosition: "middle",
            legendOffset: 80,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Routes",
            legendPosition: "middle",
            legendOffset: -140,
          }}
          colors={{
            type: "sequential",
            scheme: "reds",
            minValue: 0,
            maxValue: maxValue,
          }}
          emptyColor="#f1f5f9"
          enableLabels={true}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 3.8]],
          }}
          animate={true}
          motionConfig="gentle"
          hoverTarget="cell"
          cellHoverOthersOpacity={0.5}
          cellOpacity={1}
          cellBorderWidth={1}
          cellBorderColor={{
            from: "color",
            modifiers: [["darker", 0.4]],
          }}
          tooltip={({ cell }) => (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
              <div className="font-semibold text-gray-800">
                Route: {cell.serieId}
              </div>
              <div className="text-sm text-gray-600">Metric: {cell.data.x}</div>
              <div className="text-lg font-bold text-blue-600">
                Value: {cell.formattedValue}
              </div>
            </div>
          )}
        />
      </div>

      {/* Bottom pagination info */}
      {totalPages > 1 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Page {currentPage} of {totalPages} • {totalItems} total routes
        </div>
      )}
    </div>
  );
};

export default DynamicHeatmap;