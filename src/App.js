import React, { Suspense, lazy, useState } from "react";
import { initializeDataJson, initializeDataJson2 } from "./utils/dataGenerator";

// Lazy load the components
const BarGraph = lazy(() => import("./components/BarGraph"));
const LineGraph = lazy(() => import("./components/LineGraph"));
const HeatMap = lazy(() => import("./components/HeatMap"));
// const TreeMap = lazy(() => import("./components/Treemap"));

function App() {
  const data = initializeDataJson();
  const sampleData = initializeDataJson2();
  const [activeTab, setActiveTab] = useState("bar"); // 'bar', 'line', or 'heat'
  console.log("Data:", data);

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
         {/* <button
          className={`px-4 py-2 rounded ${
            activeTab === "heat" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("treemap")}
        >
          Tree Map
        </button> */}
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
        {/* {activeTab === "treemap" && <TreeMap data={sampleData} />} */}
      </Suspense>
    </div>
  );
}

export default App;
