import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';

const RadialBarChart = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewType, setViewType] = useState('totalSubmission');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data && data.length > 0) {
        // Get unique dates
        const dates = [...new Set(data[0].data.map(d => d.x))];
        
        // Set first date as default selected date if none is selected
        if (!selectedDate && dates.length > 0) {
          setSelectedDate(dates[0]);
        }
        
        // Transform data for radial bar chart
        const radialData = transformData(selectedDate || dates[0], viewType);
        setChartData(radialData);
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [data, selectedDate, viewType]);

  // Transform data for the radial bar chart
  const transformData = (date, type) => {
    // Filter series by type
    const filteredData = data.filter(series => 
      series.id.includes(` - ${type}`)
    );
    
    // Create radial bar data
    return filteredData.map(series => {
      const combination = series.id.split(' - ')[0];
      const dataPoint = series.data.find(p => p.x === date);
      
      return {
        id: combination,
        value: dataPoint ? dataPoint.y : 0,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      };
    });
  };

  // Get unique dates
  const dates = data && data.length > 0 ? 
    [...new Set(data[0].data.map(d => d.x))] : [];

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
      <div className="mb-4 flex flex-wrap gap-4 justify-center">
        {/* Date selector */}
        <div>
          <label htmlFor="dateSelect" className="mr-2 text-gray-700 font-medium">
            Date:
          </label>
          <select 
            id="dateSelect" 
            value={selectedDate || ''} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            {dates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
        
        {/* View type selector */}
        <div>
          <label htmlFor="viewType" className="mr-2 text-gray-700 font-medium">
            View:
          </label>
          <select 
            id="viewType" 
            value={viewType} 
            onChange={(e) => setViewType(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="totalSubmission">Total Submissions</option>
            <option value="submissionSuccess">Successful Submissions</option>
          </select>
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <div style={{ height: '400px' }}>
          <ResponsiveBar
            data={chartData}
            keys={['value']}
            indexBy="id"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            layout="radial"
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'category10' }}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={null}
            axisLeft={null}
            enableGridX={false}
            enableGridY={false}
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
            motionConfig="wobbly"
            tooltip={({ data, value, color }) => (
              <div
                style={{
                  background: 'white',
                  padding: '9px 12px',
                  border: '1px solid #ccc',
                }}
              >
                <div><strong>{data.id}</strong></div>
                <div style={{ color }}>Value: {value}</div>
              </div>
            )}
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

export default RadialBarChart;
