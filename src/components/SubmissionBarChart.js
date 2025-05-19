import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { scaleTime } from "d3-scale";

const SubmissionBarChart = ({ data }) => {
  console.log("data", data);
  // State for zoom
  const [zoomDomain, setZoomDomain] = useState(null);
  const [visibleDataRange, setVisibleDataRange] = useState({
    start: 0,
    end: 50,
  });

  // Process data for the bar chart - flatten the data structure to show each date
  const processedData = data.flatMap((item) => {
    return item.values.map((value) => {
      const key = `${item.customer}-${item.supplier}-${item.destination}-${value.date}`;

      return {
        id: key,
        customer: item.customer,
        supplier: item.supplier,
        destination: item.destination,
        date: value.date,
        totalSubmission: value.totalSubmission,
        submissionSuccess: value.submissionSuccess,
      };
    });
  });

  // Get visible data based on current range
  const visibleData = processedData.slice(
    visibleDataRange.start,
    visibleDataRange.end
  );

  // Handle zoom in
  const zoomIn = () => {
    const currentSize = visibleDataRange.end - visibleDataRange.start;
    const newSize = Math.max(Math.floor(currentSize / 2), 20); // Don't zoom in to fewer than 20 items
    const center = Math.floor(
      (visibleDataRange.start + visibleDataRange.end) / 2
    );

    setVisibleDataRange({
      start: Math.max(0, center - Math.floor(newSize / 2)),
      end: Math.min(processedData.length, center + Math.ceil(newSize / 2)),
    });
  };

  // Handle zoom out
  const zoomOut = () => {
    const currentSize = visibleDataRange.end - visibleDataRange.start;
    const newSize = Math.min(currentSize * 2, processedData.length);
    const center = Math.floor(
      (visibleDataRange.start + visibleDataRange.end) / 2
    );

    setVisibleDataRange({
      start: Math.max(0, center - Math.floor(newSize / 2)),
      end: Math.min(processedData.length, center + Math.ceil(newSize / 2)),
    });
  };

  // Handle pan left
  const panLeft = () => {
    const currentSize = visibleDataRange.end - visibleDataRange.start;
    const panAmount = Math.max(Math.floor(currentSize / 4), 10);

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
    const panAmount = Math.max(Math.floor(currentSize / 4), 10);

    if (visibleDataRange.end < processedData.length) {
      setVisibleDataRange({
        start: Math.min(
          processedData.length - currentSize,
          visibleDataRange.start + panAmount
        ),
        end: Math.min(processedData.length, visibleDataRange.end + panAmount),
      });
    }
  };

  // Reset zoom
  const resetZoom = () => {
    setZoomDomain(null);
    setVisibleDataRange({ start: 0, end: Math.min(100, processedData.length) });
  };

  return (
    <div>
      <div style={{ height: "500px" }}>
        <ResponsiveBar
          data={visibleData}
          keys={["totalSubmission", "submissionSuccess"]}
          indexBy="id"
          margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
          padding={0.3}
          groupMode="grouped"
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "nivo" }}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: "Customer-Supplier-Destination-Date",
            legendPosition: "middle",
            legendOffset: 80,
            format: (value) => {
              if (value.length > 15) {
                return value.substring(0, 15) + "...";
              }
              return value;
            },
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Submissions",
            legendPosition: "middle",
            legendOffset: -50,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          tooltip={({ id, value, color, data }) => (
            <div
              style={{
                padding: "9px 12px",
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "3px",
              }}
            >
              <div>
                <strong>
                  {data.customer} - {data.supplier} - {data.destination}
                </strong>
              </div>
              <div>
                <strong>Date:</strong> {data.date}
              </div>
              <div style={{ color }}>
                <strong>{id}:</strong> {value}
              </div>
            </div>
          )}
          legends={[
            {
              dataFrom: "keys",
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
            },
          ]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
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
            visibleDataRange.end - visibleDataRange.start >=
            processedData.length
          }
          style={{ margin: "0 5px", padding: "5px 10px" }}
        >
          Zoom Out (-)
        </button>
        <button
          onClick={panRight}
          disabled={visibleDataRange.end >= processedData.length}
          style={{ margin: "0 5px", padding: "5px 10px" }}
        >
          Pan Right →
        </button>
      </div>

      {/* Data summary */}
      <div style={{ textAlign: "center", margin: "10px 0" }}>
        <p>
          Viewing records {visibleDataRange.start + 1} to {visibleDataRange.end}{" "}
          of {processedData.length} total records (
          {Math.round(
            ((visibleDataRange.end - visibleDataRange.start) /
              processedData.length) *
              100
          )}
          % of data visible)
        </p>
      </div>
    </div>
  );
};

export default SubmissionBarChart;
