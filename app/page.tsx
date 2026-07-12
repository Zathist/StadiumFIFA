"use client";

import { useEffect, useState, useMemo } from "react";

// --- Multi-Language Config ---
const UI_TEXT = {
  en: {
    title: "VenueMind",
    sub: "FIFA 2026 Hub",
    opsMode: "Staff",
    fanMode: "Fan",
    incidents: "Live Alerts",
    heatmap: "Crowd Map",
    dispatch: "AI Decision Hub",
    cta: "Run Autonomous Mitigation",
    fanWelcome: "Welcome, Fan!",
    fanSub: "Live guidance for SoFi Stadium.",
  },
  es: {
    title: "VenueMind",
    sub: "FIFA 2026 Hub",
    opsMode: "Personal",
    fanMode: "Fan",
    incidents: "Alertas",
    heatmap: "Mapa",
    dispatch: "Centro de IA",
    cta: "Ejecutar Mitigación",
    fanWelcome: "¡Bienvenido!",
    fanSub: "Guía en vivo para el Estadio SoFi.",
  }
};

type Incident = {
  id: string;
  level: "URGENT" | "WATCH";
  title: string;
  summary: string;
  location: string;
};

export default function EliteVenueConsole() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [persona, setPersona] = useState<"OPS" | "FAN">("OPS");
  const [selectedId, setSelectedId] = useState("INC-1");
  const [time, setTime] = useState("");
  
  // --- Agentic State Machines ---
  const [dispatchStatus, setDispatchStatus] = useState<"idle" | "running_agents" | "executing_tools" | "confirmed">("idle");
  const [agentLogs, setAgentLogs] = useState<{ crowd?: string; safety?: string; decision?: string }>({});
  const [missions, setMissions] = useState<string[]>([]);
  
  // --- Live Simulated Telemetry & Tool States ---
  const [gateBStatus, setGateBStatus] = useState<"FRICTION" | "OPEN">("FRICTION");
  const [crowdDensity, setCrowdDensity] = useState(92);
  const [safetyIndex, setSafetyIndex] = useState(9.8);

  const t = UI_TEXT[lang];

  // Incidents serve as the baseline telemetry trigger for the agents
  const incidents: Incident[] = useMemo(() => [
    {
      id: "INC-1",
      level: "URGENT",
      title: lang === 'en' ? "Gate B Bottleneck" : "Atasco Puerta B",
      summary: "Ticket scanner #4 telemetry reports offline state.",
      location: "Gate B / North Hub"
    },
    {
      id: "INC-2",
      level: "WATCH",
      title: lang === 'en' ? "Heat Spike: Sec 114" : "Calor: Sec 114",
      summary: "Upper bowl ambient zone temperature reached 34°C.",
      location: "Section 114 / Upper"
    }
  ], [lang]);

  // Clock Ticker
  useEffect(() => {
    setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const i = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000);
    return () => clearInterval(i);
  }, []);

  // Telemetry Pipeline Drift Simulation
  useEffect(() => {
    const drift = setInterval(() => {
      if (dispatchStatus === "confirmed") {
        // Recovery loop if mitigation is active
        setCrowdDensity(prev => Math.max(45, prev - 4));
        setSafetyIndex(prev => Math.min(10.0, prev + 0.05));
      } else {
        // Normal ambient escalation drift
        setCrowdDensity(prev => Math.min(98, prev + (Math.random() > 0.5 ? 1 : 0)));
      }
    }, 4000);
    return () => clearInterval(drift);
  }, [dispatchStatus]);

  const current = incidents.find(i => i.id === selectedId) || incidents[0];

  // --- Real Orchestration Flow ---
 const handleApply = async () => {
  setDispatchStatus("running_agents");
  setAgentLogs({});

  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fanProfile: {
          persona,
        },
        language: lang,
        location: current.location,
        summary: current.summary,
        telemetry: {
          crowdDensity,
          safetyIndex,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("AI API failed");
    }

    const data = await response.json();

    if (!data.result) {
      throw new Error("Invalid AI response structure");
    }

    setAgentLogs({
  crowd: data.result.recommendation || "Crowd analysis completed",
  safety: data.result.reasoning || "Safety analysis completed",
  decision: `Urgency: ${data.result.urgencyLevel} | Zone: ${data.result.recommendedZone}`,
});

    setDispatchStatus("executing_tools");

    setTimeout(() => {
      const action = data.result.recommendation || "Mitigation Matrix";

      if (action === "OPEN_GATE_B" || current.id === "INC-1") {
        setGateBStatus("OPEN");
      }

      if (action === "ACTIVATE_COOLING" || current.id === "INC-2") {
        setSafetyIndex(9.9);
      }

      setDispatchStatus("confirmed");

      setMissions(prev => [
        `Executed: ${action || "Mitigation Matrix"}`,
        ...prev.slice(0, 1),
      ]);

      setTimeout(() => {
        setDispatchStatus("idle");
      }, 4000);

    }, 1500);

  } catch (error) {
    console.error("Agentic pipeline failure:", error);
    setDispatchStatus("idle");
  }
};
  
  return (
    <main className="min-h-screen bg-[#F4F7F9] text-slate-900 font-sans selection:bg-blue-100">
      
      {/* COMPACT NAV */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic">V</div>
            <h1 className="font-black tracking-tighter uppercase text-sm">{t.title} <span className="text-blue-600">{t.sub}</span></h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex p-1 bg-slate-100 rounded-lg">
              <button onClick={() => setPersona("OPS")} className={`px-4 py-1 rounded-md text-[10px] font-black uppercase transition-all ${persona === "OPS" ? "bg-white shadow-sm" : "text-slate-400"}`}>{t.opsMode}</button>
              <button onClick={() => setPersona("FAN")} className={`px-4 py-1 rounded-md text-[10px] font-black uppercase transition-all ${persona === "FAN" ? "bg-white shadow-sm" : "text-slate-400"}`}>{t.fanMode}</button>
            </div>
            <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} className="text-[10px] font-black uppercase border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50">{lang}</button>
            <span className="font-mono text-xs font-bold text-slate-400">{time}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-12 gap-6">
        
        {/* COL 1: ALERTS */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.incidents}</h2>
              <span className="text-[8px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded border border-blue-100">3 Agents Live</span>
            </div>
            
            {persona === "OPS" ? (
              <div className="space-y-2">
                {incidents.map(i => (
                  <button key={i.id} onClick={() => { setSelectedId(i.id); setAgentLogs({}); }} className={`w-full p-4 rounded-xl text-left border transition-all ${selectedId === i.id ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-100 hover:border-slate-300"}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase tracking-tight">{i.title}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${i.level === 'URGENT' ? 'bg-red-500' : 'bg-orange-500'}`} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400">{i.location}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-black">{t.fanWelcome}</h3>
                <div className="bg-blue-600 p-4 rounded-xl text-white">
                  <p className="text-[9px] font-black uppercase opacity-70 mb-1">Entry Recommendation</p>
                  <p className="font-bold text-sm">{gateBStatus === "OPEN" ? "Gate B Now Available" : "North Gate (A)"}</p>
                  <p className="text-[10px] opacity-90 mt-1">{gateBStatus === "OPEN" ? "Rerouted by AI • Normal Speed" : "Wait: Under 5 mins"}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4">Venue Vitality</h3>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold">Telemetry Load</span>
              <span className="text-[10px] font-black text-blue-600">{crowdDensity}%</span>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${crowdDensity}%` }} />
            </div>
            
            <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold">Safety Index</span><span className="text-[10px] font-black text-emerald-600">{safetyIndex.toFixed(1)}/10</span></div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${safetyIndex * 10}%` }} />
            </div>
          </div>
        </div>

        {/* COL 2: MAP */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center relative min-h-[500px]">
          <div className="absolute top-6 left-8 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <h2 className="text-[10px] font-black text-slate-400 uppercase">{t.heatmap}</h2>
          </div>

          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 border border-slate-100 rounded-full animate-pulse" />
            <div className="absolute inset-4 border border-slate-100 rounded-full bg-slate-50/50 flex items-center justify-center">
              <div className="w-48 h-32 border-2 border-white bg-white shadow-xl rounded-[20%] flex items-center justify-center relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-full h-full transition-all duration-500 ${gateBStatus === 'OPEN' ? 'bg-emerald-500/10' : 'bg-red-500/20'}`} />
                <div className="w-10 h-6 bg-emerald-500/20 border border-emerald-500 rounded-md" />
              </div>
            </div>
            {/* Gate Indicators Linked to Tool Execution state */}
            <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[9px] font-black text-emerald-500">GATE A 🟢</span>
            <span className="absolute top-1/2 -right-4 -translate-y-1/2 text-[9px] font-black flex items-center gap-1">
              GATE B {gateBStatus === "OPEN" ? <span className="text-emerald-500">🟢 OPEN</span> : <span className="text-red-500">🔴 SLOW</span>}
            </span>
          </div>

          <div className="mt-12 flex gap-10">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[9px] font-black uppercase text-slate-400 italic">Moving Fast</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[9px] font-black uppercase text-slate-400 italic">High Friction</span></div>
          </div>
        </div>

        {/* COL 3: AI HUB */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[10px]">✨</span>
                <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{t.dispatch}</h2>
              </div>
              {dispatchStatus !== "idle" && (
                <span className="text-[8px] font-mono text-amber-400 uppercase tracking-widest animate-pulse">{dispatchStatus}</span>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-black uppercase italic leading-tight">{current.title}</h3>
                <p className="text-[9px] font-bold text-slate-500 mt-1">{current.location}</p>
              </div>

              <div className="space-y-4">
                {/* 1. Observation Telemetry Block */}
                <div className="border-l-2 border-blue-500 pl-3">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Observation Telemetry</p>
                  <p className="text-[11px] font-medium leading-relaxed text-slate-300">{current.summary}</p>
                </div>

                {/* 2. Orchestration Stack Matrix */}
                <div className="bg-white/5 p-3 rounded-xl space-y-3 border border-white/5">
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-wider">Multi-Agent Diagnostics</p>
                  
                  <div className="space-y-2 text-[11px]">
                    <div className="pb-2 border-b border-white/5">
                      <p className="text-[8px] font-bold text-slate-500 uppercase">👤 Crowd Flow Agent</p>
                      <p className="text-slate-300 italic font-medium mt-0.5">
                        {agentLogs.crowd || (dispatchStatus === "running_agents" ? "Evaluating capacity vectors..." : "Awaiting activation...")}
                      </p>
                    </div>

                    <div className="pb-2 border-b border-white/5">
                      <p className="text-[8px] font-bold text-slate-500 uppercase">🛡️ Stadium Safety Agent</p>
                      <p className="text-slate-300 italic font-medium mt-0.5">
                        {agentLogs.safety || (dispatchStatus === "running_agents" ? "Scanning vital hazard limits..." : "Awaiting activation...")}
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] font-bold text-amber-400 uppercase">🧠 Chief Operations Agent</p>
                      <p className="text-slate-200 font-bold mt-0.5">
                        {agentLogs.decision || (dispatchStatus === "running_agents" ? "Synthesizing mitigation plan..." : "Awaiting telemetry evaluation...")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Real-Time Tool Execution Feedback */}
                {dispatchStatus === "executing_tools" && (
                  <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 animate-pulse">
                    <p className="text-[9px] font-black text-emerald-400 uppercase mb-1">Executing Tool Call</p>
                    <p className="text-[10px] font-mono text-emerald-300 font-bold">🛠️ system_hardware_override()</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handleApply}
                disabled={dispatchStatus !== "idle"}
                className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  dispatchStatus === "confirmed" 
                    ? "bg-emerald-500 text-white" 
                    : dispatchStatus !== "idle" 
                      ? "bg-blue-600 text-white animate-pulse" 
                      : "bg-white text-black hover:bg-blue-50"
                }`}
              >
                {dispatchStatus === "confirmed" ? "✓ Mitigation Pipeline Complete" : dispatchStatus !== "idle" ? "Orchestrating..." : t.cta}
              </button>
            </div>
          </div>

          {/* ACTIVE MISSIONS TRACKER */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-[10px] font-black text-slate-400 uppercase mb-3">System Action Log</h2>
            <div className="space-y-2">
              {missions.length > 0 ? missions.map((m, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-mono font-bold text-slate-700">{m}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              )) : <p className="text-[10px] text-slate-400 italic">No historical overrides.</p>}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
