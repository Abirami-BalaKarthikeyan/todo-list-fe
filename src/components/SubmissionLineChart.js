import React, { useState } from "react";
import { ResponsiveLine } from "@nivo/line";

const SubmissionLineChart = ({ data }) => {
  console.log("data", data);
  // State for zoom
  const [visibleDataRange, setVisibleDataRange] = useState({
    start: 0,
    end: 100,
  });

  // Process data for the line chart - need to transform to series format
  const processDataForLineChart = () => {
    // Create a map to organize data by customer-supplier-destination
    const seriesMap = new Map();

    data.forEach((item) => {
      const seriesKey = `${item.customer}-${item.supplier}-${item.destination}`;

      if (!seriesMap.has(seriesKey)) {
        seriesMap.set(seriesKey, {
          id: seriesKey,
          data: [],
        });
      }

      // Add data points for this series
      item.values.forEach((value) => {
        seriesMap.get(seriesKey).data.push({
          x: value.date,
          y: value.totalSubmission,
          submissionSuccess: value.submissionSuccess,
        });
      });
    });

    // Convert map to array and sort data points by date
    return Array.from(seriesMap.values()).map((series) => {
      series.data.sort((a, b) => new Date(a.x) - new Date(b.x));
      return series;
    });
  };

  const lineData = processDataForLineChart();

  // Get visible data based on current range
  const visibleData = lineData.slice(
    visibleDataRange.start,
    visibleDataRange.end
  );

  // Handle zoom in
  const zoomIn = () => {
    const currentSize = visibleDataRange.end - visibleDataRange.start;
    const newSize = Math.max(Math.floor(currentSize / 2), 10); // Don't zoom in to fewer than 10 series
    const center = Math.floor(
      (visibleDataRange.start + visibleDataRange.end) / 2
    );

    setVisibleDataRange({
      start: Math.max(0, center - Math.floor(newSize / 2)),
      end: Math.min(lineData.length, center + Math.ceil(newSize / 2)),
    });
  };

  // Handle zoom out
  const zoomOut = () => {
    const currentSize = visibleDataRange.end - visibleDataRange.start;
    const newSize = Math.min(currentSize * 2, lineData.length);
    const center = Math.floor(
      (visibleDataRange.start + visibleDataRange.end) / 2
    );

    setVisibleDataRange({
      start: Math.max(0, center - Math.floor(newSize / 2)),
      end: Math.min(lineData.length, center + Math.ceil(newSize / 2)),
    });
  };

  // Handle pan left
  const panLeft = () => {
    const currentSize = visibleDataRange.end - visibleDataRange.start;
    const panAmount = Math.max(Math.floor(currentSize / 4), 5);

    if (visibleDataRange.start > 0) {
      setVisibleDataRange({
        start: Math.max(0, visibleDataRange.start - panAmount),
        end: Math.max(currentSize, visibleDataRange.end - panAmount),
      });
    }
  };

  // Handle pan right
  const panRight = () => {
    const currentSize = visibleDataRange.end - visibleDataRange.start;
    const panAmount = Math.max(Math.floor(currentSize / 4), 5);

    if (visibleDataRange.end < lineData.length) {
      setVisibleDataRange({
        start: Math.min(
          lineData.length - currentSize,
          visibleDataRange.start + panAmount
        ),
        end: Math.min(lineData.length, visibleDataRange.end + panAmount),
      });
    }
  };

  // Reset zoom
  const resetZoom = () => {
    setVisibleDataRange({ start: 0, end: Math.min(100, lineData.length) });
  };

  return (
    <div>
      <div style={{ height: "500px" }}>
        <ResponsiveLine
          data={visibleData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
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
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Total Submissions",
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
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          tooltip={({ point }) => (
            <div
              style={{
                background: "white",
                padding: "9px 12px",
                border: "1px solid #ccc",
                borderRadius: "3px",
              }}
            >
              <div>
                <strong>{point.serieId}</strong>
              </div>
              <div>
                <strong>Date:</strong> {point.data.x}
              </div>
              <div>
                <strong>Total Submissions:</strong> {point.data.y}
              </div>
              <div>
                <strong>Successful Submissions:</strong>{" "}
                {point.data.submissionSuccess}
              </div>
            </div>
          )}
        />
      </div>

      {/* Zoom and navigation controls */}
      <div
        style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
      >
        <button
          onClick={panLeft}
          disabled={visibleDataRange.start <= 0}
          style={{ margin: "0 5px", padding: "5px 10px" }}
        >
          ← Pan Left
        </button>
        <button
          onClick={zoomIn}
          style={{ margin: "0 5px", padding: "5px 10px" }}
        >
          Zoom In (+)
        </button>
        <button
          onClick={resetZoom}
          style={{ margin: "0 5px", padding: "5px 10px" }}
        >
          Reset View
        </button>
        <button
          onClick={zoomOut}
          disabled={
            visibleDataRange.end - visibleDataRange.start >= lineData.length
          }
          style={{ margin: "0 5px", padding: "5px 10px" }}
        >
          Zoom Out (-)
        </button>
        <button
          onClick={panRight}
          disabled={visibleDataRange.end >= lineData.length}
          style={{ margin: "0 5px", padding: "5px 10px" }}
        >
          Pan Right →
        </button>
      </div>

      {/* Data summary */}
      <div style={{ textAlign: "center", margin: "10px 0" }}>
        <p>
          Viewing {visibleDataRange.end - visibleDataRange.start} of{" "}
          {lineData.length} total series (
          {Math.round(
            ((visibleDataRange.end - visibleDataRange.start) /
              lineData.length) *
              100
          )}
          % of data visible)
        </p>
      </div>
    </div>
  );
};

export default SubmissionLineChart;
