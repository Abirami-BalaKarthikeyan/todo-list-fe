import React, { useState } from "react"; 
import { ResponsiveLine } from "@nivo/line"; 
import data from "../utils/data5.json"; 
import { 
  Box, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Chip,
  Tooltip,
  Typography
} from "@mui/material"; 

function LineChart() { 
  // Prepare the graph data 
  const graphData = data.data.x_axis.map((x, index) => { 
    const key = Object.keys(x)[0]; 
    return { 
      label: x[key], 
      ...data.data.y_axis[index], 
    }; 
  }); 

  const keys = Object.keys(data.data.y_axis[0] || {}); 
  const allLabels = graphData.map((item) => item.label); 

  // State to store selected labels (array for multiselect)
  const [selectedLabels, setSelectedLabels] = useState([]); 

  // Filtered data based on dropdown 
  const filteredData = selectedLabels.length > 0
    ? graphData.filter((item) => selectedLabels.includes(item.label)) 
    : graphData; 

  // Function to truncate dropdown values
  const trimDropdownValue = (value, maxLength = 20) =>
    value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;

  // Handle multiselect change
  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedLabels(typeof value === 'string' ? value.split(',') : value);
  };

  // Custom render function for selected values
  const renderSelectedValues = (selected) => {
    if (selected.length === 0) return '';
    if (selected.length === 1) return trimDropdownValue(selected[0]);
    return `${selected.length} items selected`;
  };

  // Dynamic tick spacing based on data length
  const getTickInterval = (dataLength) => {
    if (dataLength <= 10) return 1; // Show all ticks
    if (dataLength <= 20) return 2; // Show every 2nd tick
    if (dataLength <= 50) return Math.ceil(dataLength / 10); // Show ~10 ticks
    return Math.ceil(dataLength / 20); // Show ~8 ticks for large datasets
  };

  // Transform data for Line chart format
  const lineData = keys.map((key) => ({
    id: key,
    data: filteredData.map((item, index) => ({
      x: index, // Use index for x-axis positioning
      y: item[key] || 0,
      label: item.label // Store full label for tooltip
    }))
  }));

  const tickInterval = getTickInterval(filteredData.length);

  return ( 
    <div style={{ padding: 20 }}> 
      {/* Multiselect Dropdown to filter */} 
      <Box mb={2} width={400}> 
        <FormControl fullWidth> 
          <InputLabel>Select Combinations</InputLabel> 
          <Select 
            multiple
            value={selectedLabels} 
            label="Select Combinations" 
            onChange={handleChange}
            renderValue={renderSelectedValues}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  width: 400,
                },
              },
            }}
          > 
            {allLabels.map((label, index) => ( 
              <MenuItem key={index} value={label}> 
                {label.length > 20 ? (
                  <Tooltip title={label} arrow placement="right">
                    <Typography
                      component="span"
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                        maxWidth: '100%'
                      }}
                    >
                      {trimDropdownValue(label)}
                    </Typography>
                  </Tooltip>
                ) : (
                  label
                )}
              </MenuItem> 
            ))} 
          </Select> 
        </FormControl> 
      </Box> 

      {/* Display selected items as chips */}
      {selectedLabels.length > 0 && (
        <Box mb={2} display="flex" flexWrap="wrap" gap={1}>
          {selectedLabels.map((label, index) => (
            <Chip
              key={index}
              label={trimDropdownValue(label, 30)}
              onDelete={() => {
                setSelectedLabels(prev => prev.filter(item => item !== label));
              }}
              size="small"
              variant="outlined"
              title={label} // Native tooltip for chips
            />
          ))}
          <Chip
            label="Clear All"
            onClick={() => setSelectedLabels([])}
            size="small"
            variant="outlined"
            color="secondary"
            style={{ marginLeft: 8 }}
          />
        </Box>
      )}

      {/* Line Chart */} 
      <div style={{ height: 500 }}> 
        <ResponsiveLine
          data={lineData}
          margin={{ top: 50, right: 130, bottom: 120, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 8,
            tickRotation: -45,
            legend: 'Customer-Bind-Supplier-Operator',
            legendOffset: 70,
            legendPosition: 'middle',
            // Dynamic tick values - only show subset of ticks
            tickValues: filteredData.map((_, index) => index).filter((_, index) => index % tickInterval === 0),
            format: (value) => {
              // Get the label for this index
              const item = filteredData[value];
              const label = item ? item.label : '';
              // Reduce character limit for crowded x-axis
              const charLimit = filteredData.length > 20 ? 6 : 8;
              return label.length > charLimit ? `${label.slice(0, charLimit)}...` : label;
            }
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Count',
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          pointSize={6}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          colors={{ scheme: 'category10' }}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 100,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          tooltip={({ point }) => (
            <div
              style={{
                background: 'white',
                padding: '9px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <div><strong>{point.data.label}</strong></div>
              <div>
                <span style={{ color: point.serieColor }}>●</span>
                {' '}{point.serieId}: {point.data.yFormatted}
              </div>
            </div>
          )}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div> 
    </div> 
  ); 
} 

export default LineChart;