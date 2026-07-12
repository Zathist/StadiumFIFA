"use client";

import { useState } from "react";

// --- Advanced Internationalization & Accessibility ---
const TRANSLATIONS = {
  en: {
    welcome: "Tournament Intelligence Portal",
    sos: "EMERGENCY SOS",
    eco: "Sustainability Hub",
    ops: "Command Center",
    fan: "Fan Concierge",
    theme: "Accessibility",
    security: "Prohibited Items: No liquid > 100ml. Clear bags only.",
    systemStatus: "System Nominal",
  },
  es: {
    welcome: "Portal de Inteligencia",
    sos: "S.O.S EMERGENCIA",
    eco: "Centro de Sostenibilidad",
    ops: "Centro de Mando",
    fan: "Asistente de Fan",
    theme: "Accesibilidad",
    security: "Prohibido: Líquidos > 100ml. Bolsas transparentes.",
    systemStatus: "Sistema Operativo",
  }
};

type Theme = "dark" | "light" | "contrast";

export default function ArenaIQLeapfrog() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [theme, setTheme] = useState<Theme>("dark");
  const [persona, setPersona] = useState<"OPS" | "FAN">("OPS");
  const [sosActive, setSosActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);

  const t = TRANSLATIONS[lang];

  // --- Real-time Metrics ---
  const [metrics] = useState({
    energy: 88,
    waste: 4.2,
    co2: 1240,
  });

  // --- AI Logic with Visual Feedback ---
  const handleInference = async () => {
    setLoading(true);
    setAiResponse(null); // Clear previous result
    try {
      await new Promise(r => setTimeout(r, 1500));
      setAiResponse({
        result: "Gate A is currently at 15% capacity. Rerouting 40% of Gate B traffic here will equalize pressure within 8 minutes.",
        confidence: 98
      });
    } catch (e) {
      setAiResponse({
        result: "Error: System unreachable. Manual override suggested.",
        confidence: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "dark" ? "bg-[#05070a] text-white" : 
      theme === "light" ? "bg-slate-50 text-slate-900" : 
      "bg-black text-[#ffff00] font-mono border-4 border-[#ffff00]"
    }`}>
      
      {/* 1. ACCESSIBILITY & UTILITY HEADER */}
      <header className="border-b border-white/10 p-4 sticky top-0 z-50 backdrop-blur-md bg-inherit/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-black italic shadow-lg shadow-blue-600/20">V</div>
            <div>
              <h1 className="text-sm font-black tracking-widest uppercase">{t.welcome}</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-bold opacity-60 uppercase">{t.systemStatus}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select 
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold outline-none"
            >
              <option value="dark">Dark UI</option>
              <option value="light">Light UI</option>
              <option value="contrast">High Contrast</option>
            </select>

            <button 
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold hover:bg-white/5 transition-all"
            >
              {lang === 'en' ? 'ESP' : 'ENG'}
            </button>
          </div>
        </div>
      </header>

      {/* 2. EMERGENCY SOS LAYER */}
      {sosActive && (
        <div className="fixed inset-0 z-[100] bg-rose-600/95 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="max-w-md w-full bg-white text-rose-600 rounded-[2rem] p-8 shadow-2xl text-center">
            <h2 className="text-4xl font-black italic mb-4">S.O.S ACTIVE</h2>
            <p className="font-bold mb-6 text-slate-800">AI is triaging your location... Emergency personnel dispatched.</p>
            <div className="space-y-4">
              <button onClick={() => setSosActive(false)} className="text-slate-400 font-bold text-xs uppercase">Cancel Alert</button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-12 gap-8">
        
        {/* LEFT COL */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6 shadow-xl">
            <div className="flex p-1 bg-black/20 rounded-xl border border-white/5">
              <button onClick={() => setPersona("OPS")} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${persona === "OPS" ? "bg-white text-black" : "opacity-40"}`}>{t.ops}</button>
              <button onClick={() => setPersona("FAN")} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${persona === "FAN" ? "bg-white text-black" : "opacity-40"}`}>{t.fan}</button>
            </div>

            <button 
              onClick={() => setSosActive(true)}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-600/20 transition-all active:scale-95"
            >
              {t.sos}
            </button>
          </div>
        </div>

        {/* RIGHT COL */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="space-y-8">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic">Reroute Command</h2>

              {/* AI RESPONSE UI - THIS APPEARS AFTER CLICK */}
              {aiResponse && (
                <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Autonomous Solution</p>
                  <p className="text-sm font-bold text-white">{aiResponse.result}</p>
                </div>
              )}

              <button 
                disabled={loading}
                onClick={handleInference}
                className="w-full py-5 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Syncing Multi-Agent Nodes..." : "Execute Tactical Deployment"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
