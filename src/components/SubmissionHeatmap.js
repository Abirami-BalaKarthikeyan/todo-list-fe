import React, { useState } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";

const SubmissionHeatmap = ({ data }) => {
  const [metric, setMetric] = useState("successRate");
  const [xAxis, setXAxis] = useState("date");
  const [yAxis, setYAxis] = useState("destination");

  const processData = () => {
    if (!data || !Array.isArray(data)) return { data: [], xKeys: [], yKeys: [] };

    // Get all unique values for x and y axes
    const xValues = new Set();
    const yValues = new Set();

    // First pass: collect all unique values
    data.forEach(item => {
      if (xAxis === "date") {
        if (item.values && Array.isArray(item.values)) {
          item.values.forEach(v => v.date && xValues.add(v.date));
        }
      } else {
        xValues.add(item[xAxis]);
      }

      yValues.add(item[yAxis]);
    });

    // Sort the values
    const sortedXValues = Array.from(xValues).sort();
    const sortedYValues = Array.from(yValues).sort();

    // Create a map to store the data
    const dataMap = new Map();

    // Initialize the map with empty values
    sortedYValues.forEach(y => {
      dataMap.set(y, {
        [yAxis]: y
      });

      sortedXValues.forEach(x => {
        dataMap.get(y)[x] = 0;
      });
    });

    // Fill in the data
    data.forEach(item => {
      const yKey = item[yAxis];

      if (xAxis === "date") {
        if (item.values && Array.isArray(item.values)) {
          item.values.forEach(v => {
            if (!v.date) return;

            let value;
            if (metric === "successRate") {
              value = v.totalSubmission > 0 ? (v.submissionSuccess / v.totalSubmission) * 100 : 0;
            } else {
              value = v[metric] || 0;
            }

            // Add to the existing value (we'll average later)
            dataMap.get(yKey)[v.date] = (dataMap.get(yKey)[v.date] || 0) + value;
          });
        }
      } else {
        const xKey = item[xAxis];

        // Calculate the average value across all dates
        let totalValue = 0;
        let count = 0;

        if (item.values && Array.isArray(item.values)) {
          item.values.forEach(v => {
            let value;
            if (metric === "successRate") {
              value = v.totalSubmission > 0 ? (v.submissionSuccess / v.totalSubmission) * 100 : 0;
            } else {
              value = v[metric] || 0;
            }

            totalValue += value;
            count++;
          });
        }

        const avgValue = count > 0 ? totalValue / count : 0;
        dataMap.get(yKey)[xKey] = avgValue;
      }
    });

    return {
      data: Array.from(dataMap.values()),
      xKeys: sortedXValues,
      yKeys: sortedYValues
    };
  };

  const { data: heatmapData, xKeys, yKeys } = processData();

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <div>
          <label htmlFor="metric" style={{ marginRight: '10px' }}>Metric:</label>
          <select
            id="metric"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            style={{ padding: '5px 10px' }}
          >
            <option value="successRate">Success Rate (%)</option>
            <option value="totalSubmission">Total Submissions</option>
            <option value="submissionSuccess">Successful Submissions</option>
          </select>
        </div>
        <div>
          <label htmlFor="xAxis" style={{ marginRight: '10px' }}>X Axis:</label>
          <select
            id="xAxis"
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            style={{ padding: '5px 10px' }}
          >
            <option value="date">Date</option>
            <option value="supplier">Supplier</option>
            <option value="customer">Customer</option>
          </select>
        </div>
        <div>
          <label htmlFor="yAxis" style={{ marginRight: '10px' }}>Y Axis:</label>
          <select
            id="yAxis"
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
            style={{ padding: '5px 10px' }}
          >
            <option value="destination">Destination</option>
            <option value="supplier">Supplier</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>

      <div style={{ height: '500px' }}>
        <ResponsiveHeatMap
          data={heatmapData}
          keys={xKeys}
          indexBy={yAxis}
          margin={{ top: 60, right: 80, bottom: 60, left: 80 }}
          forceSquare={false}
          axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: xAxis === 'date' ? 'Date' : xAxis.charAt(0).toUpperCase() + xAxis.slice(1),
            legendOffset: 36
          }}
          axisRight={null}
          axisBottom={null}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: yAxis.charAt(0).toUpperCase() + yAxis.slice(1),
            legendPosition: 'middle',
            legendOffset: -60
          }}
          cellOpacity={1}
          cellBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
          defs={[
            {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: 'rgba(0, 0, 0, 0.1)',
              rotation: -45,
              lineWidth: 4,
              spacing: 10
            }
          ]}
          fill={[{ id: 'lines' }]}
          animate={true}
          motionStiffness={80}
          motionDamping={9}
          hoverTarget="cell"
          cellHoverOthersOpacity={0.25}
          colors={{
            type: 'sequential',
            scheme: metric === 'successRate' ? 'blues' : 'oranges',
            minValue: 0,
            maxValue: metric === 'successRate' ? 100 : 'auto'
          }}
          tooltip={({ xKey, yKey, value, color }) => (
            <div
              style={{
                padding: '9px 12px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '3px'
              }}
            >
              <div><strong>{xAxis === 'date' ? 'Date' : xAxis.charAt(0).toUpperCase() + xAxis.slice(1)}:</strong> {xKey}</div>
              <div><strong>{yAxis.charAt(0).toUpperCase() + yAxis.slice(1)}:</strong> {yKey}</div>
              <div style={{ color }}>
                <strong>
                  {metric === 'successRate' ? 'Success Rate' :
                   metric === 'totalSubmission' ? 'Total Submissions' : 'Successful Submissions'}:
                </strong> {metric === 'successRate' ? `${value.toFixed(2)}%` : value}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default SubmissionHeatmap;