import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import data5 from '../utils/data5.json';

const RadialBarChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('total_submissions');
  const [maxItems, setMaxItems] = useState(20);

  // Helper function to extract customer name from x_axis string
  const extractCustomerName = (xAxisString) => {
    const parts = xAxisString.split('-');
    return parts.length > 1 ? parts[1] : xAxisString;
  };

  // Helper function to extract supplier name from x_axis string
  const extractSupplier = (xAxisString) => {
    const parts = xAxisString.split('-');
    return parts.length > 3 ? parts[3] : xAxisString;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Transform data5 for the radial bar chart
      const transformDataLocal = (metric, maxItemsToShow) => {
        if (!data5.data || !data5.data.x_axis || !data5.data.y_axis) {
          return [];
        }

        const chartData = data5.data.x_axis.map((xItem, index) => {
          const xAxisKey = Object.keys(xItem)[0];
          const xAxisValue = xItem[xAxisKey];
          const yAxisData = data5.data.y_axis[index] || {};

          const customerName = extractCustomerName(xAxisValue);
          const supplier = extractSupplier(xAxisValue);
          const label = `${customerName} - ${supplier}`;

          return {
            id: label,
            label: label,
            value: yAxisData[metric] || 0,
            customerName,
            supplier,
            originalKey: xAxisValue,
            fullData: yAxisData
          };
        });

        // Sort by value and take top items
        return chartData
          .sort((a, b) => b.value - a.value)
          .slice(0, maxItemsToShow)
          .filter(item => item.value > 0); // Only show items with positive values
      };

      const radialData = transformDataLocal(selectedMetric, maxItems);
      setChartData(radialData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedMetric, maxItems]);

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
        {/* Metric selector */}
        <div>
          <label htmlFor="metricSelect" className="mr-2 text-gray-700 font-medium">
            Metric:
          </label>
          <select
            id="metricSelect"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            {data5['Y-Axis'].map(metric => (
              <option key={metric} value={metric}>
                {metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {/* Max items selector */}
        <div>
          <label htmlFor="maxItems" className="mr-2 text-gray-700 font-medium">
            Max Items:
          </label>
          <select
            id="maxItems"
            value={maxItems}
            onChange={(e) => setMaxItems(parseInt(e.target.value))}
            className="p-2 border border-gray-300 rounded"
          >
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={30}>Top 30</option>
            <option value={50}>Top 50</option>
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
            tooltip={({ data, value, color }) => {
              // Check if customer and supplier are the same as the original string (meaning extraction failed)
              const isCustomerExtracted = data.customerName && data.customerName !== data.originalKey;
              const isSupplierExtracted = data.supplier && data.supplier !== data.originalKey;

              return (
                <div
                  style={{
                    background: 'white',
                    padding: '12px 16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    maxWidth: '300px'
                  }}
                >
                  {isCustomerExtracted && isSupplierExtracted ? (
                    <>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                        {data.customerName}
                      </div>
                      <div style={{ marginBottom: '4px' }}>
                        <strong>Supplier:</strong> {data.supplier}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>
                      {data.originalKey || data.id}
                    </div>
                  )}
                  <div style={{ color, fontWeight: 'bold' }}>
                    {selectedMetric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: {value}
                  </div>
                  {data.fullData && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                      <div>Total Submissions: {data.fullData.total_submissions || 0}</div>
                      <div>Successful: {data.fullData['sum(submission_success)'] || 0}</div>
                      <div>Failures: {data.fullData['sum(delivery_failure_count_final)'] || 0}</div>
                    </div>
                  )}
                </div>
              );
            }}
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
