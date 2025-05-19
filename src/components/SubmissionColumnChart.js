import React, { useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const SubmissionColumnChart = ({ data }) => {
  const [metric, setMetric] = useState("totalSubmission");
  const [groupBy, setGroupBy] = useState("supplier");

  const processData = () => {
    if (!data || !Array.isArray(data)) return [];

    // Group data by the selected dimension
    const groupedData = new Map();
    
    data.forEach(item => {
      const groupKey = item[groupBy];
      if (!groupKey) return;
      
      if (!groupedData.has(groupKey)) {
        groupedData.set(groupKey, {
          [groupBy]: groupKey,
          [metric]: 0
        });
      }
      
      // Sum up all values for this group
      if (item.values && Array.isArray(item.values)) {
        item.values.forEach(value => {
          groupedData.get(groupKey)[metric] += value[metric] || 0;
        });
      }
    });
    
    return Array.from(groupedData.values());
  };

  const barData = processData();

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
      </div>
      
      <div style={{ height: '500px' }}>
        <ResponsiveBar
          data={barData}
          keys={[metric]}
          indexBy={groupBy}
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          layout="vertical"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: '#38bcb2',
              size: 4,
              padding: 1,
              stagger: true
            },
            {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: '#eed312',
              rotation: -45,
              lineWidth: 6,
              spacing: 10
            }
          ]}
          fill={[
            {
              match: {
                id: 'totalSubmission'
              },
              id: 'dots'
            },
            {
              match: {
                id: 'submissionSuccess'
              },
              id: 'lines'
            }
          ]}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: groupBy.charAt(0).toUpperCase() + groupBy.slice(1),
            legendPosition: 'middle',
            legendOffset: 32
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: metric === 'totalSubmission' ? 'Total Submissions' : 'Successful Submissions',
            legendPosition: 'middle',
            legendOffset: -40
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          tooltip={({ id, value, color, indexValue }) => (
            <div
              style={{
                padding: '9px 12px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '3px'
              }}
            >
              <div><strong>{groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}:</strong> {indexValue}</div>
              <div style={{ color }}>
                <strong>{id === 'totalSubmission' ? 'Total Submissions' : 'Successful Submissions'}:</strong> {value}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default SubmissionColumnChart;
