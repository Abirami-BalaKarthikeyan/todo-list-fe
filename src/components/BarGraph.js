import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';

const BarGraph = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState({ barData: [], keys: [], dates: [] });
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Process data
    const timer = setTimeout(() => {
      if (data && data.length > 0) {
        // Extract unique x values (dates) from the data
        const allDates = new Set();
        data.forEach(series => {
          series.data.forEach(point => {
            allDates.add(point.x);
          });
        });
        const dates = Array.from(allDates);
        
        // Prepare data for bar chart
        const barData = dates.map(date => {
          const dataPoint = { date };
          
          data.forEach(series => {
            const point = series.data.find(p => p.x === date);
            if (point) {
              dataPoint[series.id] = point.y;
            }
          });
          
          return dataPoint;
        });

        setChartData({
          barData,
          keys: data.map(series => series.id),
          dates
        });
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [data]);

  // Handle date click
  const handleDateClick = (date) => {
    setSelectedDate(selectedDate === date ? null : date);
  };

  // Filter data based on selected date
  const getFilteredData = () => {
    if (!selectedDate) return chartData.barData;
    return chartData.barData.filter(item => item.date === selectedDate);
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
      {/* Date selector */}
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        {chartData.dates.map(date => (
          <button
            key={date}
            onClick={() => handleDateClick(date)}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedDate === date 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {date}
          </button>
        ))}
        {selectedDate && (
          <button
            onClick={() => setSelectedDate(null)}
            className="px-3 py-1 rounded-md text-sm bg-red-500 text-white"
          >
            Show All
          </button>
        )}
      </div>

      {chartData.barData.length > 0 ? (
        <div style={{ height: '400px' }}>
          <ResponsiveBar
            data={getFilteredData()}
            keys={chartData.keys}
            indexBy="date"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            groupMode="grouped"
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Date',
              legendPosition: 'middle',
              legendOffset: 40
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Count',
              legendPosition: 'middle',
              legendOffset: -40
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
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
            onClick={(node) => handleDateClick(node.indexValue)}
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

export default BarGraph;

