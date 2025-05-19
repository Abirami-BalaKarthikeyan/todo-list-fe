import React, { useState } from "react";
import { ResponsiveLine } from "@nivo/line";

const SubmissionMultiLineChart = ({ data }) => {
  const [metric, setMetric] = useState("successRate");
  const [groupBy, setGroupBy] = useState("supplier");

  const processData = () => {
    if (!data || !Array.isArray(data)) return [];

    // Get all unique dates
    const allDates = new Set();
    data.forEach(item => {
      if (item.values && Array.isArray(item.values)) {
        item.values.forEach(v => v.date && allDates.add(v.date));
      }
    });
    const sortedDates = Array.from(allDates).sort();

    // Group data by selected dimension
    const groups = new Map();
    data.forEach(item => {
      const groupKey = item[groupBy];
      if (!groupKey) return;

      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          id: groupKey,
          data: []
        });
      }

      // Create a map of date to metrics for this item
      const dateMetricsMap = new Map();
      if (item.values && Array.isArray(item.values)) {
        item.values.forEach(value => {
          if (!value.date) return;
          
          let metricValue;
          if (metric === "successRate") {
            metricValue = value.submissionSuccess / (value.totalSubmission || 1) * 100;
          } else if (metric === "totalSubmission") {
            metricValue = value.totalSubmission;
          } else if (metric === "submissionSuccess") {
            metricValue = value.submissionSuccess;
          }
          
          dateMetricsMap.set(value.date, (dateMetricsMap.get(value.date) || 0) + metricValue);
        });
      }

      // For each date, add data point to the group
      sortedDates.forEach(date => {
        if (dateMetricsMap.has(date)) {
          groups.get(groupKey).data.push({
            x: date,
            y: dateMetricsMap.get(date)
          });
        }
      });
    });

    return Array.from(groups.values());
  };

  const lineData = processData();

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
          <label htmlFor="groupBy" style={{ marginRight: '10px' }}>Group By:</label>
          <select 
            id="groupBy" 
            value={groupBy} 
            onChange={(e) => setGroupBy(e.target.value)}
            style={{ padding: '5px 10px' }}
          >
            <option value="supplier">Supplier</option>
            <option value="customer">Customer</option>
            <option value="destination">Destination</option>
          </select>
        </div>
      </div>
      
      <div style={{ height: '400px' }}>
        <ResponsiveLine
          data={lineData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ 
            type: 'linear', 
            min: 'auto', 
            max: 'auto', 
            stacked: false, 
            reverse: false 
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Date',
            legendOffset: 36,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: metric === 'successRate' ? 'Success Rate (%)' : 
                   metric === 'totalSubmission' ? 'Total Submissions' : 'Successful Submissions',
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          colors={{ scheme: 'category10' }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
      </div>
    </div>
  );
};

export default SubmissionMultiLineChart;