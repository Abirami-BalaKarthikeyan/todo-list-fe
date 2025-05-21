import React, { useState, useEffect } from 'react';
import { ResponsiveRadialBar } from '@nivo/radial-bar';

const PolarBarChart = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [viewType, setViewType] = useState('totalSubmission');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data && data.length > 0) {
        // Transform data for radial bar chart
        const radialData = transformData(viewType);
        setChartData(radialData);
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [data, viewType]);

  // Transform data for the radial bar chart
  const transformData = (type) => {
    // Get all unique combinations (customer-supplier-destination)
    const combinations = [...new Set(
      data
        .filter(series => series.id.includes(` - ${type}`))
        .map(series => series.id.split(' - ')[0])
    )];
    
    // Get all unique dates
    const dates = [...new Set(data[0].data.map(d => d.x))];
    
    // Create a color map for combinations
    const colorMap = {
      'cust1sup1dest1': '#F8B195', // Rent
      'cust1sup1dest2': '#F67280', // Groceries
      'cust1sup2dest1': '#C06C84', // Transport
      'cust1sup2dest2': '#6C5B7B', // Savings
      'cust2sup1dest1': '#355C7D', // Misc
      'cust2sup1dest2': '#99B898',
      'cust2sup2dest1': '#FECEAB',
      'cust2sup2dest2': '#FF847C',
    };
    
    // Create radial bar data
    return combinations.map(combination => {
      // Find the series for this combination
      const series = data.find(s => s.id === `${combination} - ${type}`);
      
      // Create data for each date
      const radialData = {
        id: combination,
        data: dates.map(date => {
          const dataPoint = series.data.find(p => p.x === date);
          return {
            x: formatDate(date),
            y: dataPoint ? dataPoint.y : 0
          };
        })
      };
      
      return radialData;
    });
  };
  
  // Format date from DD/MM/YYYY to month name
  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(year, month - 1, day);
    return date.toLocaleString('default', { month: 'short' });
  };

  // Get friendly name for combination
  const getCombinationName = (id) => {
    const mapping = {
      'cust1sup1dest1': 'Rent',
      'cust1sup1dest2': 'Groceries',
      'cust1sup2dest1': 'Transport',
      'cust1sup2dest2': 'Savings',
      'cust2sup1dest1': 'Misc',
      'cust2sup1dest2': 'Category 6',
      'cust2sup2dest1': 'Category 7',
      'cust2sup2dest2': 'Category 8',
    };
    return mapping[id] || id;
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
      <div className="mb-4 flex flex-wrap gap-4 justify-center">
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
        <div style={{ height: '500px' }}>
          <ResponsiveRadialBar
            data={chartData}
            valueFormat=">-.2f"
            padding={0.4}
            cornerRadius={2}
            margin={{ top: 40, right: 120, bottom: 40, left: 40 }}
            radialAxisStart={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
            circularAxisOuter={{ tickSize: 5, tickPadding: 12, tickRotation: 0 }}
            colors={{ scheme: 'paired' }}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            radialAxisMax={200}
            enableLabels={false}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 50,
                itemsSpacing: 12,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemTextColor: '#999',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#000'
                    }
                  }
                ],
                data: chartData.map(item => ({
                  id: item.id,
                  label: getCombinationName(item.id),
                  color: item.color
                }))
              }
            ]}
            tooltip={({ bar }) => (
              <div
                style={{
                  background: 'white',
                  padding: '9px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {getCombinationName(bar.id)} - {bar.data.x}
                </div>
                <div style={{ color: bar.color }}>Value: {bar.data.y}</div>
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

export default PolarBarChart;

