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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    E2E Hub Summary Report
                  </h1>
                  
                </div>
            </div>
           
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Applied Filters Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              Applied Filters
            </h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Time Range */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Time Range
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Start</span>
                  <div className="font-medium text-gray-900">{data5.query_info.timestamp_range.start}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">End</span>
                  <div className="font-medium text-gray-900">{data5.query_info.timestamp_range.end}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Timezone</span>
                  <div className="font-medium text-gray-900">{data5.query_info.timestamp_range.timezone}</div>
                </div>
              </div>
            </div>

            {/* Customer Names */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Customer Names ({data5.query_info.filters.customer_names.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {data5.query_info.filters.customer_names.map((customer, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white text-green-800 rounded-full text-sm font-medium border border-green-200 shadow-sm"
                  >
                    {customer}
                  </span>
                ))}
              </div>
            </div>

            {/* Customer Binds */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Customer Binds ({data5.query_info.filters.customer_binds.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {data5.query_info.filters.customer_binds.map((bind, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white text-purple-800 rounded-full text-sm font-medium border border-purple-200 shadow-sm"
                  >
                    {bind}
                  </span>
                ))}
              </div>
            </div>

            {/* Selected Fields */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Selected Fields ({data5.query_info.selected_fields.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {data5.query_info.selected_fields.map((field, index) => (
                  <div key={index} className="text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-100">
                    • {field}
                  </div>
                ))}
              </div>
            </div>

            {/* Available X-Axis Fields */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                Available X-Axis Fields (38 Dimensions)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs max-h-48 overflow-y-auto">
                {[
                  'timestamp', 'customer_name', 'customer_bind', 'status', 'supplier', 'supplier_bind',
                  'destination_country_name', 'destination_operator_name', 'source_operator_code',
                  'source_operator_name', 'destination_operator_code', 'lcr_name', 'source_mcc',
                  'source_mnc', 'source_country_code', 'source_country_name', 'source_protocol',
                  'visiting_operator', 'visiting_operator_id', 'destination_protocol',
                  'customer_interconnect', 'supplier_interconnect', 'src_hub', 'dest_hub',
                  'supplier_system_id', 'customer_system_id', 'spec_lcr', 'customer_kam',
                  'supplier_kam', 'source_mnp_supplier', 'destination_mnp_supplier',
                  'final_operator_name', 'destination_mnc_final', 'destination_mcc_final',
                  'supplier_billing_logic', 'customer_billing_logic', 'traffic_type_customer',
                  'traffic_type_supplier'
                ].map((field, index) => (
                  <div key={index} className="text-blue-800 bg-white px-2 py-1 rounded text-center border border-blue-100 font-mono">
                    {field}
                  </div>
                ))}
              </div>
            </div>

            {/* Available Y-Axis Fields */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Available Y-Axis Fields (12 Metrics)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {[
                  'total_submissions', 'submission_success', 'submission_efficiency', 'total_deliveries',
                  'next_hop_success_new', 'next_hop_success_percent_final', 'delivery_failure_count_final',
                  'count_successful_delivery_final', 'final_delivery_efficiency', 'percentage_failure',
                  'percentage_successful', 'submission_error'
                ].map((field, index) => (
                  <div key={index} className="text-green-800 bg-white px-2 py-1 rounded text-center border border-green-100 font-mono">
                    {field}
                  </div>
                ))}
              </div>
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
    </div>

  );
};

export default SummaryDashboard;
