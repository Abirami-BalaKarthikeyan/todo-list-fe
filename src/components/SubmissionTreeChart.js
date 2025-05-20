import React, { useState, useRef, useEffect } from 'react';
import { ResponsiveTreeMap } from '@nivo/treemap';

const SubmissionTreeChart = ({ data }) => {
  // State for zoom
  const [zoomToId, setZoomToId] = useState(null);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  // Process data for the tree chart - need to transform to hierarchical format
  const processDataForTreeChart = () => {
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
      
      // Add submission data as leaf nodes
      let totalSubmissions = 0;
      let totalSuccessful = 0;
      
      item.values.forEach(value => {
        totalSubmissions += value.totalSubmission;
        totalSuccessful += value.submissionSuccess;
      });
      
      // Add a leaf node with the total value
      destinationNode.children.push({
        id: `data-${destinationKey}`,
        name: 'Total Submissions',
        value: totalSubmissions,
        successRate: totalSuccessful > 0 ? (totalSuccessful / totalSubmissions * 100).toFixed(1) : 0
      });
    });
    
    return root;
  };
  
  const treeData = processDataForTreeChart();
  
  // Track current zoom path
  const [zoomPath, setZoomPath] = useState([]);
  
  // Helper function to find a node by ID
  const findNodeById = (nodeId, currentNode = treeData) => {
    if (currentNode.id === nodeId) {
      return currentNode;
    }
    
    if (currentNode.children) {
      for (const child of currentNode.children) {
        const found = findNodeById(nodeId, child);
        if (found) return found;
      }
    }
    
    return null;
  };
  
  // Handle zoom in to a specific node
  const handleNodeClick = (node) => {
    if (node.children && node.children.length > 0) {
      setZoomToId(node.id);
      setZoomPath([...zoomPath, node.id]);
    }
  };
  
  // Handle zoom out (one level)
  const zoomOut = () => {
    if (zoomPath.length > 0) {
      const newPath = [...zoomPath];
      newPath.pop();
      
      if (newPath.length === 0) {
        setZoomToId(null);
      } else {
        setZoomToId(newPath[newPath.length - 1]);
      }
      
      setZoomPath(newPath);
    }
  };
  
  // Reset zoom completely
  const resetZoom = () => {
    setZoomToId(null);
    setZoomPath([]);
  };
  
  // Zoom in one level (to first child if not already zoomed)
  const zoomIn = () => {
    if (!zoomToId) {
      // If not zoomed, zoom to root
      setZoomToId('root');
      setZoomPath(['root']);
    } else {
      // If already zoomed, try to zoom to first child
      const currentNode = findNodeById(zoomToId);
      if (currentNode && currentNode.children && currentNode.children.length > 0) {
        const firstChild = currentNode.children[0];
        setZoomToId(firstChild.id);
        setZoomPath([...zoomPath, firstChild.id]);
      }
    }
  };
  
  // Helper function to get node path
  const getNodePath = (node) => {
    const path = [];
    let current = node;
    
    // Add current node name
    if (current.name) {
      path.unshift(current.name);
    }
    
    // Add parent names if available
    if (current.parent) {
      let parent = current.parent;
      while (parent) {
        if (parent.name) {
          path.unshift(parent.name);
        }
        parent = parent.parent;
      }
    }
    
    return path.length > 0 ? path : [node.id];
  };
  
  // Update container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div>
      <div 
        ref={containerRef}
        style={{ height: "500px" }}
      >
        <ResponsiveTreeMap
          data={treeData}
          identity="id"
          value="value"
          valueFormat=".02s"
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          labelSkipSize={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
          parentLabelPosition="left"
          parentLabelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          borderColor={{ from: 'color', modifiers: [['darker', 0.1]] }}
          animate={true}
          motionConfig="gentle"
          zoomedId={zoomToId}
          onClick={handleNodeClick}
          tooltip={({ node }) => {
            // Get node path safely
            const nodePath = getNodePath(node);
            
            return (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <strong>Path:</strong> {nodePath.join(' > ')}
                </div>
                <div>
                  <strong>Name:</strong> {node.name || node.id}
                </div>
                {node.value !== undefined && (
                  <div>
                    <strong>Total Submissions:</strong> {node.value}
                  </div>
                )}
                {node.data && node.data.successRate !== undefined && (
                  <div>
                    <strong>Success Rate:</strong> {node.data.successRate}%
                  </div>
                )}
              </div>
            );
          }}
          colors={{ scheme: 'nivo' }}
        />
      </div>
      
      {/* Zoom and navigation controls */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <button 
          onClick={zoomIn}
          style={{ margin: '0 5px', padding: '5px 10px' }}
          disabled={zoomToId && (!findNodeById(zoomToId) || !findNodeById(zoomToId).children || findNodeById(zoomToId).children.length === 0)}
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
          disabled={zoomPath.length === 0}
        >
          Zoom Out (-)
        </button>
      </div>
      
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <p>
          Click on a section to zoom in. {zoomToId ? 'Currently zoomed in.' : 'Currently showing all data.'} 
          (Zoom depth: {zoomPath.length})
        </p>
      </div>
    </div>
  );
};

export default SubmissionTreeChart;



