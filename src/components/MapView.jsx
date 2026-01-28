import React, { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Layers, RefreshCw } from 'lucide-react';

function MapView({ existingToilets, proposedToilets, isLoading = false }) {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showSatellite, setShowSatellite] = useState(true);
  const [mapUrl, setMapUrl] = useState(null);
  const [mapGenerated, setMapGenerated] = useState(false);

  // Kibera bounds - slightly expanded for better view
  const minLat = -1.322;
  const maxLat = -1.308;
  const minLon = 36.783;
  const maxLon = 36.797;

  // Fetch the generated map from backend
  useEffect(() => {
    const fetchMap = async () => {
      try {
        const response = await fetch('/api/map');
        if (response.ok) {
          setMapUrl('/api/map');
          setMapGenerated(true);
        }
      } catch (error) {
        console.log('No generated map available yet');
      }
    };

    fetchMap();

    // Try every 30 seconds to see if map is generated
    const interval = setInterval(fetchMap, 30000);
    return () => clearInterval(interval);
  }, []);

  const latToY = (lat) => {
    return ((maxLat - lat) / (maxLat - minLat)) * 100;
  };

  const lonToX = (lon) => {
    return ((lon - minLon) / (maxLon - minLon)) * 100;
  };

  const openGeneratedMap = () => {
    if (mapUrl) {
      window.open(mapUrl, '_blank');
    }
  };

  const regenerateMap = async () => {
    try {
      // Trigger optimization to regenerate map
      const response = await fetch('/api/optimize');
      if (response.ok) {
        setMapGenerated(true);
        setTimeout(() => {
          setMapUrl('/api/map?t=' + Date.now()); // Cache bust
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to regenerate map:', error);
    }
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg">
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-green-600 px-4 py-2 flex justify-between items-center z-20">
        <div className="text-white">
          <div className="font-bold text-lg">Kibera Sanitation Infrastructure</div>
          <div className="text-sm opacity-90">Nairobi, Kenya • OpenStreetMap Data</div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSatellite(!showSatellite)}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-sm transition-colors"
          >
            <Layers size={16} />
            <span>{showSatellite ? 'Satellite' : 'Street'}</span>
          </button>

          {mapGenerated && (
            <button
              onClick={openGeneratedMap}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-sm transition-colors"
            >
              <ExternalLink size={16} />
              <span>Open Full Map</span>
            </button>
          )}

          <button
            onClick={regenerateMap}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-sm transition-colors"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="absolute inset-0 top-12">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
            <div className="bg-white p-6 rounded-xl shadow-2xl text-center">
              <RefreshCw size={48} className="mx-auto mb-4 animate-spin text-blue-600" />
              <div className="font-bold text-gray-700">Generating Map...</div>
              <div className="text-sm text-gray-500 mt-1">Fetching OSM data and optimizing locations</div>
            </div>
          </div>
        )}

        {/* Background with satellite/street view effect */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${showSatellite
            ? 'bg-[url("https://tile.openstreetmap.org/16/56020/38241.png")] bg-cover bg-center opacity-40'
            : 'bg-gradient-to-br from-green-100 via-blue-50 to-yellow-50'
            }`}
        >
          {/* Grid lines for visual reference */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            {[...Array(10)].map((_, i) => (
              <React.Fragment key={i}>
                <line
                  x1={`${i * 10}%`}
                  y1="0"
                  x2={`${i * 10}%`}
                  y2="100%"
                  stroke="#000"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
                <line
                  x1="0"
                  y1={`${i * 10}%`}
                  x2="100%"
                  y2={`${i * 10}%`}
                  stroke="#000"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              </React.Fragment>
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-gray-200 z-10">
          <div className="font-bold text-gray-800 mb-2 text-sm">Map Legend</div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-600 rounded-full border-2 border-white shadow"></div>
              <span className="text-sm text-gray-700">Existing Toilets ({existingToilets.length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-600 rounded-full border-2 border-white shadow flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-sm text-gray-700">Proposed Locations ({proposedToilets.length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500 rounded-sm bg-blue-100/50"></div>
              <span className="text-sm text-gray-700">Study Area</span>
            </div>
          </div>
        </div>

        {/* Study Area Boundary */}
        <div className="absolute border-2 border-blue-500 border-dashed rounded-sm bg-blue-50/20"
          style={{
            left: '5%',
            top: '5%',
            width: '90%',
            height: '90%'
          }}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap">
            Kibera Study Area
          </div>
        </div>

        {/* Existing Toilets (Green) */}
        {existingToilets.map((toilet, idx) => {
          const x = lonToX(toilet.lon);
          const y = latToY(toilet.lat);
          const isSelected = selectedMarker === `existing-${idx}`;
          const isInBounds = x >= 0 && x <= 100 && y >= 0 && y <= 100;

          if (!isInBounds) return null;

          return (
            <div
              key={`existing-${idx}`}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => setSelectedMarker(isSelected ? null : `existing-${idx}`)}
              onMouseEnter={() => setSelectedMarker(`existing-${idx}`)}
              onMouseLeave={() => setSelectedMarker(null)}
            >
              <div className="relative">
                <div className="w-5 h-5 bg-green-600 rounded-full border-3 border-white shadow-lg hover:scale-125 transition-all duration-200 hover:shadow-xl flex items-center justify-center group">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Toilet #{idx + 1}
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-4 py-3 rounded-xl shadow-2xl text-sm min-w-[200px] z-20 border border-gray-200 animate-pulse-slow">
                    <div className="font-bold text-green-700 mb-1 flex items-center">
                      <MapPin size={14} className="mr-2" />
                      Existing Toilet Facility
                    </div>
                    <div className="text-xs text-gray-500 mb-2">OSM ID: {toilet.node_id || `T-${idx}`}</div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Latitude:</span>
                        <span className="font-mono">{toilet.lat?.toFixed(6) || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Longitude:</span>
                        <span className="font-mono">{toilet.lon?.toFixed(6) || 'N/A'}</span>
                      </div>
                      {toilet.amenity && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">{toilet.amenity}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Proposed Toilets (Red) */}
        {proposedToilets.map((toilet, idx) => {
          const x = lonToX(toilet.lon);
          const y = latToY(toilet.lat);
          const isSelected = selectedMarker === `proposed-${idx}`;
          const isInBounds = x >= 0 && x <= 100 && y >= 0 && y <= 100;

          if (!isInBounds) return null;

          return (
            <div
              key={`proposed-${idx}`}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => setSelectedMarker(isSelected ? null : `proposed-${idx}`)}
              onMouseEnter={() => setSelectedMarker(`proposed-${idx}`)}
              onMouseLeave={() => setSelectedMarker(null)}
            >
              <div className="relative">
                <div className="w-7 h-7 bg-gradient-to-br from-red-600 to-red-500 rounded-full border-3 border-white shadow-lg hover:scale-125 transition-all duration-200 hover:shadow-xl flex items-center justify-center group animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Proposed #{idx + 1}
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white px-4 py-3 rounded-xl shadow-2xl text-sm min-w-[220px] z-20 border border-gray-200">
                    <div className="font-bold text-red-700 mb-1 flex items-center">
                      <MapPin size={14} className="mr-2" />
                      Proposed Toilet Location
                    </div>
                    <div className="text-xs text-gray-500 mb-2">Optimization Score: {toilet.score?.toFixed(1) || 'N/A'}m</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Latitude:</span>
                        <span className="font-mono">{toilet.lat?.toFixed(6) || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Longitude:</span>
                        <span className="font-mono">{toilet.lon?.toFixed(6) || 'N/A'}</span>
                      </div>
                      {toilet.score && (
                        <div className="mt-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Distance Score:</span>
                            <span className="font-bold text-green-700">{toilet.score.toFixed(1)}m</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                              style={{ width: `${Math.min(100, toilet.score / 500 * 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Higher score = better location (further from existing toilets)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* No data message */}
        {existingToilets.length === 0 && proposedToilets.length === 0 && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500 bg-white/90 backdrop-blur-sm px-8 py-10 rounded-2xl shadow-xl max-w-md border border-gray-200">
              <MapPin size={64} className="mx-auto mb-4 opacity-30" />
              <p className="text-xl font-bold text-gray-700 mb-2">No Location Data Available</p>
              <p className="text-gray-600 mb-4">
                Run the optimization analysis to identify sanitation deserts and generate proposed toilet locations.
              </p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={regenerateMap}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all"
                >
                  <RefreshCw size={20} />
                  <span>Run Optimization Analysis</span>
                </button>
                <div className="text-xs text-gray-500">
                  This will analyze OpenStreetMap data and identify optimal locations for new sanitation facilities
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Footer */}
        {(existingToilets.length > 0 || proposedToilets.length > 0) && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-gray-200 flex justify-between items-center">
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{existingToilets.length}</div>
                <div className="text-xs text-gray-600">Existing Facilities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-700">{proposedToilets.length}</div>
                <div className="text-xs text-gray-600">Proposed Locations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {proposedToilets.length > 0
                    ? proposedToilets.reduce((max, t) => Math.max(max, t.score || 0), 0).toFixed(0)
                    : '0'}m
                </div>
                <div className="text-xs text-gray-600">Best Distance Score</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-700">
                {showSatellite ? 'Satellite View' : 'Street View'}
              </div>
              <div className="text-xs text-gray-500">
                Click markers for details • Hover for quick info
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(MapView);