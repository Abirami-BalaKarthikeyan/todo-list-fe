import React, { useState } from "react";
import { ResponsiveAreaBump } from "@nivo/bump";

const SubmissionAreaBump = ({ data }) => {
  // State for data type selection
  const [dataType, setDataType] = useState("totalSubmission");
  
  // State for visible data range
  const [visibleDataRange, setVisibleDataRange] = useState({
    start: 0,
    end: 10 // Initially show first 10 items
  });

  // Process data for the area bump chart
  const processDataForAreaBump = () => {
    // Create a map to organize data by customer-supplier-destination
    const seriesMap = new Map();
    
    // Get all unique dates
    const allDates = new Set();
    data.forEach(item => {
      item.values.forEach(value => {
        allDates.add(value.date);
      });
    });
    
    // Sort dates chronologically
    const sortedDates = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));
    
    // Create series for each customer-supplier-destination
    data.forEach(item => {
      const seriesKey = `${item.customer}-${item.supplier}-${item.destination}`;
      
      if (!seriesMap.has(seriesKey)) {
        seriesMap.set(seriesKey, {
          id: seriesKey,
          data: []
        });
      }
      
      // Create a map of date to value for this series
      const dateValueMap = new Map();
      item.values.forEach(value => {
        dateValueMap.set(value.date, value[dataType]);
      });
      
      // Add data points for all dates (using 0 for missing dates)
      sortedDates.forEach(date => {
        seriesMap.get(seriesKey).data.push({
          x: date,
          y: dateValueMap.has(date) ? dateValueMap.get(date) : 0
        });
      });
    });
    
    return Array.from(seriesMap.values());
  };
  
  const allAreaBumpData = processDataForAreaBump();
  
  // Get visible data based on current range
  const areaBumpData = allAreaBumpData.slice(
    visibleDataRange.start,
    visibleDataRange.end
  );
  
  // Handle data type change
  const handleDataTypeChange = (event) => {
    setDataType(event.target.value);
  };
  
  // Navigation functions
  const zoomIn = () => {
    const currentSize = visibleDataRange.end - visibleDataRange.start;
    const newSize = Math.max(Math.floor(currentSize / 2), 3);
    const center = Math.floor((visibleDataRange.start + visibleDataRange.end) / 2);
    
    setVisibleDataRange({
      start: Math.max(0, center - Math.floor(newSize / 2)),
      end: Math.min(allAreaBumpData.length, center + Math.ceil(newSize / 2))
    });
  };
  
  const zoomOut = () => {
    const currentSize = visibleDataRange.end - visibleDataRange.start;
    const newSize = Math.min(currentSize * 2, allAreaBumpData.length);
    const center = Math.floor((visibleDataRange.start + visibleDataRange.end) / 2);
    
    setVisibleDataRange({
      start: Math.max(0, center - Math.floor(newSize / 2)),
      end: Math.min(allAreaBumpData.length, center + Math.ceil(newSize / 2))
    });
  };
  
  const resetZoom = () => {
    setVisibleDataRange({
      start: 0,
      end: Math.min(10, allAreaBumpData.length)
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label htmlFor="dataType" style={{ marginRight: '10px' }}>Data type:</label>
        <select 
          id="dataType" 
          value={dataType} 
          onChange={handleDataTypeChange}
          style={{ padding: '5px 10px' }}
        >
          <option value="totalSubmission">Total Submissions</option>
          <option value="submissionSuccess">Successful Submissions</option>
        </select>
      </div>
      
      <div style={{ height: '500px' }}>
        <ResponsiveAreaBump
          data={areaBumpData}
          margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
          spacing={8}
          colors={{ scheme: 'nivo' }}
          blendMode="multiply"
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
          startLabel="id"
          endLabel="id"
          axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: -36
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 32
          }}
          tooltip={({ serie }) => (
            <div
              style={{
                padding: '12px 16px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              <div><strong>{serie.id}</strong></div>
              <div>
                <strong>Type:</strong> {dataType === 'totalSubmission' ? 'Total Submissions' : 'Successful Submissions'}
              </div>
            </div>
          )}
        />
      </div>
      
      {/* Zoom and navigation controls */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <button 
          onClick={zoomIn}
          style={{ margin: '0 5px', padding: '5px 10px' }}
          disabled={visibleDataRange.end - visibleDataRange.start <= 3}
        >
          Zoom In (+)
        </button>
        <button 
          onClick={resetZoom}
          style={{ margin: '0 5px', padding: '5px 10px' }}
        >
          Reset View
        </button>
        <button 
          onClick={zoomOut}
          style={{ margin: '0 5px', padding: '5px 10px' }}
          disabled={visibleDataRange.end - visibleDataRange.start >= allAreaBumpData.length}
        >
          Zoom Out (-)
        </button>
      </div>
      
      {/* Data summary */}
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <p>
          Viewing {visibleDataRange.end - visibleDataRange.start} of {allAreaBumpData.length} combinations 
          ({Math.round(((visibleDataRange.end - visibleDataRange.start) / allAreaBumpData.length) * 100)}% of data visible)
        </p>
        <p>
          Area bump chart showing {dataType === 'totalSubmission' ? 'total submissions' : 'successful submissions'} over time for each customer-supplier-destination combination.
        </p>
      </div>
    </div>
  );
};

export default SubmissionAreaBump;
