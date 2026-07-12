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
    cta: "Apply Solution",
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
    cta: "Aplicar Solución",
    fanWelcome: "¡Bienvenido!",
    fanSub: "Guía en vivo para el Estadio SoFi.",
  }
};

type Incident = {
  id: string;
  level: "URGENT" | "WATCH";
  title: string;
  summary: string;
  steps: string[];
  prediction: string;
  location: string;
};

export default function EliteVenueConsole() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [persona, setPersona] = useState<"OPS" | "FAN">("OPS");
  const [selectedId, setSelectedId] = useState("INC-1");
  const [time, setTime] = useState("");
  const [dispatchStatus, setDispatchStatus] = useState<"idle" | "sending" | "confirmed">("idle");
  const [missions, setMissions] = useState<string[]>([]);

  const t = UI_TEXT[lang];

  const incidents: Incident[] = useMemo(() => [
    {
      id: "INC-1",
      level: "URGENT",
      title: lang === 'en' ? "Gate B Bottleneck" : "Atasco Puerta B",
      summary: "Ticket scanner #4 is offline.",
      steps: [
        lang === 'en' ? "Scanner #4 power failure." : "Fallo de energía escáner #4.",
        lang === 'en' ? "Queue growth: +22 ppl/min." : "Crecimiento cola: +22 pers/min.",
        lang === 'en' ? "Density: 92% capacity." : "Densidad: 92% capacidad."
      ],
      prediction: lang === 'en' ? "15m until entry stalls." : "15m hasta parada total.",
      location: "Gate B / North Hub"
    },
    {
      id: "INC-2",
      level: "WATCH",
      title: lang === 'en' ? "Heat Spike: Sec 114" : "Calor: Sec 114",
      summary: "Zone temp reached 34°C.",
      steps: [
        lang === 'en' ? "Sensor 14 reporting peak heat." : "Sensor 14 reporta calor pico.",
        lang === 'en' ? "No wind flow in upper concourse." : "Sin flujo aire en nivel superior.",
        lang === 'en' ? "High risk of dehydration." : "Riesgo deshidratación alto."
      ],
      prediction: lang === 'en' ? "Medical alerts expected soon." : "Alertas médicas pronto.",
      location: "Section 114 / Upper"
    }
  ], [lang]);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const i = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000);
    return () => clearInterval(i);
  }, []);

  const current = incidents.find(i => i.id === selectedId) || incidents[0];

  const handleApply = () => {
    setDispatchStatus("sending");
    setTimeout(() => {
      setDispatchStatus("confirmed");
      setMissions(prev => [`${current.title} - Active`, ...prev.slice(0, 1)]);
      setTimeout(() => setDispatchStatus("idle"), 3000);
    }, 1200);
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
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t.incidents}</h2>
            
            {persona === "OPS" ? (
              <div className="space-y-2">
                {incidents.map(i => (
                  <button key={i.id} onClick={() => setSelectedId(i.id)} className={`w-full p-4 rounded-xl text-left border transition-all ${selectedId === i.id ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-100 hover:border-slate-300"}`}>
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
                  <p className="font-bold text-sm">North Gate (A)</p>
                  <p className="text-[10px] opacity-90 mt-1">Wait: Under 5 mins</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4">Venue Vitality</h3>
            <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold">Safety Index</span><span className="text-[10px] font-black text-emerald-600">9.8/10</span></div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[98%]" /></div>
          </div>
        </div>

        {/* COL 2: MAP */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center relative min-h-[500px]">
          <div className="absolute top-6 left-8 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <h2 className="text-[10px] font-black text-slate-400 uppercase">{t.heatmap}</h2>
          </div>

          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 border border-slate-100 rounded-full" />
            <div className="absolute inset-4 border border-slate-100 rounded-full bg-slate-50/50 flex items-center justify-center">
              <div className="w-48 h-32 border-2 border-white bg-white shadow-xl rounded-[20%] flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-red-500/20 to-transparent" />
                <div className="w-10 h-6 bg-emerald-500/20 border border-emerald-500 rounded-md" />
              </div>
            </div>
            {/* Gate Indicators */}
            <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[9px] font-black text-emerald-500">GATE A</span>
            <span className="absolute top-1/2 -right-4 -translate-y-1/2 text-[9px] font-black text-red-500">GATE B</span>
          </div>

          <div className="mt-12 flex gap-10">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[9px] font-black uppercase text-slate-400 italic">Moving Fast</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[9px] font-black uppercase text-slate-400 italic">High Friction</span></div>
          </div>
        </div>

        {/* COL 3: AI HUB */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[10px]">✨</span>
              <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{t.dispatch}</h2>
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-black uppercase italic leading-tight">{current.title}</h3>
                <p className="text-[9px] font-bold text-slate-500 mt-1">{current.location}</p>
              </div>

              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-3">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Observation</p>
                  <p className="text-[11px] font-medium leading-relaxed">{current.summary}</p>
                </div>

                <div className="bg-white/5 p-3 rounded-xl">
                  <p className="text-[9px] font-black text-blue-400 uppercase mb-2">AI Diagnostic Path</p>
                  <div className="space-y-1">
                    {current.steps.map((step, i) => (
                      <p key={i} className="text-[10px] font-medium text-slate-300 flex gap-2">
                        <span className="text-blue-500">{i + 1}.</span> {step}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                  <p className="text-[9px] font-black text-orange-400 uppercase mb-1">Impact Forecast</p>
                  <p className="text-[10px] font-bold italic">{current.prediction}</p>
                </div>
              </div>

              <button 
                onClick={handleApply}
                disabled={dispatchStatus !== "idle"}
                className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  dispatchStatus === "confirmed" ? "bg-emerald-500 text-white" : dispatchStatus === "sending" ? "bg-blue-600 text-white animate-pulse" : "bg-white text-black hover:bg-blue-50"
                }`}
              >
                {dispatchStatus === "confirmed" ? "Mission Live" : dispatchStatus === "sending" ? "Deploying..." : t.cta}
              </button>
            </div>
          </div>

          {/* ACTIVE MISSIONS TRACKER */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-[10px] font-black text-slate-400 uppercase mb-3">Mission Tracker</h2>
            <div className="space-y-2">
              {missions.length > 0 ? missions.map((m, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] font-bold">{m}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              )) : <p className="text-[10px] text-slate-400 italic">No missions active.</p>}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
