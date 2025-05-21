import React, { useState, useEffect } from 'react';
import { ResponsiveStream } from '@nivo/stream';

const StreamChart = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [viewType, setViewType] = useState('totalSubmission');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data && data.length > 0) {
        // Transform data for stream chart
        const { streamData, streamKeys } = transformData(viewType);
        setChartData(streamData);
        setKeys(streamKeys);
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [data, viewType]);

  // Transform data for the stream chart
  const transformData = (type) => {
    // Get unique dates and combinations
    const dates = [...new Set(data[0].data.map(d => d.x))];
    
    // Filter series by type
    const filteredData = data.filter(series => 
      series.id.includes(` - ${type}`)
    );
    
    // Get unique combinations
    const combinations = filteredData.map(series => 
      series.id.split(' - ')[0]
    );
    
    // Create stream data
    const streamData = dates.map(date => {
      const dataPoint = { date };
      
      filteredData.forEach(series => {
        const combination = series.id.split(' - ')[0];
        const point = series.data.find(p => p.x === date);
        if (point) {
          dataPoint[combination] = point.y;
        } else {
          dataPoint[combination] = 0;
        }
      });
      
      return dataPoint;
    });
    
    return { streamData, streamKeys: combinations };
  };

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
      <div className="mb-4 flex justify-center">
        <select 
          value={viewType} 
          onChange={(e) => setViewType(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="totalSubmission">Total Submissions</option>
          <option value="submissionSuccess">Successful Submissions</option>
        </select>
      </div>
      
      {chartData.length > 0 && keys.length > 0 ? (
        <div style={{ height: '400px' }}>
          <ResponsiveStream
            data={chartData}
            keys={keys}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Date',
              legendOffset: 36
            }}
            axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Value',
              legendOffset: -40
            }}
            offsetType="silhouette"
            colors={{ scheme: 'nivo' }}
            fillOpacity={0.85}
            borderColor={{ theme: 'background' }}
            defs={[
              {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#2c998f',
                size: 4,
                padding: 2,
                stagger: true
              },
              {
                id: 'squares',
                type: 'patternSquares',
                background: 'inherit',
                color: '#e4c912',
                size: 6,
                padding: 2,
                stagger: true
              }
            ]}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                translateX: 100,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999999',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#000000'
                    }
                  }
                ]
              }
            ]}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
};

export default StreamChart;