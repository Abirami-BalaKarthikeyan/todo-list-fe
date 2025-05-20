import React from "react";
import "./App.css";
import SubmissionBarChart from "./components/SubmissionBarChart";
import SubmissionLineChart from "./components/SubmissionLineChart";
import SubmissionTreeChart from "./components/SubmissionTreeChart";
import SubmissionBoxPlot from "./components/SubmissionBoxPlot";
import SubmissionAreaBump from "./components/SubmissionAreaBump";
import SubmissionCirclePacking from "./components/SubmissionCirclePacking";
import SubmissionChordChart from "./components/SubmissionChordChart";
import SubmissionMultiLineChart from "./components/SubmissionMultiLineChart";
import SubmissionStackedBarChart from "./components/SubmissionStackedBarChart";
import SubmissionGroupedBarChart from "./components/SubmissionGroupedBarChart";
import SubmissionHeatmap from "./components/SubmissionHeatmap";
import SubmissionDonutChart from "./components/SubmissionDonutChart";
import SubmissionRadarChart from "./components/SubmissionRadarChart";
import SubmissionAreaChart from "./components/SubmissionAreaChart";
import SubmissionColumnChart from "./components/SubmissionColumnChart";
import { generateCombinationData } from "./generateData";

function App() {
  const data = generateCombinationData();
  return (
    <div className="App">
      <header className="App-header">
        <h1>Submission Data Visualization</h1>
      </header>
      <main>
        {/* <h2>1. Multi-Line Chart</h2>
        <SubmissionMultiLineChart data={data} /> */}

        <h2>2. Stacked Bar Chart</h2>
        <SubmissionStackedBarChart data={data} />

        {/*  <h2>3. Grouped Bar Chart</h2>
        <SubmissionGroupedBarChart data={data} />

        <h2>4. Heatmap</h2>
        <SubmissionHeatmap data={data} />

        <h2>5. Donut Chart</h2>
        <SubmissionDonutChart data={data} />

        <h2>6. Radar Chart</h2>
        <SubmissionRadarChart data={data} />

        <h2>7. Area Chart</h2>
        <SubmissionAreaChart data={data} />

        <h2>8. Column Chart</h2>
        <SubmissionColumnChart data={data} /> */}

        {/* Original charts */}
        {/* <h2>Circle Packing Chart</h2>
        <SubmissionCirclePacking data={data} />

        <h2>Area Bump Chart</h2>
        <SubmissionAreaBump data={data} />

        <h2>Bar Chart</h2>
        <SubmissionBarChart data={data} />

        <h2>Line Chart</h2>
        <SubmissionLineChart data={data} />

        <h2>Tree Chart</h2>
        <SubmissionTreeChart data={data} />

        <h2>Box Plot</h2>
        <SubmissionBoxPlot data={data} /> */}
      </main>
    </div>
  );
}

export default App;
