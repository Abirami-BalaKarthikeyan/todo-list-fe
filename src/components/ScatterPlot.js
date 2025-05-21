import React, { useState, useEffect } from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';

const ScatterPlot = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data && data.length > 0) {
        // Transform data for scatter plot
        // Group by series type (totalSubmission or submissionSuccess)
        const seriesTypes = [...new Set(data.map(series => 
          series.id.split(' - ')[1]
        ))];
        
        // Create scatter plot data structure
        const scatterData = seriesTypes.map(seriesType => {
          // Filter series by type
          const seriesOfType = data.filter(series => 
            series.id.includes(` - ${seriesType}`)
          );
          
          // Collect all data points for this series type
          const points = [];
          seriesOfType.forEach(series => {
            const combination = series.id.split(' - ')[0];
            series.data.forEach(point => {
              points.push({
                x: point.y, // Use the y value as x for scatter plot
                y: Math.random() * 10, // Random y position for visual separation
                date: point.x,
                combination,
                seriesId: series.id
              });
            });
          });
          
          return {
            id: seriesType,
            data: points
          };
        });
        
        setChartData(scatterData);
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [data]);

  // Handle series click
  const handleSeriesClick = (seriesId) => {
    setSelectedSeries(selectedSeries === seriesId ? null : seriesId);
  };

  // Filter data based on selected series
  const getFilteredData = () => {
    if (!selectedSeries) return chartData;
    return chartData.filter(series => series.id === selectedSeries);
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
      {/* Series selector */}
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        {chartData.map(series => (
          <button
            key={series.id}
            onClick={() => handleSeriesClick(series.id)}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedSeries === series.id
                ? "bg-purple-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {series.id}
          </button>
        ))}
        {selectedSeries && (
          <button
            onClick={() => setSelectedSeries(null)}
            className="px-3 py-1 rounded-md text-sm bg-red-500 text-white"
          >
            Show All
          </button>
        )}
      </div>

      {chartData.length > 0 ? (
        <div style={{ height: '400px' }}>
          <ResponsiveScatterPlot
            data={getFilteredData()}
            margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
            xScale={{ type: 'linear', min: 0, max: 'auto' }}
            yScale={{ type: 'linear', min: 0, max: 10 }}
            blendMode="multiply"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Value',
              legendPosition: 'middle',
              legendOffset: 46
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Distribution',
              legendPosition: 'middle',
              legendOffset: -60
            }}
            colors={{ scheme: 'category10' }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="seriesId"
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 130,
                translateY: 0,
                itemWidth: 100,
                itemHeight: 12,
                itemsSpacing: 5,
                itemDirection: 'left-to-right',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1
                    }
                  }
                ],
                onClick: (data) => handleSeriesClick(data.id)
              }
            ]}
            tooltip={({ node }) => (
              <div
                style={{
                  background: 'white',
                  padding: '9px 12px',
                  border: '1px solid #ccc',
                }}
              >
                <div><strong>{node.data.seriesId}</strong></div>
                <div>Date: {node.data.date}</div>
                <div>Value: {node.data.x}</div>
                <div>Combination: {node.data.combination}</div>
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

export default ScatterPlot;