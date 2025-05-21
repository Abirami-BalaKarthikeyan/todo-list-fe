/**
 * Generates sample data with combinations of customers, suppliers, and destinations
 * @returns {Array} Array of series objects with id and data points
 */
export function initializeDataJson() {
  // const customers = ['cust1', 'cust2', 'cust3', 'cust4', 'cust5'];
  // const suppliers = ['sup1', 'sup2', 'sup3', 'sup4', 'sup5'];
  // const destinations = ['dest1', 'dest2', 'dest3', 'dest4', 'dest5'];

   // const dates = [
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

  const customers = ["cust1", "cust2"];
  const suppliers = ["sup1", "sup2"];
  const destinations = ["dest1", "dest2"];

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

