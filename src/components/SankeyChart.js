import React, { useState, useEffect } from 'react';
import { ResponsiveSankey } from '@nivo/sankey';

const SankeyChart = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sankeyData, setSankeyData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data && data.length > 0) {
        // Transform data for Sankey diagram
        const nodes = [];
        const links = [];
        const nodeMap = new Map();
        
        // Create nodes for customers, suppliers, destinations
        data.forEach(series => {
          const [combination, type] = series.id.split(' - ');
          if (type === 'totalSubmission') {
            // Extract customer, supplier, destination from combination
            const customer = combination.substring(0, 5); // cust1, cust2
            const supplier = combination.substring(5, 9); // sup1, sup2
            const destination = combination.substring(9); // dest1, dest2
            
            // Add nodes if they don't exist
            if (!nodeMap.has(customer)) {
              nodeMap.set(customer, nodes.length);
              nodes.push({ id: customer });
            }
            
            if (!nodeMap.has(supplier)) {
              nodeMap.set(supplier, nodes.length);
              nodes.push({ id: supplier });
            }
            
            if (!nodeMap.has(destination)) {
              nodeMap.set(destination, nodes.length);
              nodes.push({ id: destination });
            }
            
            // Calculate total value for this combination
            const totalValue = series.data.reduce((sum, point) => sum + point.y, 0);
            
            // Create links between nodes
            links.push({
              source: customer,
              target: supplier,
              value: totalValue
            });
            
            links.push({
              source: supplier,
              target: destination,
              value: totalValue
            });
          }
        });
        
        setSankeyData({ nodes, links });
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Processing chart data...</p>
        </div>
      </div>
    );
  }
console.log("sankeyData", sankeyData);
  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      {sankeyData.nodes.length > 0 && sankeyData.links.length > 0 ? (
        <div style={{ height: '500px' }}>
          <ResponsiveSankey
            data={sankeyData}
            margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
            align="justify"
            colors={{ scheme: 'category10' }}
            nodeOpacity={1}
            nodeHoverOthersOpacity={0.35}
            nodeThickness={18}
            nodeSpacing={24}
            nodeBorderWidth={0}
            nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
            linkOpacity={0.5}
            linkHoverOthersOpacity={0.1}
            linkContract={3}
            enableLinkGradient={true}
            labelPosition="outside"
            labelOrientation="horizontal"
            labelPadding={16}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
            animate={true}
            motionConfig="gentle"
            tooltip={({ node, link }) => {
              if (node) {
                return (
                  <div style={{ background: 'white', padding: '9px 12px', border: '1px solid #ccc' }}>
                    <strong>{node.id}</strong>
                    <div>Value: {node.value}</div>
                  </div>
                );
              }
              if (link) {
                return (
                  <div style={{ background: 'white', padding: '9px 12px', border: '1px solid #ccc' }}>
                    <div><strong>{link.source.id} → {link.target.id}</strong></div>
                    <div>Value: {link.value}</div>
                  </div>
                );
              }
              return null;
            }}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No data available for Sankey chart</p>
        </div>
      )}
    </div>
  );
};

export default SankeyChart;