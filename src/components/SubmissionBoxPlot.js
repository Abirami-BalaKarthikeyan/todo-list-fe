import React, { useState } from 'react';
import { ResponsiveBoxPlot } from '@nivo/boxplot';

const SubmissionBoxPlot = ({ data }) => {
  // State for data type selection
  const [dataType, setDataType] = useState('totalSubmission');
  
  // State for zoom and pan
  const [visibleDataRange, setVisibleDataRange] = useState({
    start: 0,
    end: 10 // Initially show first 10 items
  });
  
  // Process data for the box plot without grouping
  const processDataForBoxPlot = () => {
    // Create a box plot entry for each customer-supplier-destination combination
    const boxPlotData = data.map(item => {
      const group = `${item.customer}-${item.supplier}-${item.destination}`;
      
      // Extract the selected data type values
      const values = item.values.map(v => v[dataType]);
      
      return {
        group,
        values,
        customer: item.customer,
        supplier: item.supplier,
        destination: item.destination
      };
    });
    
    return boxPlotData;
  };
  
  const allBoxPlotData = processDataForBoxPlot();
  
  // Get visible data based on current range
  const boxPlotData = allBoxPlotData.slice(
    visibleDataRange.start,
    visibleDataRange.end
  );
  
  // Handle data type change
  const handleDataTypeChange = (event) => {
    setDataType(event.target.value);
  };
  
  // Handle zoom in
  const zoomIn = () => {
    const currentSize = visibleDataRange.end - visibleDataRange.start;
    const newSize = Math.max(Math.floor(currentSize / 2), 3); // Don't zoom in to fewer than 3 items
    const center = Math.floor(
      (visibleDataRange.start + visibleDataRange.end) / 2
    );

    setVisibleDataRange({
      start: Math.max(0, center - Math.floor(newSize / 2)),
      end: Math.min(allBoxPlotData.length, center + Math.ceil(newSize / 2)),
    });
  };

  // Handle zoom out
  const zoomOut = () => {
    const currentSize = visibleDataRange.end - visibleDataRange.start;
    const newSize = Math.min(currentSize * 2, allBoxPlotData.length);
    const center = Math.floor(
      (visibleDataRange.start + visibleDataRange.end) / 2
    );

    setVisibleDataRange({
      start: Math.max(0, center - Math.floor(newSize / 2)),
      end: Math.min(allBoxPlotData.length, center + Math.ceil(newSize / 2)),
    });
  };

  // Handle pan left
  const panLeft = () => {
    const currentSize = visibleDataRange.end - visibleDataRange.start;
    const panAmount = Math.max(Math.floor(currentSize / 4), 1);

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
    const panAmount = Math.max(Math.floor(currentSize / 4), 1);

    if (visibleDataRange.end < allBoxPlotData.length) {
      setVisibleDataRange({
        start: Math.min(
          allBoxPlotData.length - currentSize,
          visibleDataRange.start + panAmount
        ),
        end: Math.min(allBoxPlotData.length, visibleDataRange.end + panAmount),
      });
    }
  };

  // Reset zoom
  const resetZoom = () => {
    setVisibleDataRange({ 
      start: 0, 
      end: Math.min(10, allBoxPlotData.length) 
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
        <ResponsiveBoxPlot
          data={boxPlotData}
          min={0}
          max="auto"
          margin={{ top: 40, right: 110, bottom: 80, left: 60 }}
          padding={0.3}
          enableGridX={true}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: "Customer-Supplier-Destination",
            legendPosition: 'middle',
            legendOffset: 60,
            format: (value) => {
              if (value.length > 15) {
                return value.substring(0, 15) + "...";
              }
              return value;
            }
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: dataType === 'totalSubmission' ? 'Total Submissions' : 'Successful Submissions',
            legendPosition: 'middle',
            legendOffset: -40
          }}
          colors={{ scheme: 'nivo' }}
          borderRadius={2}
          borderWidth={2}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.3]]
          }}
          medianWidth={2}
          medianColor={{
            from: 'color',
            modifiers: [['darker', 0.3]]
          }}
          whiskerWidth={2}
          whiskerColor={{
            from: 'color',
            modifiers: [['darker', 0.3]]
          }}
          tooltip={({ datum }) => {
            const item = boxPlotData.find(d => d.group === datum.group);
            return (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              >
                <div><strong>Customer:</strong> {item.customer}</div>
                <div><strong>Supplier:</strong> {item.supplier}</div>
                <div><strong>Destination:</strong> {item.destination}</div>
                <div><strong>Min:</strong> {datum.min}</div>
                <div><strong>Q1:</strong> {datum.quantiles[0]}</div>
                <div><strong>Median:</strong> {datum.median}</div>
                <div><strong>Q3:</strong> {datum.quantiles[2]}</div>
                <div><strong>Max:</strong> {datum.max}</div>
                <div><strong>Sample Size:</strong> {datum.values.length} data points</div>
              </div>
            );
          }}
          animate={true}
          motionConfig="gentle"
        />
      </div>
      
      {/* Zoom and navigation controls */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <button
          onClick={panLeft}
          disabled={visibleDataRange.start <= 0}
          style={{ margin: '0 5px', padding: '5px 10px' }}
        >
          ← Pan Left
        </button>
        <button
          onClick={zoomIn}
          style={{ margin: '0 5px', padding: '5px 10px' }}
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
          disabled={
            visibleDataRange.end - visibleDataRange.start >=
            allBoxPlotData.length
          }
          style={{ margin: '0 5px', padding: '5px 10px' }}
        >
          Zoom Out (-)
        </button>
        <button
          onClick={panRight}
          disabled={visibleDataRange.end >= allBoxPlotData.length}
          style={{ margin: '0 5px', padding: '5px 10px' }}
        >
          Pan Right →
        </button>
      </div>
      
      {/* Data summary */}
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <p>
          Viewing {visibleDataRange.end - visibleDataRange.start} of {allBoxPlotData.length} combinations 
          ({Math.round(((visibleDataRange.end - visibleDataRange.start) / allBoxPlotData.length) * 100)}% of data visible)
        </p>
        <p>
          Box plot showing distribution of {dataType === 'totalSubmission' ? 'total submissions' : 'successful submissions'} for each customer-supplier-destination combination.
          <br />
          Each box represents the data distribution over time for that specific combination.
        </p>
      </div>
    </div>
  );
};

export default SubmissionBoxPlot;

