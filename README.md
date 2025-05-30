# E2E Hub Summary Report Dashboard

A comprehensive React-based analytics dashboard for telecommunications data visualization and reporting.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:3000
```

## 📊 Features

### Summary Dashboard
- **Applied Filters Display**: View current query parameters and filters
- **Key Metrics**: Total submissions, success rates, delivery statistics
- **Data Export**: Download reports in JSON and CSV formats
- **SQL Query Context**: Reference to original database query

### Visualization Types
- Bar Charts, Line Charts, Heat Maps
- Multi-Axis Charts (Bar + Line combination)
- Pie Charts, Radial Bar Charts, Polar Bar Charts
- Scatter Plots, Sankey Diagrams, Stream Charts

## 🎯 Current Data Scope

**Time Range**: May 28, 2025 (00:00 - 12:00 Asia/Kolkata)

**Filtered Customers**: NEXMO INC, 12WE OPEW, 8x8 UK Limited, A.A. Smartcomtech USA LLC

**Customer Binds**: Nexmo P2P_CS, Nexmo A2P_CS_PM, 8x8_1_A2P_CS, Rv_12WEOPEW_HQ_SMPP_A2P_C_0, SmartCOMA2P

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1
- **Visualization**: Nivo Charts (@nivo/*)
- **Styling**: Tailwind CSS
- **Build Tool**: Create React App

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## 🎮 Usage Guide

1. **Navigate Charts**: Use tab navigation to switch between visualization types
2. **View Summary**: Click "Summary Dashboard" for overview and export options
3. **Export Data**:
   - JSON: Complete data structure with metadata
   - CSV: Tabular format for spreadsheet applications
4. **Interactive Charts**: Hover over data points for detailed information

## 📊 Original SQL Query

```sql
SELECT timestamp, customer_name, customer_bind, supplier, destination_operator_name,
       sum(total_submissions) as total_submissions,
       sum(submission_success),
       sum(delivery_failure_count_final),
       count_successful_delivery_final
FROM analytics_hub.day_e2e_hub_summary_report(timezone='Asia/Kolkata')
WHERE timestamp>='2025-05-28 00:00:00'
  AND timestamp<='2025-05-28 12:00:00'
  AND customer_name IN('NEXMO INC','12WE OPEW','8x8 UK Limited', 'A.A. Smartcomtech USA LLC')
  AND customer_bind IN ('Nexmo P2P_CS','Nexmo A2P_CS_PM','8x8_1_A2P_CS','Rv_12WEOPEW_HQ_SMPP_A2P_C_0','SmartCOMA2P')
GROUP BY all
ORDER BY timestamp
```

## 📈 Key Metrics

- **Total Submissions**: Complete submission count
- **Successful Submissions**: Successfully processed submissions
- **Delivery Failures**: Failed delivery attempts
- **Successful Deliveries**: Completed deliveries
- **Success Rates**: Calculated percentages for submissions and deliveries

## 📁 Project Structure

```
src/
├── components/
│   ├── SummaryDashboard.js     # Main dashboard with filters & export
│   ├── MultiAxisChart.js       # Combined bar/line charts
│   └── [other chart components]
├── utils/
│   ├── data5.json             # Main data with query metadata
│   └── dataGenerator.js       # Sample data generation
├── App.js                     # Main application
└── index.js                   # Entry point
```

For detailed documentation, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)

---

**Built with ❤️ using React and Nivo Charts**
