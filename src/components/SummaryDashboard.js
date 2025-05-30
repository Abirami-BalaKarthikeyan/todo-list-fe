import React, { useState, useEffect } from "react";
import data5 from "../utils/data5.json";

const SummaryDashboard = () => {
  const [summaryStats, setSummaryStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Calculate summary statistics
      const stats = calculateSummaryStats();
      setSummaryStats(stats);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const calculateSummaryStats = () => {
    if (!data5.data || !data5.data.y_axis) {
      return {};
    }

    const totalRecords = data5.data.y_axis.length;
    const totalSubmissions = data5.data.y_axis.reduce(
      (sum, item) => sum + (item.total_submissions || 0),
      0
    );
    const totalSuccessfulSubmissions = data5.data.y_axis.reduce(
      (sum, item) => sum + (item["sum(submission_success)"] || 0),
      0
    );
    const totalDeliveryFailures = data5.data.y_axis.reduce(
      (sum, item) => sum + (item["sum(delivery_failure_count_final)"] || 0),
      0
    );
    const totalSuccessfulDeliveries = data5.data.y_axis.reduce(
      (sum, item) => sum + (item.count_successful_delivery_final || 0),
      0
    );

    const successRate = totalSubmissions > 0
      ? ((totalSuccessfulSubmissions / totalSubmissions) * 100).toFixed(2)
      : 0;

    const deliverySuccessRate = totalSubmissions > 0
      ? ((totalSuccessfulDeliveries / totalSubmissions) * 100).toFixed(2)
      : 0;

    return {
      totalRecords,
      totalSubmissions,
      totalSuccessfulSubmissions,
      totalDeliveryFailures,
      totalSuccessfulDeliveries,
      successRate,
      deliverySuccessRate,
    };
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(data5, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `e2e_hub_summary_report_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Helper function to extract timestamp from x-axis string
  const extractTimestamp = (xAxisString) => {
    const parts = xAxisString.split("-");
    return parts.length > 0 ? parts[0] : xAxisString;
  };

  // Helper function to extract customer bind from x-axis string
  const extractCustomerBind = (xAxisString) => {
    const parts = xAxisString.split("-");
    return parts.length > 1 ? parts[1] : "Unknown";
  };

  // Helper function to extract supplier from x-axis string
  const extractSupplier = (xAxisString) => {
    const parts = xAxisString.split("-");
    return parts.length > 2 ? parts[2] : "Unknown";
  };

  // Helper function to extract destination from x-axis string
  const extractDestination = (xAxisString) => {
    const parts = xAxisString.split("-");
    return parts.length > 3 ? parts[3] : "Unknown";
  };

  const downloadCSV = () => {
    if (!data5.data || !data5.data.x_axis || !data5.data.y_axis) {
      alert('No data available for export');
      return;
    }

    // Create CSV headers with timestamp separated
    const headers = [
      'timestamp',
      'customer_bind',
      'supplier',
      'destination_operator_name',
      'total_submissions',
      'sum_submission_success',
      'sum_delivery_failure_count_final',
      'count_successful_delivery_final'
    ];

    // Create CSV rows
    const csvRows = [headers.join(',')];

    data5.data.x_axis.forEach((xItem, index) => {
      const xAxisKey = Object.keys(xItem)[0];
      const xAxisValue = xItem[xAxisKey];
      const yAxisData = data5.data.y_axis[index] || {};

      // Extract components from x-axis string
      const timestamp = extractTimestamp(xAxisValue);
      const customerBind = extractCustomerBind(xAxisValue);
      const supplier = extractSupplier(xAxisValue);
      const destination = extractDestination(xAxisValue);

      const row = [
        `"${timestamp}"`,
        `"${customerBind}"`,
        `"${supplier}"`,
        `"${destination}"`,
        yAxisData.total_submissions || 0,
        yAxisData["sum(submission_success)"] || 0,
        yAxisData["sum(delivery_failure_count_final)"] || 0,
        yAxisData.count_successful_delivery_final || 0
      ];

      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const exportFileDefaultName = `e2e_hub_summary_report_${new Date().toISOString().split('T')[0]}.csv`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading summary data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          E2E Hub Summary Report Dashboard
        </h2>
      </div>

      {/* Applied Filters Section */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Applied Filters</h3>

        {/* Time Range */}
        <div className="mb-4">
          <h4 className="font-medium text-blue-700 mb-2">Time Range:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Start:</span> {data5.query_info.timestamp_range.start}
            </div>
            <div>
              <span className="font-medium">End:</span> {data5.query_info.timestamp_range.end}
            </div>
            <div>
              <span className="font-medium">Timezone:</span> {data5.query_info.timestamp_range.timezone}
            </div>
          </div>
        </div>

        {/* Customer Names */}
        <div className="mb-4">
          <h4 className="font-medium text-blue-700 mb-2">Customer Names:</h4>
          <div className="flex flex-wrap gap-2">
            {data5.query_info.filters.customer_names.map((customer, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {customer}
              </span>
            ))}
          </div>
        </div>

        {/* Customer Binds */}
        <div className="mb-4">
          <h4 className="font-medium text-blue-700 mb-2">Customer Binds:</h4>
          <div className="flex flex-wrap gap-2">
            {data5.query_info.filters.customer_binds.map((bind, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {bind}
              </span>
            ))}
          </div>
        </div>

        {/* Selected Fields */}
        <div>
          <h4 className="font-medium text-blue-700 mb-2">Selected Fields:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {data5.query_info.selected_fields.map((field, index) => (
              <div key={index} className="text-gray-700">
                • {field}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="text-2xl font-bold text-gray-800">{summaryStats.totalRecords}</div>
            <div className="text-sm text-gray-600">Total Records</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border">
            <div className="text-2xl font-bold text-blue-800">{summaryStats.totalSubmissions}</div>
            <div className="text-sm text-blue-600">Total Submissions</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border">
            <div className="text-2xl font-bold text-green-800">{summaryStats.totalSuccessfulSubmissions}</div>
            <div className="text-sm text-green-600">Successful Submissions</div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border">
            <div className="text-2xl font-bold text-red-800">{summaryStats.totalDeliveryFailures}</div>
            <div className="text-sm text-red-600">Delivery Failures</div>
          </div>
        </div>

        {/* Success Rates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-yellow-50 rounded-lg border">
            <div className="text-2xl font-bold text-yellow-800">{summaryStats.successRate}%</div>
            <div className="text-sm text-yellow-600">Submission Success Rate</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border">
            <div className="text-2xl font-bold text-purple-800">{summaryStats.deliverySuccessRate}%</div>
            <div className="text-sm text-purple-600">Delivery Success Rate</div>
          </div>
        </div>
      </div>

      {/* Data Preview Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Preview (First 5 Records)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Timestamp
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Customer Bind
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Supplier
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Destination
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Total Submissions
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Success Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data5.data && data5.data.x_axis && data5.data.x_axis.slice(0, 5).map((xItem, index) => {
                const xAxisKey = Object.keys(xItem)[0];
                const xAxisValue = xItem[xAxisKey];
                const yAxisData = data5.data.y_axis[index] || {};

                const timestamp = extractTimestamp(xAxisValue);
                const customerBind = extractCustomerBind(xAxisValue);
                const supplier = extractSupplier(xAxisValue);
                const destination = extractDestination(xAxisValue);

                const totalSubmissions = yAxisData.total_submissions || 0;
                const successfulSubmissions = yAxisData["sum(submission_success)"] || 0;
                const successRate = totalSubmissions > 0 ? ((successfulSubmissions / totalSubmissions) * 100).toFixed(1) : 0;

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900 border-b">
                      {timestamp}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 border-b">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {customerBind}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 border-b">
                      {supplier.length > 20 ? `${supplier.substring(0, 20)}...` : supplier}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 border-b">
                      {destination.length > 15 ? `${destination.substring(0, 15)}...` : destination}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 border-b font-medium">
                      {totalSubmissions}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        successRate >= 90 ? 'bg-green-100 text-green-800' :
                        successRate >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {successRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Showing first 5 records. Download CSV for complete data with all {data5.data?.x_axis?.length || 0} records.
        </p>
      </div>

      {/* Timestamp Analysis Section */}
      <div className="mb-8">

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-yellow-800 mb-2">📝 Note: Timestamp-based Uniqueness</h4>
          <p className="text-sm text-yellow-700">
            Each record is uniquely identified with <strong>timestamp as the primary x-axis component</strong>, combined with customer_bind, supplier, and destination_operator_name as needed.
            This ensures no duplicate entries while allowing multiple records per timestamp for different customer-supplier-destination combinations. When a time range filter is applied, at least one additional x-axis component (like customer_bind or supplier) is required along with timestamp to avoid duplicates within that time range.
          </p>
        </div>
      </div>

      {/* Download Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Download Reports</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={downloadJSON}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download JSON
          </button>
          <button
            onClick={downloadCSV}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download CSV
          </button>
        </div>
      </div>

      {/* SQL Query Information */}
      <div className="p-4 bg-gray-50 rounded-lg border">
        <h4 className="font-medium text-gray-800 mb-2">Original SQL Query Context:</h4>
        <div className="text-sm text-gray-600 font-mono bg-white p-3 rounded border">
          <div>SELECT timestamp, customer_name, customer_bind, supplier, destination_operator_name,</div>
          <div>sum(total_submissions) as total_submissions, sum(submission_success),</div>
          <div>sum(delivery_failure_count_final), count_successful_delivery_final</div>
          <div>FROM analytics_hub.day_e2e_hub_summary_report(timezone='Asia/Kolkata')</div>
          <div>WHERE timestamp&gt;='2025-05-28 00:00:00' AND timestamp&lt;='2025-05-28 12:00:00'</div>
          <div>AND customer_name IN ('NEXMO INC', '12WE OPEW', '8x8 UK Limited', 'A.A. Smartcomtech USA LLC')</div>
          <div>AND customer_bind IN ('Nexmo P2P_CS', 'Nexmo A2P_CS_PM', '8x8_1_A2P_CS', 'Rv_12WEOPEW_HQ_SMPP_A2P_C_0', 'SmartCOMA2P')</div>
          <div>GROUP BY all ORDER BY timestamp</div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;
