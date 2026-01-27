import React from 'react';
import {
  AlertCircle,
  TrendingUp,
  CheckCircle,
  Users,
  Droplets,
  Shield,
  Activity,
  Target,
  Thermometer,
  DollarSign
} from 'lucide-react';

function StatsCards({ metrics, loading = false, scenario = {} }) {
  // Default metrics structure
  const defaultMetrics = {
    defecationEvents: 0,
    coverage: 0,
    status: 'No Data',
    totalAgents: 0,
    floodScenario: false,
    subsidyActive: false
  };

  const m = { ...defaultMetrics, ...metrics };

  // Calculate additional metrics
  const calculatedMetrics = {
    ...m,
    failureRate: m.totalAgents > 0 ? (m.defecationEvents / (m.totalAgents * 5) * 100).toFixed(1) : 0,
    effectiveCoverage: Math.max(0, Math.min(100, m.coverage))
  };

  const getStatusColor = (status) => {
    const statusLower = String(status || '').toLowerCase();
    if (statusLower.includes('critical') || statusLower.includes('high')) {
      return { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-600', border: 'border-red-200' };
    } else if (statusLower.includes('moderate') || statusLower.includes('medium')) {
      return { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-600', border: 'border-orange-200' };
    } else if (statusLower.includes('stable') || statusLower.includes('low')) {
      return { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-600', border: 'border-green-200' };
    }
    return { bg: 'bg-gray-50', text: 'text-gray-700', icon: 'text-gray-600', border: 'border-gray-200' };
  };

  const cards = [
    {
      id: 'od',
      title: 'Open Defecation Events',
      value: calculatedMetrics.defecationEvents,
      subtitle: 'Total sanitation failures',
      icon: AlertCircle,
      color: 'red',
      gradient: 'from-red-50 to-red-100',
      iconBg: 'bg-red-100',
      trend: '+12%',
      details: `${calculatedMetrics.failureRate}% failure rate`
    },
    {
      id: 'coverage',
      title: 'Sanitation Coverage',
      value: `${calculatedMetrics.effectiveCoverage.toFixed(1)}%`,
      subtitle: 'Population served',
      icon: Shield,
      color: 'green',
      gradient: 'from-green-50 to-emerald-100',
      iconBg: 'bg-green-100',
      trend: calculatedMetrics.effectiveCoverage > 70 ? 'Excellent' : 'Needs Improvement',
      details: `Target: 90%`
    },
    {
      id: 'status',
      title: 'System Status',
      value: calculatedMetrics.status,
      subtitle: 'Overall sanitation health',
      icon: CheckCircle,
      color: getStatusColor(calculatedMetrics.status).text.replace('text-', '').replace('-700', ''),
      gradient: getStatusColor(calculatedMetrics.status).bg.replace('bg-', '').replace('-50', ''),
      iconBg: getStatusColor(calculatedMetrics.status).bg.replace('bg-', 'bg-').replace('-50', '-100'),
      trend: 'Live',
      details: scenario.flood ? 'Flood conditions' : scenario.subsidy ? 'Subsidized' : 'Baseline'
    },
    {
      id: 'revenue',
      title: 'Projected Revenue',
      value: `KES ${m.revenue || 0}`,
      subtitle: 'Daily operational income',
      icon: DollarSign,
      color: 'amber',
      gradient: 'from-amber-50 to-orange-100',
      iconBg: 'bg-amber-100',
      trend: 'Projected',
      details: scenario.subsidy ? 'Subsidized Model' : 'Market Rate Model'
    },
    {
      id: 'population',
      title: 'Population Served',
      value: calculatedMetrics.totalAgents || 0,
      subtitle: 'Simulated residents',
      icon: Users,
      color: 'blue',
      gradient: 'from-blue-50 to-indigo-100',
      iconBg: 'bg-blue-100',
      trend: 'Active',
      details: scenario.agents ? `${scenario.agents} agents simulated` : 'No simulation'
    }
  ];

  // Special condition cards
  const conditionCards = [];

  if (scenario.flood) {
    conditionCards.push({
      id: 'flood',
      title: 'Flood Impact',
      value: '-60%',
      subtitle: 'Capacity reduction',
      icon: Droplets,
      color: 'purple',
      gradient: 'from-purple-50 to-violet-100',
      iconBg: 'bg-purple-100'
    });
  }

  if (scenario.subsidy) {
    conditionCards.push({
      id: 'subsidy',
      title: 'Subsidy Active',
      value: 'KES 0',
      subtitle: 'User fee',
      icon: TrendingUp,
      color: 'amber',
      gradient: 'from-amber-50 to-yellow-100',
      iconBg: 'bg-amber-100'
    });
  }

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-100 rounded-xl p-6 animate-pulse">
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-8 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            </div>
            <div className="h-3 bg-gray-300 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          const statusColors = getStatusColor(card.value);

          return (
            <div
              key={card.id}
              className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 border ${statusColors.border} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className={`text-3xl font-bold ${statusColors.text}`}>{card.value}</p>
                </div>
                <div className={`p-3 ${card.iconBg} rounded-xl shadow-inner`}>
                  <Icon className={`text-${card.color}-600`} size={24} />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-xs text-gray-500">{card.subtitle}</p>
                  <p className="text-xs font-medium text-gray-700 mt-1">{card.details}</p>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded-full ${card.id === 'status'
                  ? statusColors.bg.replace('bg-', 'bg-').replace('-50', '-100') + ' ' + statusColors.text
                  : 'bg-white/50 text-gray-700'
                  }`}>
                  {card.trend}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Condition Cards */}
      {conditionCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {conditionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`bg-gradient-to-br ${card.gradient} rounded-xl p-5 border ${card.color === 'purple' ? 'border-purple-200' : 'border-amber-200'} shadow-md`}
              >
                <div className="flex items-center">
                  <div className={`p-3 ${card.iconBg} rounded-lg mr-4`}>
                    <Icon className={`text-${card.color}-600`} size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{card.title}</p>
                    <p className="text-2xl font-bold mt-1">{card.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Performance Indicators */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Target size={20} className="mr-2 text-green-600" />
          Performance Indicators
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Failure Rate</div>
            <div className="text-2xl font-bold text-red-600">{calculatedMetrics.failureRate}%</div>
            <div className="text-xs text-gray-500 mt-2">
              {calculatedMetrics.failureRate > 20 ? '⚠️ Needs attention' : '✓ Within acceptable range'}
            </div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Coverage Level</div>
            <div className="text-2xl font-bold text-green-600">{calculatedMetrics.effectiveCoverage.toFixed(1)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${calculatedMetrics.effectiveCoverage}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Scenario Impact</div>
            <div className="text-2xl font-bold text-blue-600">
              {scenario.flood && scenario.subsidy ? 'High' :
                scenario.flood ? 'Medium' :
                  scenario.subsidy ? 'Low' : 'Baseline'}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {scenario.flood && '🌧️ Flood + '}
              {scenario.subsidy && '💰 Subsidy + '}
              {!scenario.flood && !scenario.subsidy && 'Standard conditions'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;