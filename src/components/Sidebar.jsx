import React, { useState, useEffect } from 'react';
import {
  Play,
  Settings,
  Zap,
  AlertTriangle,
  DollarSign,
  Users,
  CloudRain,
  TrendingUp,
  RefreshCw,
  MapPin,
  BarChart3
} from 'lucide-react';

function Sidebar({
  params,
  onParamChange,
  onRunSimulation,
  onRunOptimization,
  loading,
  optimizationLoading,
  simulationStats,
  mapStats
}) {
  const [activeTab, setActiveTab] = useState('simulation');
  const [presetScenarios, setPresetScenarios] = useState([
    { id: 'baseline', name: 'Baseline', agents: 500, subsidy: false, flood: false },
    { id: 'flood', name: 'Flood Impact', agents: 500, subsidy: false, flood: true },
    { id: 'subsidized', name: 'Subsidized', agents: 500, subsidy: true, flood: false },
    { id: 'high-density', name: 'High Density', agents: 1000, subsidy: false, flood: false }
  ]);

  // Load saved parameters from localStorage
  useEffect(() => {
    const savedParams = localStorage.getItem('kibera-simulation-params');
    if (savedParams) {
      const parsed = JSON.parse(savedParams);
      Object.keys(parsed).forEach(key => {
        if (params[key] !== undefined) {
          onParamChange(key, parsed[key]);
        }
      });
    }
  }, []);

  // Save parameters to localStorage
  const savePreset = () => {
    localStorage.setItem('kibera-simulation-params', JSON.stringify(params));
    // Show success notification (you can add toast notifications)
    alert('Parameters saved as preset!');
  };

  const loadPreset = (preset) => {
    onParamChange('agents', preset.agents);
    onParamChange('subsidy', preset.subsidy);
    onParamChange('flood', preset.flood);
  };

  const getScenarioImpact = () => {
    if (params.flood && params.subsidy) return 'High Impact';
    if (params.flood) return 'Flood Impact';
    if (params.subsidy) return 'Subsidized';
    return 'Baseline';
  };

  return (
    <aside className="w-80 bg-gradient-to-b from-gray-50 to-white shadow-xl border-r border-gray-200 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
            <Settings className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">K-SISP Control Panel</h2>
            <p className="text-xs text-gray-500">Kibera Sanitation Intelligence</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            v3.0.0
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('simulation')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${activeTab === 'simulation'
            ? 'bg-white text-green-700 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'}`}
        >
          <div className="flex items-center justify-center space-x-2">
            <BarChart3 size={16} />
            <span>Simulation</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('optimization')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${activeTab === 'optimization'
            ? 'bg-white text-green-700 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'}`}
        >
          <div className="flex items-center justify-center space-x-2">
            <MapPin size={16} />
            <span>Optimization</span>
          </div>
        </button>
      </div>

      {/* Simulation Tab */}
      {activeTab === 'simulation' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Scenario Presets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                <Zap size={14} className="mr-2 text-green-600" />
                Quick Scenarios
              </h3>
              <button
                onClick={savePreset}
                className="text-xs text-green-600 hover:text-green-800 font-medium"
              >
                Save Current
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {presetScenarios.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => loadPreset(preset)}
                  className={`p-3 rounded-lg border text-left transition-all ${params.agents === preset.agents &&
                      params.subsidy === preset.subsidy &&
                      params.flood === preset.flood
                      ? 'bg-green-50 border-green-300 shadow-inner'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  <div className="text-xs font-medium text-gray-800">{preset.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {preset.agents} agents
                    {preset.flood && ' • Flood'}
                    {preset.subsidy && ' • Subsidy'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Population Control */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Users size={16} className="mr-2 text-blue-600" />
                Population Density
              </label>
              <div className="text-lg font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                {params.agents}
              </div>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={params.agents}
              onChange={(e) => onParamChange('agents', parseInt(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-blue-100 to-blue-300 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Low (100)</span>
              <span className="font-medium">Agents</span>
              <span>High (2000)</span>
            </div>
            <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded">
              Represents the number of simulated residents in Kibera
            </div>
          </div>

          {/* Scenario Toggles */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CloudRain size={16} className="mr-2 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Flood Scenario</div>
                    <div className="text-xs text-gray-500">Simulate heavy rainfall impact</div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={params.flood}
                    onChange={(e) => onParamChange('flood', e.target.checked)}
                    className="sr-only peer"
                    id="flood-toggle"
                  />
                  <label
                    htmlFor="flood-toggle"
                    className="w-12 h-6 bg-gray-300 peer-checked:bg-purple-600 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-md cursor-pointer"
                  ></label>
                </div>
              </div>
              {params.flood && (
                <div className="mt-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center text-xs text-purple-700">
                    <AlertTriangle size={12} className="mr-1" />
                    <span>Flood reduces sanitation capacity by 60%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign size={16} className="mr-2 text-amber-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Subsidized Pricing Model</div>
                    <div className="text-xs text-gray-500">Enable user fee subsidies</div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={params.subsidy}
                    onChange={(e) => onParamChange('subsidy', e.target.checked)}
                    className="sr-only peer"
                    id="subsidy-toggle"
                  />
                  <label
                    htmlFor="subsidy-toggle"
                    className="w-12 h-6 bg-gray-300 peer-checked:bg-amber-500 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-md cursor-pointer"
                  ></label>
                </div>
              </div>
              {params.subsidy && (
                <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center text-xs text-amber-700">
                    <TrendingUp size={12} className="mr-1" />
                    <span>Subsidy reduces open defecation by 83%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scenario Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <div className="text-sm font-semibold text-green-800 mb-2">Scenario Summary</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Impact Level:</span>
                <span className="font-bold text-green-700">{getScenarioImpact()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Population:</span>
                <span className="font-bold text-blue-700">{params.agents} residents</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Toilet Fee:</span>
                <span className="font-bold text-amber-700">
                  {params.subsidy ? 'KES 0 (Subsidized)' : 'KES 5 (Regular)'}
                </span>
              </div>
            </div>
          </div>

          {/* Run Simulation Button */}
          <button
            onClick={onRunSimulation}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                <span>Running Simulation...</span>
              </>
            ) : (
              <>
                <Play size={20} />
                <span className="text-lg">Run Sanitation Simulation</span>
              </>
            )}
          </button>

          {/* Stats Preview */}
          {simulationStats && (
            <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="text-sm font-semibold text-gray-700 mb-2">Last Simulation</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">{simulationStats.odEvents || 0}</div>
                  <div className="text-xs text-gray-600">OD Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">{simulationStats.coverage?.toFixed(1) || 0}%</div>
                  <div className="text-xs text-gray-600">Coverage</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optimization Tab */}
      {activeTab === 'optimization' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-start">
              <MapPin className="text-blue-600 mt-1 mr-3" size={20} />
              <div>
                <div className="text-sm font-semibold text-blue-800 mb-1">Spatial Optimization</div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Analyze OpenStreetMap data to identify sanitation deserts and recommend optimal locations for new facilities.
                </p>
              </div>
            </div>
          </div>

          {/* Map Stats */}
          {mapStats && (
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-sm font-semibold text-gray-700 mb-3">Current Data Status</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Existing Toilets:</span>
                  <span className="font-bold text-green-700">{mapStats.existingToilets || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Network Nodes:</span>
                  <span className="font-bold text-blue-700">{mapStats.graphNodes || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rivers/Streams:</span>
                  <span className="font-bold text-cyan-700">{mapStats.riversCount || 0}</span>
                </div>
              </div>
            </div>
          )}

          {/* Optimization Controls */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-sm font-semibold text-gray-700 mb-3">Optimization Settings</div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Number of Proposed Locations</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => onParamChange('numLocations', num)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${params.numLocations === num
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-gray-700">Include Flood Zones</div>
                  <div className="text-xs text-gray-500">Avoid flood-prone areas</div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={params.avoidFloodZones || false}
                    onChange={(e) => onParamChange('avoidFloodZones', e.target.checked)}
                    className="sr-only peer"
                    id="flood-zones-toggle"
                  />
                  <label
                    htmlFor="flood-zones-toggle"
                    className="w-12 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-md cursor-pointer"
                  ></label>
                </div>
              </label>
            </div>

            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
              <div className="font-medium mb-1">Algorithm Details:</div>
              <ul className="list-disc list-inside space-y-1">
                <li>Uses OSM walking network data</li>
                <li>Maximizes distance from existing facilities</li>
                <li>Considers population density patterns</li>
                <li>Generates interactive map with results</li>
              </ul>
            </div>
          </div>

          {/* Run Optimization Button */}
          <button
            onClick={onRunOptimization}
            disabled={optimizationLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
          >
            {optimizationLoading ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                <span>Optimizing...</span>
              </>
            ) : (
              <>
                <Zap size={20} />
                <span className="text-lg">Run Spatial Optimization</span>
              </>
            )}
          </button>

          {/* Optimization Tips */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <div className="flex items-start">
              <AlertTriangle className="text-amber-600 mt-1 mr-3" size={18} />
              <div>
                <div className="text-sm font-semibold text-amber-800 mb-1">Pro Tips</div>
                <ul className="text-xs text-amber-700 space-y-1">
                  <li>• Optimization takes 10-30 seconds to complete</li>
                  <li>• Results include interactive map with satellite view</li>
                  <li>• Generated map can be opened in new tab</li>
                  <li>• Data is cached for faster subsequent runs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-center text-xs text-gray-500">
          <p>Kibera Sanitation Intelligence Platform v3</p>
          <p className="mt-1">Backend: {loading || optimizationLoading ? 'Processing...' : 'Ready'}</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;