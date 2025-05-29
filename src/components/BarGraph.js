import React, { useState } from "react"; 
import { ResponsiveBar } from "@nivo/bar"; 
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

function BarGraph() { 
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

  // Function to truncate long labels for x-axis
  const trimLabel = (label, maxLength = 10) => 
    label.length > maxLength ? `${label.slice(0, maxLength)}...` : label; 

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

      {/* Bar Chart */} 
      <div style={{ height: 500 }}> 
        <ResponsiveBar 
          data={filteredData} 
          keys={keys} 
          groupMode="grouped" 
          indexBy="label" 
          margin={{ top: 50, right: 130, bottom: 120, left: 60 }} 
          padding={0.4} 
          valueScale={{ type: "linear" }} 
          indexScale={{ type: "band", round: true }} 
          colors={{ scheme: "category10" }} 
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }} 
          axisBottom={{ 
            tickRotation: -45, 
            legend: "Customer-Bind-Supplier-Operator", 
            legendPosition: "middle", 
            legendOffset: 70,
            format: (label) => trimLabel(label, 20),
            tickSize: 5,
            tickPadding: 8,
            tickValues: filteredData.length > 10 
              ? filteredData
                  .map((item, index) => {
                    // Show every 2nd tick if 11-20 items, every 3rd if 21+ items
                    const skipInterval = filteredData.length > 20 ? 3 : 2;
                    return index % skipInterval === 0 ? item.label : null;
                  })
                  .filter(Boolean)
              : undefined
          }} 
          axisLeft={{ 
            legend: "Count", 
            legendPosition: "middle", 
            legendOffset: -40, 
          }} 
          labelSkipWidth={12} 
          labelSkipHeight={12} 
          legends={[ 
            { 
              dataFrom: "keys", 
              anchor: "bottom-right", 
              direction: "column", 
              translateX: 120, 
              itemWidth: 100, 
              itemHeight: 20, 
              symbolSize: 10, 
              effects: [ 
                { 
                  on: "hover", 
                  style: { 
                    itemOpacity: 1, 
                  }, 
                }, 
              ], 
            }, 
          ]} 
          animate={true} 
          motionStiffness={90} 
          motionDamping={15} 
        /> 
      </div> 
    </div> 
  ); 
} 

export default BarGraph;