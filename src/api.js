// API Configuration - Using Vite proxy to avoid CORS issues
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; // Proxied locally, direct in prod

// API Functions
export async function fetchOptimization() {
  try {
    const response = await fetch(`${API_BASE_URL}/optimize`);
    if (!response.ok) throw new Error('Optimization fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Error fetching optimization:', error);

    // Return mock data if backend is not available
    return {
      status: 'success',
      proposed_locations: [
        { id: 101, lat: -1.311, lon: 36.786, score: 0.92 },
        { id: 102, lat: -1.308, lon: 36.789, score: 0.88 },
        { id: 103, lat: -1.305, lon: 36.792, score: 0.85 },
        { id: 104, lat: -1.314, lon: 36.793, score: 0.79 },
        { id: 105, lat: -1.309, lon: 36.797, score: 0.76 },
      ],
    };
  }
}

export async function runSimulation({ agents, subsidy, flood }) {
  try {
    const response = await fetch(`${API_BASE_URL}/simulate/aggregate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        num_agents: agents,
        subsidy_active: subsidy,
        flood_active: flood,
      }),
    });
    if (!response.ok) throw new Error('Simulation failed');
    return await response.json();
  } catch (error) {
    console.error('Error running simulation:', error);

    // Fallback Mock Data Logic (replicating backend logic)
    const steps = 50;
    const history = [];
    let od_events = 0;
    const base_cost = 5;
    const effective_cost = subsidy ? 0 : base_cost;
    const capacity = flood ? 40 : 100;

    for (let i = 0; i < steps; i++) {
      // Simple Poisson approx
      const demand = Math.floor(agents * 0.1);
      const served = Math.min(demand, capacity);
      const unserved = demand - served;

      let od_now = 0;
      if (effective_cost > 0) {
        od_now = Math.floor(unserved * 0.3);
      } else {
        od_now = Math.floor(unserved * 0.05);
      }
      od_events += od_now;
      history.push(od_events);
    }

    const coverage = ((1 - (od_events / (agents * 5))) * 100);

    return {
      history: history,
      total_od_events: od_events,
      coverage: coverage,
      status: od_events > 150 ? "CRITICAL" : "STABLE",
      // Mock locations for map visualization (not simulating actual placements here)
      existing_toilets: [
        { lat: -1.315, lon: 36.785 },
        { lat: -1.313, lon: 36.788 },
        { lat: -1.310, lon: 36.791 },
      ],
    };
  }
}