import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";

const LineGraph = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);

  useEffect(() => {
    // Process data for line chart format
    const timer = setTimeout(() => {
      if (data && data.length > 0) {
        // Transform data to the format expected by ResponsiveLine
        const lineData = data.map((series) => ({
          id: series.id,
          data: series.data.map((point) => ({
            x: point.x,
            y: point.y,
          })),
        }));

        setChartData(lineData);
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [data]);

  // Handle series click
  const handleSeriesClick = (seriesId) => {
    setSelectedSeries(selectedSeries === seriesId ? null : seriesId);
  };

  // Filter data based on selected series
  const getFilteredData = () => {
    let filteredData = chartData;

    // Filter by series if selected
    if (selectedSeries) {
      filteredData = filteredData.filter(
        (series) => series.id === selectedSeries
      );
    }

    return filteredData;
  };

  if (isLoading) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Processing chart data...</p>
        </div>
      </div>
    );
  }

  // Extract all unique series IDs
  const seriesIds = chartData.map((series) => series.id);

  console.log("chartData", chartData);

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      {/* Series selector */}
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        {seriesIds.map((id) => (
          <button
            key={id}
            onClick={() => handleSeriesClick(id)}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedSeries === id
                ? "bg-green-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {id}
          </button>
        ))}
        {selectedSeries && (
          <button
            onClick={() => setSelectedSeries(null)}
            className="px-3 py-1 rounded-md text-sm bg-red-500 text-white"
          >
            Show All Series
          </button>
        )}
      </div>

      {chartData.length > 0 ? (
        <div style={{ height: "400px" }}>
          <ResponsiveLine
            data={getFilteredData()}
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: "Date",
              legendOffset: 40,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Count",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            colors={{ scheme: "category10" }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
                onClick: (data) => handleSeriesClick(data.id),
              },
            ]}
            animate={true}
            enableSlices="x"
            sliceTooltip={({ slice }) => {
              return (
                <div
                  style={{
                    background: "white",
                    padding: "9px 12px",
                    border: "1px solid #ccc",
                  }}
                >
                  <div style={{ marginBottom: "5px" }}>
                    {slice.points[0].data.x}
                  </div>
                  {slice.points.map((point) => (
                    <div
                      key={point.id}
                      style={{
                        color: point.serieColor,
                        padding: "3px 0",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          background: point.serieColor,
                          marginRight: "8px",
                        }}
                      ></div>
                      <span>
                        {point.serieId}: {point.data.y}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
};

export default LineGraph;
