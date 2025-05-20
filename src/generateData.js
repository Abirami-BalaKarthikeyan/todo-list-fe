export function generateCombinationData() {
  const customers = [
    "cust1",
    "cust2",
    "cust3",
   
  ];
  const suppliers = [
    "sup1",
    "sup2",
    "sup3"
  ];
  const destinations = [
    "dest1",
    "dest2",
    "dest3",
    
  ];

  const result = [];

  // Generate all combinations with varied values
  for (const customer of customers) {
    for (const supplier of suppliers) {
      for (const destination of destinations) {
        // Generate random variations for each combination
        const custIndex = parseInt(customer.replace("cust", ""));
        const supIndex = parseInt(supplier.replace("sup", ""));
        const destIndex = parseInt(destination.replace("dest", ""));

        // Base values that will be modified
        const baseTotal = 85;
        const baseSuccess = 80;

        // Create variation based on indices
        const variation1 = custIndex * 5 + supIndex * 3 + destIndex * 2;
        const variation2 = custIndex * 4 + supIndex * 4 + destIndex * 3;

        const values = [
          {
            date: "12/04/2005",
            totalSubmission: baseTotal + variation1,
            submissionSuccess: baseSuccess + variation1 - 5,
          },
          {
            date: "13/04/2005",
            totalSubmission: baseTotal + variation2 + 5,
            submissionSuccess: baseSuccess + variation2,
          },
        ];

        result.push({
          customer: customer,
          supplier: supplier,
          destination: destination,
          values: values,
        });
      }
    }
  }

  return result;
}

// Generate the data
const combinationData = generateCombinationData();

// Output the data (in a real scenario, you might want to write this to a file)
console.log(JSON.stringify(combinationData, null, 2));

// Example usage to save to a file (Node.js environment)
// const fs = require('fs');
// fs.writeFileSync('data.json', JSON.stringify(combinationData, null, 2));
