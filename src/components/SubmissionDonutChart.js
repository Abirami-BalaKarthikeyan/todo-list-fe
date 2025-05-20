import React, { useState } from "react";
import { ResponsivePie } from "@nivo/pie";

const SubmissionDonutChart = ({ data }) => {
  const [metric, setMetric] = useState("totalSubmission");
  const [groupBy, setGroupBy] = useState("destination");
  const [date, setDate] = useState("");

  // Get all unique dates for the dropdown
  const getUniqueDates = () => {
    const dates = new Set();
    data.forEach(item => {
      if (item.values && Array.isArray(item.values)) {
        item.values.forEach(v => v.date && dates.add(v.date));
      }
    });
    return Array.from(dates).sort();
  };

  const uniqueDates = getUniqueDates();
  
  // Set default date if not already set
  React.useEffect(() => {
    if (!date && uniqueDates.length > 0) {
      setDate(uniqueDates[0]);
    }
  }, [date, uniqueDates]);

  const processData = () => {
    if (!data || !Array.isArray(data) || !date) return [];

    // Group data by the selected dimension
    const groupedData = new Map();
    
    data.forEach(item => {
      const groupKey = item[groupBy];
      if (!groupKey) return;
      
      // Find the value for the selected date
      const dateValue = item.values && Array.isArray(item.values) 
        ? item.values.find(v => v.date === date) 
        : null;
      
      if (dateValue) {
        if (!groupedData.has(groupKey)) {
          groupedData.set(groupKey, {
            id: groupKey,
            label: groupKey,
            value: 0
          });
        }
        
        groupedData.get(groupKey).value += dateValue[metric] || 0;
      }
    });
    
    return Array.from(groupedData.values());
  };

  const pieData = processData();
  
  // Calculate total for percentage display
  const total = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <div>
          <label htmlFor="date" style={{ marginRight: '10px' }}>Date:</label>
          <select 
            id="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: '5px 10px' }}
          >
            {uniqueDates.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
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
            <option value="destination">Destination</option>
            <option value="supplier">Supplier</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>
      
      <div style={{ height: '500px' }}>
        <ResponsivePie
          data={pieData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          colors={{ scheme: 'nivo' }}
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.3)',
              size: 4,
              padding: 1,
              stagger: true
            },
            {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.3)',
              rotation: -45,
              lineWidth: 6,
              spacing: 10
            }
          ]}
          fill={[
            { match: { id: 'dest1' }, id: 'dots' },
            { match: { id: 'dest3' }, id: 'lines' }
          ]}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000'
                  }
                }
              ]
            }
          ]}
          tooltip={({ datum }) => (
            <div
              style={{
                padding: '9px 12px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '3px'
              }}
            >
              <div><strong>{groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}:</strong> {datum.id}</div>
              <div style={{ color: datum.color }}>
                <strong>{metric === 'totalSubmission' ? 'Total Submissions' : 'Successful Submissions'}:</strong> {datum.value}
              </div>
              <div>
                <strong>Percentage:</strong> {((datum.value / total) * 100).toFixed(2)}%
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default SubmissionDonutChart;
