import React, { useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const SubmissionStackedBarChart = ({ data }) => {
  const [groupBy, setGroupBy] = useState("supplier");
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

    // Group data by selected dimension
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
            [groupBy]: groupKey,
            totalSubmission: 0,
            submissionSuccess: 0
          });
        }
        
        const group = groupedData.get(groupKey);
        group.totalSubmission += dateValue.totalSubmission || 0;
        group.submissionSuccess += dateValue.submissionSuccess || 0;
      }
    });

    return Array.from(groupedData.values());
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
        <ResponsiveBar
          data={barData}
          keys={['totalSubmission', 'submissionSuccess']}
          indexBy={groupBy}
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
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
                id: 'submissionSuccess'
              },
              id: 'dots'
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
            legend: 'Submissions',
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
        />
      </div>
    </div>
  );
};

export default SubmissionStackedBarChart;