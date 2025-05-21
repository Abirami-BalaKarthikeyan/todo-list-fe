import React, { useState, useEffect } from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';

// Sample data directly from Nivo examples
const sampleData = [
  {
    "id": "Japan",
    "Jan": 7,
    "Feb": 20,
    "Mar": 26,
    "Apr": 85,
    "May": 115
  },
  {
    "id": "France",
    "Jan": 63,
    "Feb": 71,
    "Mar": 31,
    "Apr": 120,
    "May": 49
  },
  {
    "id": "US",
    "Jan": 11,
    "Feb": 110,
    "Mar": 81,
    "Apr": 106,
    "May": 55
  }
];

const HeatMap = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [processedData, setProcessedData] = useState(null);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (data && data.length > 0) {
          // Extract unique dates
          const allDates = new Set();
          data.forEach(series => {
            series.data.forEach(point => {
              allDates.add(point.x);
            });
          });
          const sortedDates = Array.from(allDates).sort();
          
          // Create data in the format expected by Nivo
          const heatmapData = data.map(series => {
            const row = { id: series.id };
            
            // Initialize all dates with zero values
            sortedDates.forEach(date => {
              row[date] = 0;
            });
            
            // Fill in actual values
            series.data.forEach(point => {
              row[point.x] = point.y;
            });
            
            return row;
          });
          
          console.log("Processed data:", heatmapData);
          console.log("Keys:", sortedDates);
          
          setProcessedData(heatmapData);
          setKeys(sortedDates);
        } else {
          // Use sample data as fallback
          console.log("Using sample data");
          setProcessedData(sampleData);
          setKeys(["Jan", "Feb", "Mar", "Apr", "May"]);
        }
      } catch (error) {
        console.error("Error processing data:", error);
        // Use sample data as fallback
        setProcessedData(sampleData);
        setKeys(["Jan", "Feb", "Mar", "Apr", "May"]);
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

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <div style={{ height: '400px' }}>
        <ResponsiveHeatMap
          data={ sampleData}
          keys={keys.length > 0 ? keys : ["Jan", "Feb", "Mar", "Apr", "May"]}
          indexBy="id"
          margin={{ top: 50, right: 60, bottom: 60, left: 120 }}
          forceSquare={false}
          axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Date',
            legendOffset: 36
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Series',
            legendPosition: 'middle',
            legendOffset: -80
          }}
          colors={{
            type: 'sequential',
            scheme: 'blues'
          }}
          emptyColor="#eeeeee"
          cellOpacity={1}
          cellBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
          hoverTarget="cell"
          cellHoverOthersOpacity={0.25}
        />
      </div>
    </div>
  );
};

export default HeatMap;


