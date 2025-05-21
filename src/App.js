import React, { Suspense, lazy, useState } from "react";
import { initializeDataJson, initializeDataJson2 } from "./utils/dataGenerator";

// Lazy load the components
const BarGraph = lazy(() => import("./components/BarGraph"));
const LineGraph = lazy(() => import("./components/LineGraph"));
const HeatMap = lazy(() => import("./components/HeatMap"));
const ScatterPlot = lazy(() => import("./components/ScatterPlot"));
const SankeyChart = lazy(() => import("./components/SankeyChart"));
const StreamChart = lazy(() => import("./components/StreamChart"));
const PieChart = lazy(() => import("./components/PieChart"));
const RadialBarChart = lazy(() => import("./components/RadialBarChart"));

function App() {
  const data = initializeDataJson();
  const sampleData = initializeDataJson2();
  const [activeTab, setActiveTab] = useState("bar"); // 'bar', 'line', or 'heat'

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Data Visualization Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "bar" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("bar")}
        >
          Bar Graph
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "line" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("line")}
        >
          Line Graph
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "heat" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("heat")}
        >
          Heat Map
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "scatter" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("scatter")}
        >
          Scatter Plot
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "sankey" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("sankey")}
        >
          Sankey Chart
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "stream" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("stream")}
        >
          Stream Chart
        </button>

        <button
          className={`px-4 py-2 rounded ${
            activeTab === "pie" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("pie")}
        >
          Pie Chart
        </button>
     
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "radial" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("radial")}
        >
          Radial Bar Chart
        </button>
      </div>

      {/* Chart display */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">
              Loading chart component...
            </div>
          </div>
        }
      >
        {activeTab === "bar" && <BarGraph data={data} />}
        {activeTab === "line" && <LineGraph data={data} />}
        {activeTab === "heat" && <HeatMap data={sampleData} />}
        {activeTab === "scatter" && <ScatterPlot data={data} />}
        {activeTab === "sankey" && <SankeyChart data={data} />}
        {activeTab === "stream" && <StreamChart data={data} />}
        {activeTab === "pie" && <PieChart data={data} />}
        {activeTab === "radial" && <RadialBarChart data={data} />}

      </Suspense>
    </div>
  );
}

export default App;
