import React, { useState } from "react";
import { ResponsiveRadar } from "@nivo/radar";

const SubmissionRadarChart = ({ data }) => {
  const [date, setDate] = useState("");
  const [entityType, setEntityType] = useState("supplier");

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
    if (!data || !Array.isArray(data) || !date) return { radarData: [], keys: [] };

    // Get all unique entities
    const entities = new Set();
    data.forEach(item => {
      entities.add(item[entityType]);
    });
    const entityList = Array.from(entities).sort();

    // Define metrics to display on the radar
    const metrics = [
      { key: "totalSubmission", label: "Total Submissions" },
      { key: "submissionSuccess", label: "Successful Submissions" },
      { key: "successRate", label: "Success Rate (%)" }
    ];

    // Create radar data structure
    const radarData = metrics.map(metric => {
      const metricData = {
        metric: metric.label
      };

      // Calculate values for each entity
      entityList.forEach(entity => {
        // Find all entries for this entity
        const entityEntries = data.filter(item => item[entityType] === entity);
        
        // Calculate total for this metric and date
        let total = 0;
        let count = 0;
        
        entityEntries.forEach(entry => {
          const dateValue = entry.values && Array.isArray(entry.values)
            ? entry.values.find(v => v.date === date)
            : null;
          
          if (dateValue) {
            if (metric.key === "successRate") {
              // Calculate success rate
              const rate = dateValue.totalSubmission > 0 
                ? (dateValue.submissionSuccess / dateValue.totalSubmission) * 100 
                : 0;
              total += rate;
            } else {
              // Sum up other metrics
              total += dateValue[metric.key] || 0;
            }
            count++;
          }
        });
        
        // Store average value
        metricData[entity] = count > 0 ? total / count : 0;
      });

      return metricData;
    });

    return { radarData, keys: entityList };
  };

  const { radarData, keys } = processData();

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
          <label htmlFor="entityType" style={{ marginRight: '10px' }}>Compare:</label>
          <select 
            id="entityType" 
            value={entityType} 
            onChange={(e) => setEntityType(e.target.value)}
            style={{ padding: '5px 10px' }}
          >
            <option value="supplier">Suppliers</option>
            <option value="customer">Customers</option>
            <option value="destination">Destinations</option>
          </select>
        </div>
      </div>
      
      <div style={{ height: '500px' }}>
        <ResponsiveRadar
          data={radarData}
          keys={keys}
          indexBy="metric"
          maxValue="auto"
          margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
          curve="linearClosed"
          borderWidth={2}
          borderColor={{ from: 'color' }}
          gridLabelOffset={36}
          dotSize={10}
          dotColor={{ theme: 'background' }}
          dotBorderWidth={2}
          dotBorderColor={{ from: 'color' }}
          enableDotLabel={true}
          dotLabel="value"
          dotLabelYOffset={-12}
          colors={{ scheme: 'nivo' }}
          fillOpacity={0.25}
          blendMode="multiply"
          animate={true}
          motionConfig="wobbly"
          isInteractive={true}
          legends={[
            {
              anchor: 'top-left',
              direction: 'column',
              translateX: -50,
              translateY: -40,
              itemWidth: 80,
              itemHeight: 20,
              itemTextColor: '#999',
              symbolSize: 12,
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
          tooltip={({ id, value, color, indexValue }) => (
            <div
              style={{
                padding: '9px 12px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '3px'
              }}
            >
              <div><strong>{entityType.charAt(0).toUpperCase() + entityType.slice(1)}:</strong> {id}</div>
              <div><strong>Metric:</strong> {indexValue}</div>
              <div style={{ color }}>
                <strong>Value:</strong> {indexValue === "Success Rate (%)" ? `${value.toFixed(2)}%` : value.toFixed(2)}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default SubmissionRadarChart;
