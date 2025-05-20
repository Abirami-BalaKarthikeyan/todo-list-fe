import React, { useState } from "react";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";

const SubmissionCirclePacking = ({ data }) => {
  // State for data type selection
  const [dataType, setDataType] = useState("totalSubmission");
  
  // Process data for the circle packing chart
  const processDataForCirclePacking = () => {
    // Create root node
    const root = {
      id: 'root',
      name: 'All Submissions',
      children: []
    };
    
    // Group by customer
    const customerMap = new Map();
    
    data.forEach(item => {
      if (!customerMap.has(item.customer)) {
        customerMap.set(item.customer, {
          id: `customer-${item.customer}`,
          name: item.customer,
          children: []
        });
        root.children.push(customerMap.get(item.customer));
      }
      
      // Group by supplier within customer
      const customerNode = customerMap.get(item.customer);
      const supplierKey = `${item.customer}-${item.supplier}`;
      let supplierNode = customerNode.children.find(child => child.id === `supplier-${supplierKey}`);
      
      if (!supplierNode) {
        supplierNode = {
          id: `supplier-${supplierKey}`,
          name: item.supplier,
          children: []
        };
        customerNode.children.push(supplierNode);
      }
      
      // Group by destination within supplier
      const destinationKey = `${item.customer}-${item.supplier}-${item.destination}`;
      let destinationNode = supplierNode.children.find(child => child.id === `destination-${destinationKey}`);
      
      if (!destinationNode) {
        destinationNode = {
          id: `destination-${destinationKey}`,
          name: item.destination,
          children: []
        };
        supplierNode.children.push(destinationNode);
      }
      
      // Calculate total value for this combination
      let totalValue = 0;
      
      item.values.forEach(value => {
        totalValue += value[dataType];
      });
      
      // Add a leaf node with the total value
      destinationNode.children.push({
        id: `data-${destinationKey}`,
        name: 'Total',
        value: totalValue
      });
    });
    
    return root;
  };
  
  const circleData = processDataForCirclePacking();
  
  // Handle data type change
  const handleDataTypeChange = (event) => {
    setDataType(event.target.value);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label htmlFor="circleDataType" style={{ marginRight: '10px' }}>Data type:</label>
        <select 
          id="circleDataType" 
          value={dataType} 
          onChange={handleDataTypeChange}
          style={{ padding: '5px 10px' }}
        >
          <option value="totalSubmission">Total Submissions</option>
          <option value="submissionSuccess">Successful Submissions</option>
        </select>
      </div>
      
      <div style={{ height: '600px' }}>
        <ResponsiveCirclePacking
          data={circleData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          id="id"
          value="value"
          colors={{ scheme: 'nivo' }}
          childColor={{
            from: 'color',
            modifiers: [
              ['brighter', 0.4],
              ['opacity', 0.7]
            ]
          }}
          padding={4}
          enableLabels={true}
          labelsFilter={n => n.node.height === 0}
          labelsSkipRadius={10}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 2]]
          }}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.5]]
          }}
          tooltip={({ id, value, color, name }) => (
            <div
              style={{
                padding: '12px 16px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              <div><strong>{name || id}</strong></div>
              {value && (
                <div style={{ color }}>
                  <strong>{dataType === 'totalSubmission' ? 'Total Submissions' : 'Successful Submissions'}:</strong> {value}
                </div>
              )}
            </div>
          )}
          animate={true}
          motionConfig="gentle"
        />
      </div>
      
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <p>
          Circle packing chart showing hierarchical view of {dataType === 'totalSubmission' ? 'total submissions' : 'successful submissions'}.
        </p>
        <p>
          Circles are nested by Customer → Supplier → Destination. Size represents submission volume.
        </p>
      </div>
    </div>
  );
};

export default SubmissionCirclePacking;