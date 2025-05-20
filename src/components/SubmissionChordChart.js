import React, { useState } from "react";
import { ResponsiveChord } from "@nivo/chord";

const SubmissionChordChart = ({ data }) => {
  // State for data type selection
  const [dataType, setDataType] = useState("totalSubmission");
  
  // Process data for the chord chart
  const processDataForChordChart = () => {
    // Validate data
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { matrix: [[0]], keys: ['No Data'] };
    }
    
    // Extract unique entities (customers, suppliers, destinations)
    const entities = new Set();
    const entityMap = new Map();
    
    // First pass: collect all unique entities
    data.forEach(item => {
      if (item.customer) entities.add(item.customer);
      if (item.supplier) entities.add(item.supplier);
      if (item.destination) entities.add(item.destination);
    });
    
    // Create ordered array of entities and map for lookup
    const entityArray = Array.from(entities);
    
    // If no entities found, return empty data
    if (entityArray.length === 0) {
      return { matrix: [[0]], keys: ['No Data'] };
    }
    
    entityArray.forEach((entity, index) => {
      entityMap.set(entity, index);
    });
    
    // Create matrix of relationships
    const matrix = Array(entityArray.length).fill().map(() => Array(entityArray.length).fill(0));
    
    // Fill matrix with relationship values
    data.forEach(item => {
      // Skip if any required field is missing
      if (!item.customer || !item.supplier || !item.destination || !item.values) return;
      
      const custIndex = entityMap.get(item.customer);
      const supIndex = entityMap.get(item.supplier);
      const destIndex = entityMap.get(item.destination);
      
      // Calculate total value for this combination
      let totalValue = 0;
      if (Array.isArray(item.values)) {
        item.values.forEach(value => {
          if (value && typeof value[dataType] === 'number') {
            totalValue += value[dataType];
          }
        });
      }
      
      // Add values to matrix (bidirectional)
      // Customer to Supplier
      matrix[custIndex][supIndex] += totalValue;
      matrix[supIndex][custIndex] += totalValue;
      
      // Supplier to Destination
      matrix[supIndex][destIndex] += totalValue;
      matrix[destIndex][supIndex] += totalValue;
      
      // Customer to Destination (weaker relationship)
      matrix[custIndex][destIndex] += totalValue / 2;
      matrix[destIndex][custIndex] += totalValue / 2;
    });
    
    return {
      matrix,
      keys: entityArray
    };
  };
  
  const { matrix, keys } = processDataForChordChart();
  
  // Handle data type change
  const handleDataTypeChange = (event) => {
    setDataType(event.target.value);
  };

  // Check if we have valid data to display
  const hasValidData = matrix && matrix.length > 0 && keys && keys.length > 0;
  
  if (!hasValidData) {
    return (
      <div style={{ height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>No valid data available for chord chart</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label htmlFor="chordDataType" style={{ marginRight: '10px' }}>Data type:</label>
        <select 
          id="chordDataType" 
          value={dataType} 
          onChange={handleDataTypeChange}
          style={{ padding: '5px 10px' }}
        >
          <option value="totalSubmission">Total Submissions</option>
          <option value="submissionSuccess">Successful Submissions</option>
        </select>
      </div>
      
      <div style={{ height: '600px' }}>
        <ResponsiveChord
          matrix={matrix}
          keys={keys}
          margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
          valueFormat=".2f"
          padAngle={0.02}
          innerRadiusRatio={0.96}
          innerRadiusOffset={0.02}
          arcOpacity={1}
          arcBorderWidth={1}
          arcBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
          ribbonOpacity={0.5}
          ribbonBorderWidth={1}
          ribbonBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
          enableLabel={true}
          label={d => d.id}
          labelOffset={12}
          labelRotation={-90}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
          colors={{ scheme: 'nivo' }}
          isInteractive={true}
          arcHoverOpacity={1}
          arcHoverOthersOpacity={0.25}
          ribbonHoverOpacity={0.75}
          ribbonHoverOthersOpacity={0.25}
          animate={true}
          motionConfig="gentle"
          legends={[
            {
              anchor: 'top',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: -30,
              itemWidth: 80,
              itemHeight: 14,
              itemsSpacing: 0,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
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
          tooltip={({ arc, ribbon }) => {
            if (arc) {
              return (
                <div style={{ 
                  background: 'white', 
                  padding: '9px 12px', 
                  border: '1px solid #ccc',
                  borderRadius: '4px' 
                }}>
                  <strong>{arc.id}</strong>
                  <div>Total flow: {arc.value}</div>
                </div>
              );
            }
            
            if (ribbon) {
              return (
                <div style={{ 
                  background: 'white', 
                  padding: '9px 12px', 
                  border: '1px solid #ccc',
                  borderRadius: '4px' 
                }}>
                  <div>
                    <strong>{ribbon.source.id}</strong> → <strong>{ribbon.target.id}</strong>
                  </div>
                  <div>
                    {dataType === 'totalSubmission' ? 'Submissions' : 'Successful Submissions'}: {ribbon.value}
                  </div>
                </div>
              );
            }
            
            return null;
          }}
        />
      </div>
      
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <p>
          Chord chart showing relationships between customers, suppliers, and destinations.
        </p>
        <p>
          Thicker ribbons indicate higher {dataType === 'totalSubmission' ? 'submission volumes' : 'successful submissions'} between entities.
        </p>
      </div>
    </div>
  );
};

export default SubmissionChordChart;
