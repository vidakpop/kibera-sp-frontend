import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StatsCards from './components/StatsCard';
import SimulationChart from './components/SimulationChart';
import MapView from './components/MapView';
import { fetchOptimization, runSimulation } from './api';
import { Loader2 } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [simulationHistory, setSimulationHistory] = useState([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    defecationEvents: 0,
    coverage: 0,
    status: 'Stable'
  });
  const [toiletLocations, setToiletLocations] = useState({
    existing: [],
    proposed: []
  });
  const [simParams, setSimParams] = useState({
    agents: 500,
    flood: false,
    subsidy: false,
    steps: 100
  });

  useEffect(() => {
    loadOptimization();
  }, []);

  const loadOptimization = async () => {
    try {
      const data = await fetchOptimization();

      if (data) {
        setToiletLocations(prev => ({
          ...prev,
          proposed: data.proposed_locations || [],
          existing: data.existing_toilets || []
        }));
      }
    } catch (error) {
      console.error('Failed to load optimization:', error);
    }
  };

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const result = await runSimulation(simParams);

      const newMetrics = {
        defecationEvents: result.total_od_events || 0,
        coverage: result.coverage || 0,
        revenue: result.revenue || 0,
        status: result.status || 'Unknown'
      };

      setCurrentMetrics(newMetrics);

      // Transform history array for Recharts
      if (result.history) {
        setSimulationHistory(result.history);
      }

      if (result.existing_toilets) {
        setToiletLocations(prev => ({
          ...prev,
          existing: result.existing_toilets
        }));
      }
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParamChange = (key, value) => {
    setSimParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        params={simParams}
        onParamChange={handleParamChange}
        onRunSimulation={handleRunSimulation}
        loading={loading}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Kibera Sanitation Intelligence Platform
          </h1>
          <p className="text-gray-600 mt-1 flex items-center">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">AI POWERED</span>
            Spatial AI & Predictive Modelling for Business Sustainability
          </p>
        </header>

        <StatsCards metrics={currentMetrics} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Simulation History
            </h2>
            {simulationHistory.length > 0 ? (
              <SimulationChart data={simulationHistory} />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                Run a simulation to see results
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Sanitation Infrastructure Map
            </h2>
            <MapView
              existingToilets={toiletLocations.existing}
              proposedToilets={toiletLocations.proposed}
            />
          </div>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <Loader2 className="animate-spin text-green-600" size={24} />
              <span className="text-gray-700">Running simulation...</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;