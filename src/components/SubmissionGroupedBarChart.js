import React, { useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const SubmissionGroupedBarChart = ({ data }) => {
  const [metric, setMetric] = useState("totalSubmission");
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

    // Group data by customer and destination
    const groupedData = [];
    
    // Get all unique customers and destinations
    const customers = new Set();
    const destinations = new Set();
    
    data.forEach(item => {
      customers.add(item.customer);
      destinations.add(item.destination);
    });
    
    // For each customer-destination combination, calculate the metric
    Array.from(customers).forEach(customer => {
      Array.from(destinations).forEach(destination => {
        // Find all entries for this customer and destination
        const entries = data.filter(
          item => item.customer === customer && item.destination === destination
        );
        
        // Calculate the total for the selected metric and date
        let total = 0;
        entries.forEach(entry => {
          const dateValue = entry.values && Array.isArray(entry.values)
            ? entry.values.find(v => v.date === date)
            : null;
          
          if (dateValue) {
            total += dateValue[metric] || 0;
          }
        });
        
        // Add to the result
        groupedData.push({
          customer,
          destination,
          [metric]: total
        });
      });
    });

    return groupedData;
  };

  const barData = processData();

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
      </div>
      
      <div style={{ height: '500px' }}>
        <ResponsiveBar
          data={barData}
          keys={[metric]}
          indexBy="destination"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          groupMode="grouped"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Destination',
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
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          tooltip={({ id, value, color, indexValue, data }) => (
            <div
              style={{
                padding: '9px 12px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '3px'
              }}
            >
              <div><strong>Customer:</strong> {data.customer}</div>
              <div><strong>Destination:</strong> {indexValue}</div>
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

export default SubmissionGroupedBarChart;
