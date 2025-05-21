import { useState } from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';

export default function HeatMap({data}) {
  const [viewType, setViewType] = useState('totalSubmission');
  
  // Parse and transform the uploaded data for better visualization
  // const rawData = [
  //   {
  //       "id": "cust1sup1dest1 - totalSubmission",
  //       "data": [
  //           {
  //               "x": "01/04/2023",
  //               "y": 90
  //           },
  //           {
  //               "x": "15/04/2023",
  //               "y": 142
  //           },
  //           {
  //               "x": "01/05/2023",
  //               "y": 94
  //           }
  //       ]
  //   },
  //   {
  //       "id": "cust1sup1dest1 - submissionSuccess",
  //       "data": [
  //           {
  //               "x": "01/04/2023",
  //               "y": 82
  //           },
  //           {
  //               "x": "15/04/2023",
  //               "y": 137
  //           },
  //           {
  //               "x": "01/05/2023",
  //               "y": 83
  //           }
  //       ]
  //   },
  //   {
  //       "id": "cust1sup1dest2 - totalSubmission",
  //       "data": [
  //           {
  //               "x": "01/04/2023",
  //               "y": 81
  //           },
  //           {
  //               "x": "15/04/2023",
  //               "y": 67
  //           },
  //           {
  //               "x": "01/05/2023",
  //               "y": 86
  //           }
  //       ]
  //   },
  //   {
  //       "id": "cust1sup1dest2 - submissionSuccess",
  //       "data": [
  //           {
  //               "x": "01/04/2023",
  //               "y": 71
  //           },
  //           {
  //               "x": "15/04/2023",
  //               "y": 63
  //           },
  //           {
  //               "x": "01/05/2023",
  //               "y": 75
  //           }
  //       ]
  //   },
  //   {
  //       "id": "cust1sup2dest1 - totalSubmission",
  //       "data": [
  //           {
  //               "x": "01/04/2023",
  //               "y": 121
  //           },
  //           {
  //               "x": "15/04/2023",
  //               "y": 68
  //           },
  //           {
  //               "x": "01/05/2023",
  //               "y": 123
  //           }
  //       ]
  //   },
  //   {
  //       "id": "cust1sup2dest1 - submissionSuccess",
  //       "data": [
  //           {
  //               "x": "01/04/2023",
  //               "y": 120
  //           },
  //           {
  //               "x": "15/04/2023",
  //               "y": 67
  //           },
  //           {
  //               "x": "01/05/2023",
  //               "y": 117
  //           }
  //       ]
  //   },
  //   {
  //       "id": "cust1sup2dest2 - totalSubmission",
  //       "data": [
  //           {
  //               "x": "01/04/2023",
  //               "y": 113
  //           },
  //           {
  //               "x": "15/04/2023",
  //               "y": 133
  //           },
  //           {
  //               "x": "01/05/2023",
  //               "y": 110
  //           }
  //       ]
  //   },
  //   {
  //       "id": "cust1sup2dest2 - submissionSuccess",
  //       "data": [
  //           {
  //               "x": "01/04/2023",
  //               "y": 104
  //           },
  //           {
  //               "x": "15/04/2023",
  //               "y": 130
  //           },
  //           {
  //               "x": "01/05/2023",
  //               "y": 107
  //           }
  //       ]
  //   },
  //   {
  //       "id": "cust2sup1dest1 - totalSubmission",
  //       "data": [
  //           {
  //               "x": "01/04/2023",
  //               "y": 67
  //           },
  //           {
  //               "x": "15/04/2023",
  //               "y": 76
  //           },
  //           {
  //               "x": "01/05/2023",
  //               "y": 104
  //           }
  //       ]
  //   },
  //   {
  //       "id": "cust2sup1dest1 - submissionSuccess",
  //       "data": [
  //           {
  //               "x": "01/04/2023",
  //               "y": 64
  //           },
  //           {
  //               "x": "15/04/2023",
  //               "y": 64
  //           },
  //           {
  //               "x": "01/05/2023",
  //               "y": 91
  //           }
  //       ]
  //   },
  //   {
  //       "id": "cust2sup1dest2 - totalSubmission",
  //       "data": [
  //           {
  //               "x": "01/04/2023",
  //               "y": 98
  //           },
  //           {
  //               "x": "15/04/2023",
  //               "y": 125
  //           },
  //           {
  //               "x": "01/05/2023",
  //               "y": 97
  //           }
  //       ]
  //   },
  //   {
  //       "id": "cust2sup1dest2 - submissionSuccess",
  //       "data": [
  //           {
  //               "x": "01/04/2023",
  //               "y": 94
  //           },
  //           {
  //               "x": "15/04/2023",
  //               "y": 117
  //           },
  //           {
  //               "x": "01/05/2023",
  //               "y": 85
  //           }
  //       ]
  //   },
  //   {
  //       "id": "cust2sup2dest1 - totalSubmission",
  //       "data": [
  //           {
  //               "x": "01/04/2023",
  //               "y": 115
  //           },
  //           {
  //               "x": "15/04/2023",
  //               "y": 55
  //           },
  //           {
  //               "x": "01/05/2023",
  //               "y": 56
  //           }
  //       ]
  //   },
  //   {
  //       "id": "cust2sup2dest1 - submissionSuccess",
  //       "data": [
  //           {
  //               "x": "01/04/2023",
  //               "y": 103
  //           },
  //           {
  //               "x": "15/04/2023",
  //               "y": 50
  //           },
  //           {
  //               "x": "01/05/2023",
  //               "y": 50
  //           }
  //       ]
  //   },
  //   {
  //       "id": "cust2sup2dest2 - totalSubmission",
  //       "data": [
  //           {
  //               "x": "01/04/2023",
  //               "y": 67
  //           },
  //           {
  //               "x": "15/04/2023",
  //               "y": 133
  //           },
  //           {
  //               "x": "01/05/2023",
  //               "y": 146
  //           }
  //       ]
  //   },
  //   {
  //       "id": "cust2sup2dest2 - submissionSuccess",
  //       "data": [
  //           {
  //               "x": "01/04/2023",
  //               "y": 60
  //           },
  //           {
  //               "x": "15/04/2023",
  //               "y": 123
  //           },
  //           {
  //               "x": "01/05/2023",
  //               "y": 126
  //           }
  //       ]
  //   }
  // ];

  // Function to transform data into heatmap format
  const transformData = (type) => {
    // Get unique combinations of customer, supplier, destination
    const combinations = Array.from(new Set(data.map(item => {
      const parts = item.id.split(' - ')[0];
      return parts;
    })));
    
    // Get unique dates
    const dates = Array.from(new Set(data.flatMap(item => 
      item.data.map(d => d.x)
    )));
    
    // Create transformed data for heatmap
    return combinations.map(combo => {
      const relevantData = data.find(item => 
        item.id === `${combo} - ${type}`
      );
      
      return {
        id: combo,
        data: dates.map(date => {
          const dataPoint = relevantData?.data.find(d => d.x === date);
          return {
            x: date,
            y: dataPoint ? dataPoint.y : 0
          };
        })
      };
    });
  };

  const heatmapData = transformData(viewType);

  console.log("heatmapData", heatmapData);
  
  // Find min and max values for color scale
  const allValues = heatmapData.flatMap(item => 
    item.data.map(d => d.y)
  );
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-4 flex items-center">
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
      
      <div className="w-full h-96">
        <ResponsiveHeatMap
          data={heatmapData}
          margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
          axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: "Dates",
            legendOffset: 40
          }}
          axisRight={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Combinations",
            legendPosition: "middle",
            legendOffset: 80
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Combinations",
            legendPosition: "middle",
            legendOffset: -80
          }}
          colors={{
            type: "sequential",
            scheme: "reds",
            minValue: minValue,
            maxValue: maxValue
          }}
          emptyColor="#ffffff"
          borderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
          legends={[
            {
              anchor: 'bottom',
              translateX: 0,
              translateY: 30,
              length: 400,
              thickness: 8,
              direction: 'row',
              tickPosition: 'after',
              tickSize: 3,
              tickSpacing: 4,
              tickOverlap: false,
              tickFormat: '>-.2f',
              title: 'Value →',
              titleAlign: 'start',
              titleOffset: 4
            }
          ]}
          annotations={[
            {
              type: 'rect',
              match: { id: 'US', value: 'Apr' },
              noteX: 0,
              noteY: -25,
              noteWidth: 120,
              noteHeight: 20,
              noteTextOffset: 5,
              noteBorderRadius: 4,
              noteBackgroundColor: 'rgba(255, 255, 255, 0.8)',
              noteBorderColor: 'rgba(0, 0, 0, 0.5)',
              note: 'Highlighted cell'
            }
          ]}
          hoverTarget="cell"
          cellHoverOthersOpacity={0.25}
        />
      </div>
    </div>
  );
}