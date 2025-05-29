import React, { useState, useEffect } from 'react';
import { ResponsiveRadialBar } from '@nivo/radial-bar';
import data5 from '../utils/data5.json';

const PolarBarChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('total_submissions');
  const [maxCategories, setMaxCategories] = useState(8);

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
      // Transform data5 for the polar radial bar chart
      const transformDataLocal = (metric, maxCats) => {
        if (!data5.data || !data5.data.x_axis || !data5.data.y_axis) {
          return [];
        }

        // Group data by customer-supplier combinations
        const combinationMap = new Map();

        data5.data.x_axis.forEach((xItem, index) => {
          const xAxisKey = Object.keys(xItem)[0];
          const xAxisValue = xItem[xAxisKey];
          const yAxisData = data5.data.y_axis[index] || {};

          const customerName = extractCustomerName(xAxisValue);
          const supplier = extractSupplier(xAxisValue);
          const combinationKey = `${customerName}-${supplier}`;

          if (!combinationMap.has(combinationKey)) {
            combinationMap.set(combinationKey, {
              id: combinationKey,
              customerName,
              supplier,
              originalKey: xAxisValue, // Store the original x-axis value
              totalValue: 0,
              count: 0,
              allMetrics: {}
            });
          }

          const combination = combinationMap.get(combinationKey);
          const value = yAxisData[metric] || 0;
          combination.totalValue += value;
          combination.count += 1;

          // Store all metrics for tooltip
          Object.keys(yAxisData).forEach(key => {
            if (!combination.allMetrics[key]) {
              combination.allMetrics[key] = 0;
            }
            combination.allMetrics[key] += yAxisData[key] || 0;
          });
        });

        // Convert to array and sort by total value
        const sortedCombinations = Array.from(combinationMap.values())
          .sort((a, b) => b.totalValue - a.totalValue)
          .slice(0, maxCats)
          .filter(item => item.totalValue > 0);

        // Create radial bar data structure
        return sortedCombinations.map((combination, index) => ({
          id: combination.id,
          data: [
            {
              x: 'Value',
              y: combination.totalValue
            }
          ],
          customerName: combination.customerName,
          supplier: combination.supplier,
          originalKey: combination.originalKey,
          totalValue: combination.totalValue,
          count: combination.count,
          allMetrics: combination.allMetrics,
          color: `hsl(${(index * 360) / maxCats}, 70%, 50%)`
        }));
      };

      const radialData = transformDataLocal(selectedMetric, maxCategories);
      setChartData(radialData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedMetric, maxCategories]);

  // Get friendly name for combination
  const getCombinationName = (id) => {
    // For data5, we'll use the actual customer-supplier combination
    return id.replace(/-/g, ' → ');
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

        {/* Max categories selector */}
        <div>
          <label htmlFor="maxCategories" className="mr-2 text-gray-700 font-medium">
            Max Categories:
          </label>
          <select
            id="maxCategories"
            value={maxCategories}
            onChange={(e) => setMaxCategories(parseInt(e.target.value))}
            className="p-2 border border-gray-300 rounded"
          >
            <option value={5}>Top 5</option>
            <option value={8}>Top 8</option>
            <option value={10}>Top 10</option>
            <option value={15}>Top 15</option>
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
            tooltip={({ bar }) => {
              // Find the original data item for this bar
              const dataItem = chartData.find(item => item.id === bar.id);

              // Check if customer and supplier are the same as the original string (meaning extraction failed)
              const isCustomerExtracted = dataItem?.customerName && dataItem.customerName !== dataItem.originalKey;
              const isSupplierExtracted = dataItem?.supplier && dataItem.supplier !== dataItem.originalKey;

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
                        {dataItem?.customerName}
                      </div>
                      <div style={{ marginBottom: '4px' }}>
                        <strong>Supplier:</strong> {dataItem?.supplier}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>
                      {dataItem?.originalKey || bar.id}
                    </div>
                  )}
                  <div style={{ color: bar.color, fontWeight: 'bold', marginBottom: '8px' }}>
                    {selectedMetric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: {bar.data.y}
                  </div>
                  {dataItem?.allMetrics && (
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      <div>Total Submissions: {dataItem.allMetrics.total_submissions || 0}</div>
                      <div>Successful: {dataItem.allMetrics['sum(submission_success)'] || 0}</div>
                      <div>Failures: {dataItem.allMetrics['sum(delivery_failure_count_final)'] || 0}</div>
                      <div>Data Points: {dataItem.count || 0}</div>
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

export default PolarBarChart;

