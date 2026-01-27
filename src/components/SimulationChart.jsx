import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Area, AreaChart, BarChart, Bar 
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Zap, Info } from 'lucide-react';

function SimulationChart({ data, loading = false, simulationType = 'aggregate' }) {
  const [chartType, setChartType] = useState('line');
  const [showTrend, setShowTrend] = useState(true);
  
  // Process data for different chart types
  const processData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) {
      return [];
    }
    
    if (simulationType === 'aggregate') {
      // For aggregate simulation: history is array of cumulative OD events
      return rawData.map((value, index) => ({
        step: index + 1,
        odEvents: value,
        cumulativeOD: value,
        incrementalOD: index === 0 ? value : value - rawData[index - 1]
      }));
    } else {
      // For detailed simulation: data should already be formatted
      return rawData.map((item, index) => ({
        step: index + 1,
        ...item
      }));
    }
  };

  const chartData = processData(data);
  
  // Calculate statistics
  const stats = chartData.length > 0 ? {
    totalEvents: chartData[chartData.length - 1]?.odEvents || 0,
    maxEvents: Math.max(...chartData.map(d => d.odEvents || 0)),
    avgEvents: chartData.reduce((sum, d) => sum + (d.odEvents || 0), 0) / chartData.length,
    trend: chartData.length > 1 
      ? chartData[chartData.length - 1].odEvents - chartData[0].odEvents 
      : 0
  } : null;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-200">
          <p className="font-bold text-gray-900 mb-2">Step {label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.dataKey}:</span>
              </div>
              <span className="font-bold ml-4" style={{ color: entry.color }}>
                {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full h-[350px] bg-gray-50 rounded-xl animate-pulse flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-pulse" />
          <div className="text-gray-400 font-medium">Loading simulation data...</div>
        </div>
      </div>
    );
  }

  // Empty state
  if (chartData.length === 0) {
    return (
      <div className="w-full h-[350px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-8">
        <Zap className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">No Simulation Data</h3>
        <p className="text-gray-500 text-center mb-6">
          Run a simulation to see sanitation performance over time
        </p>
        <div className="flex items-center text-sm text-gray-600 bg-white/70 px-4 py-2 rounded-lg">
          <Info size={16} className="mr-2" />
          <span>Simulation will show Open Defecation events over 50 time steps</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Chart Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Activity className="mr-3 text-green-600" size={24} />
              Sanitation Performance Over Time
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {simulationType === 'aggregate' ? 'Aggregate Simulation (50 steps)' : 'Detailed Agent Simulation'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Chart Type Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['line', 'area', 'bar'].map(type => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-3 py-1 text-sm font-medium rounded-md capitalize transition-all ${
                    chartType === type 
                      ? 'bg-white text-green-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            
            {/* Trend Toggle */}
            <button
              onClick={() => setShowTrend(!showTrend)}
              className={`px-3 py-1 text-sm font-medium rounded-lg transition-all flex items-center ${
                showTrend 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {showTrend ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
              Trend
            </button>
          </div>
        </div>
        
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xs text-blue-600 font-medium">Total Events</div>
              <div className="text-2xl font-bold text-blue-700">{stats.totalEvents}</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-xs text-red-600 font-medium">Peak Events</div>
              <div className="text-2xl font-bold text-red-700">{stats.maxEvents}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-xs text-green-600 font-medium">Average</div>
              <div className="text-2xl font-bold text-green-700">{stats.avgEvents.toFixed(1)}</div>
            </div>
            <div className={`p-3 rounded-lg ${stats.trend >= 0 ? 'bg-orange-50' : 'bg-green-50'}`}>
              <div className="text-xs text-gray-600 font-medium">Trend</div>
              <div className={`text-2xl font-bold flex items-center ${stats.trend >= 0 ? 'text-orange-700' : 'text-green-700'}`}>
                {stats.trend >= 0 ? '+' : ''}{stats.trend.toFixed(1)}
                {stats.trend >= 0 ? <TrendingUp size={20} className="ml-2" /> : <TrendingDown size={20} className="ml-2" />}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="p-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="step"
                  label={{ value: 'Time Steps', position: 'insideBottom', offset: -5 }}
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  label={{ 
                    value: 'Open Defecation Events', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: 10
                  }}
                  stroke="#ef4444"
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={10}
                />
                <Line
                  type="monotone"
                  dataKey="odEvents"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Open Defecation Events"
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                />
                {showTrend && (
                  <Line
                    type="monotone"
                    dataKey="cumulativeOD"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Cumulative Total"
                    dot={false}
                  />
                )}
              </LineChart>
            ) : chartType === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="step"
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#ef4444"
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="odEvents"
                  stroke="#ef4444"
                  fill="#fecaca"
                  fillOpacity={0.6}
                  name="Open Defecation Events"
                />
              </AreaChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="step"
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#ef4444"
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="odEvents"
                  fill="#ef4444"
                  name="Open Defecation Events"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="incrementalOD"
                  fill="#8b5cf6"
                  name="Daily Increase"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Chart Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Open Defecation Events</span>
              </div>
              {chartType === 'line' && showTrend && (
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span>Cumulative Trend</span>
                </div>
              )}
            </div>
            <div className="text-xs bg-gray-100 px-3 py-1 rounded-full">
              {simulationType === 'aggregate' 
                ? '50 time steps simulated • Each step = 1 simulation hour' 
                : 'Agent-based simulation • Each step = 1 simulation day'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimulationChart;