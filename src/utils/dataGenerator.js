/**
 * Generates sample data with combinations of customers, suppliers, and destinations
 * @returns {Array} Array of series objects with id and data points
 */
export function initializeDataJson() {
  // const customers = ['cust1', 'cust2', 'cust3', 'cust4', 'cust5'];
  // const suppliers = ['sup1', 'sup2', 'sup3', 'sup4', 'sup5'];
  // const destinations = ['dest1', 'dest2', 'dest3', 'dest4', 'dest5'];

  //  const dates = [
  //   "01/04/2023",
  //   "15/04/2023",
  //   "01/05/2023",
  //   "15/05/2023",
  //   "01/06/2023",
  //   "09/06/2023",
  //   "15/06/2023",
  //   "20/06/2023",
  //   "25/06/2023",
  // ];

  const customers = ["cust1", "cust2","cust3"];
  const suppliers = ["sup1", "sup2","sup3"];
  const destinations = ["dest1", "dest2","dest3"];

  const dates = ["01/04/2023", "15/04/2023", "01/05/2023"];
  // Define five specific dates

  // Create array to hold all series
  const seriesArray = [];

  // Generate data for each combination
  for (const cust of customers) {
    for (const sup of suppliers) {
      for (const dest of destinations) {
        const combinationId = `${cust}${sup}${dest}`;

        // Create data points for all 5 dates
        const totalSubmissionData = dates.map((date) => {
          // Generate random metrics for total submissions
          const totalSubmission = Math.floor(Math.random() * 100) + 50;
          return { x: date, y: totalSubmission };
        });

        const successSubmissionData = dates.map((date) => {
          // Find matching total submission for this date
          const totalPoint = totalSubmissionData.find((p) => p.x === date);
          const total = totalPoint ? totalPoint.y : 0;

          // Generate random metrics for successful submissions (85-100% of total)
          const successSubmission = Math.floor(
            total * (0.85 + Math.random() * 0.15)
          );
          return { x: date, y: successSubmission };
        });

        // Create series for total submissions
        seriesArray.push({
          id: `${combinationId} - totalSubmission`,
          data: totalSubmissionData,
        });

        // Create series for successful submissions
        seriesArray.push({
          id: `${combinationId} - submissionSuccess`,
          data: successSubmissionData,
        });
      }
    }
  }

  return seriesArray;
}

/**
 * Generates sample data with combinations of customers, suppliers, and destinations
 * @returns {Array} Array of series objects with id and data points
 */
export function initializeDataJson2() {
  const customers = ["cust1", "cust2"];
  const suppliers = ["sup1", "sup2"];
  const destinations = ["dest1", "dest2"];
  const dates = [
    "01/04/2023",
    "15/04/2023",
    "01/05/2023",
    "15/05/2023",
    "01/06/2023",
    "15/06/2023",
    "01/07/2023",
    "15/07/2023",
    "01/08/2023",
    "15/08/2023",
    "01/09/2023",
    "15/09/2023",
  ];

  // Predefined hardcoded values based on the given rawData
  const predefinedValues = {
    cust1sup1dest1: {
      total: [90, 142, 94, 120, 110, 100, 90, 80, 70, 60, 50, 40],
      success: [82, 137, 83, 110, 100, 90, 80, 70, 60, 50, 40, 30],
    },
    cust1sup1dest2: {
      total: [81, 67, 86, 75, 65, 55, 45, 35, 25, 15, 5, 0],
      success: [121, 68, 123, 110, 100, 90, 80, 70, 60, 50, 40, 30, 20],
    },
    cust1sup2dest1: {
      total: [121, 68, 123, 110, 100, 90, 80, 70, 60, 50, 40, 30, 20],
      success:[81, 67, 86, 75, 65, 55, 45, 35, 25, 15, 5, 0],
    },
    cust1sup2dest2: {
      total: [113, 133, 110, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10],
      success:[67, 76, 104, 90, 80, 70, 60, 50, 40, 30, 20, 10],
    },
    cust2sup1dest1: {
      total: [67, 76, 104, 90, 80, 70, 60, 50, 40, 30, 20, 10],
      success:[113, 133, 110, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10],
    },
    cust2sup1dest2: {
      total: [98, 125, 97, 85, 75, 65, 55, 45, 35, 25, 15, 5, 0],
      success: [94, 117, 85, 75, 65, 55, 45, 35, 25, 15, 5, 0, 0],
    },
    cust2sup2dest1: {
      total: [115, 55, 56, 46, 36, 26, 16, 6, 5, 4, 3, 2],
      success: [98, 125, 97, 85, 75, 65, 55, 45, 35, 25, 15, 5, 0],
    },
    cust2sup2dest2: {
      total: [98, 125, 97, 85, 75, 65, 55, 45, 35, 25, 15, 5, 0],
      success: [94, 117, 85, 75, 65, 55, 45, 35, 25, 15, 5, 0, 0],
    },
  };

  const seriesArray = [];

  for (const cust of customers) {
    for (const sup of suppliers) {
      for (const dest of destinations) {
        const combinationId = `${cust}${sup}${dest}`;
        const values = predefinedValues[combinationId];

        if (!values) continue;

        // Create series for total submissions
        seriesArray.push({
          id: `${combinationId} - totalSubmission`,
          data: dates.map((x, i) => ({ x, y: values.total[i] })),
        });

        // Create series for submission success
        seriesArray.push({
          id: `${combinationId} - submissionSuccess`,
          data: dates.map((x, i) => ({ x, y: values.success[i] })),
        });
      }
    }
  }

  return seriesArray;
}
