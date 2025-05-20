import React, { useState } from "react";
import { ResponsiveLine } from "@nivo/line";

const SubmissionAreaChart = ({ data }) => {
  const [metric, setMetric] = useState("totalSubmission");
  const [groupBy, setGroupBy] = useState("supplier");
  const [cumulative, setCumulative] = useState(true);

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

    // Group data by the selected grouping field
    const groupedData = new Map();
    
    data.forEach(item => {
      const groupKey = item[groupBy];
      if (!groupKey) return;
      
      if (!groupedData.has(groupKey)) {
        groupedData.set(groupKey, {
          id: groupKey,
          data: []
        });
      }
      
      // Create a map of date to metrics for this item
      const dateMetricsMap = new Map();
      if (item.values && Array.isArray(item.values)) {
        item.values.forEach(value => {
          if (!value.date) return;
          
          const metricValue = value[metric] || 0;
          dateMetricsMap.set(value.date, (dateMetricsMap.get(value.date) || 0) + metricValue);
        });
      }
      
      // For each date, add data point to the group
      sortedDates.forEach(date => {
        if (dateMetricsMap.has(date)) {
          groupedData.get(groupKey).data.push({
            x: date,
            y: dateMetricsMap.get(date)
          });
        }
      });
    });
    
    // If cumulative, transform the data
    if (cumulative) {
      groupedData.forEach(series => {
        let runningTotal = 0;
        series.data = series.data.map(point => {
          runningTotal += point.y;
          return {
            x: point.x,
            y: runningTotal
          };
        });
      });
    }
    
    return Array.from(groupedData.values());
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
        <div>
          <label htmlFor="cumulative" style={{ marginRight: '10px' }}>Cumulative:</label>
          <input
            id="cumulative"
            type="checkbox"
            checked={cumulative}
            onChange={(e) => setCumulative(e.target.checked)}
            style={{ transform: 'scale(1.5)' }}
          />
        </div>
      </div>
      
      <div style={{ height: '500px' }}>
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
            legend: cumulative ? `Cumulative ${metric === 'totalSubmission' ? 'Total Submissions' : 'Successful Submissions'}` : 
                    metric === 'totalSubmission' ? 'Total Submissions' : 'Successful Submissions',
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          colors={{ scheme: 'category10' }}
          enableArea={true}
          areaOpacity={0.15}
          enablePoints={false}
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
          tooltip={({ point }) => (
            <div
              style={{
                padding: '9px 12px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '3px'
              }}
            >
              <div><strong>{groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}:</strong> {point.serieId}</div>
              <div><strong>Date:</strong> {point.data.x}</div>
              <div style={{ color: point.serieColor }}>
                <strong>{cumulative ? 'Cumulative ' : ''}{metric === 'totalSubmission' ? 'Total Submissions' : 'Successful Submissions'}:</strong> {point.data.y}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default SubmissionAreaChart;
