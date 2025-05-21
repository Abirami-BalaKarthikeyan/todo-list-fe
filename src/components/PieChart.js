import React, { useState, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';

const PieChart = ({ data }) => {
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
        
        // Transform data for pie chart
        const pieData = transformData(selectedDate || dates[0], viewType);
        setChartData(pieData);
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [data, selectedDate, viewType]);

  // Transform data for the pie chart
  const transformData = (date, type) => {
    // Filter series by type
    const filteredData = data.filter(series => 
      series.id.includes(` - ${type}`)
    );
    
    // Create pie data
    return filteredData.map(series => {
      const combination = series.id.split(' - ')[0];
      const dataPoint = series.data.find(p => p.x === date);
      
      return {
        id: combination,
        label: combination,
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
          <ResponsivePie
            data={chartData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle'
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

export default PieChart;