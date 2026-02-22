import React, { useState, useEffect } from 'react';
import {
    Shield,
    Terminal,
    Activity,
    Globe,
    Zap,
    Lock,
    Unlock,
    Cpu,
    Database,
    AlertTriangle,
    ChevronRight,
    RefreshCw,
    Eye,
    EyeOff
} from 'lucide-react';

interface IntelPacket {
    id: string;
    source: string;
    timestamp: string;
    data: string;
    confidence: number;
    status: 'verified' | 'pending' | 'warning';
}

const SpecializedAIG: React.FC = () => {
    const [isGhostActive, setIsGhostActive] = useState(true);
    const [isSurvivalActive, setIsSurvivalActive] = useState(true);
    const [intelFeed, setIntelFeed] = useState<IntelPacket[]>([]);
    const [isPenetrating, setIsPenetrating] = useState(false);
    const [penetrationLogs, setPenetrationLogs] = useState<string[]>([]);

    useEffect(() => {
        // Initial generic intelligence data
        const initialIntel: IntelPacket[] = [
            { id: '1', source: 'Web Intelligence', timestamp: new Date().toISOString(), data: 'General trend analysis: AI-driven creativity on the rise.', confidence: 0.98, status: 'verified' },
            { id: '2', source: 'Tech News Node', timestamp: new Date(Date.now() - 3600000).toISOString(), data: 'Latest tech stack updates: React 19 adoption increasing.', confidence: 0.95, status: 'verified' },
            { id: '3', source: 'Market Sentiment', timestamp: new Date(Date.now() - 7200000).toISOString(), data: 'SaaS ecosystem showing high interest in intelligent automation.', confidence: 0.88, status: 'warning' },
        ];
        setIntelFeed(initialIntel);
    }, []);

    const triggerPenetration = () => {
        setIsPenetrating(true);
        setPenetrationLogs(['[SYSTEM] Initializing Intelligence Gathering...', '[GHOST] Masking connection footprint...', '[GHOST] Rotating local network identifiers...']);

        setTimeout(() => {
            setPenetrationLogs(prev => [...prev, '[SURVIVAL] Analyzing data density patterns', '[EYE] Targeting relevant information clusters']);
        }, 1500);

        setTimeout(() => {
            setPenetrationLogs(prev => [...prev, '[INTELLIGENCE] Pattern Recognition Active: Extracting key insights', '[EYE] Insights Verified. Checksum generated.']);
            setIsPenetrating(false);

            const newIntel: IntelPacket = {
                id: Date.now().toString(),
                source: 'Deep Extraction',
                timestamp: new Date().toISOString(),
                data: 'Extracted 5 key insights from emerging technology discussions.',
                confidence: 0.99,
                status: 'verified'
            };
            setIntelFeed(prev => [newIntel, ...prev]);
        }, 4000);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-[2rem] shadow-2xl shadow-violet-900/40 relative group overflow-hidden">
                        <Shield size={36} className="relative z-10" />
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
                            SPECIALIZED AIG
                        </h2>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">
                            Agentic Intelligence Generator & Insight Framework
                        </p>
                    </div>
                </div>

                <div className="flex bg-slate-900 border border-slate-800 rounded-3xl p-2 gap-2 shadow-inner">
                    <button
                        onClick={() => setIsGhostActive(!isGhostActive)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isGhostActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10' : 'bg-slate-950 text-slate-600 border border-slate-800'}`}
                    >
                        {isGhostActive ? <Eye size={14} /> : <EyeOff size={14} />} Ghost Protocol
                    </button>
                    <button
                        onClick={() => setIsSurvivalActive(!isSurvivalActive)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isSurvivalActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10' : 'bg-slate-950 text-slate-600 border border-slate-800'}`}
                    >
                        {isSurvivalActive ? <Lock size={14} /> : <Unlock size={14} />} Insight Kit
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Console */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden group">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-violet-600/5 rounded-full blur-[80px] group-hover:bg-violet-600/10 transition-colors duration-1000"></div>

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-violet-600/20 text-violet-400 rounded-xl">
                                    <Terminal size={22} />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-tighter">Command Center</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Gathering Insights</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={triggerPenetration}
                                disabled={isPenetrating}
                                className="group relative flex items-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-xl shadow-violet-900/20 active:scale-95 disabled:opacity-50"
                            >
                                {isPenetrating ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} className="group-hover:animate-pulse" />}
                                {isPenetrating ? 'Gathering...' : 'Gather Intelligence'}
                            </button>
                        </div>

                        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 font-mono text-[11px] h-[300px] overflow-y-auto shadow-inner custom-scrollbar relative">
                            <div className="sticky top-0 right-0 p-2 text-slate-800/20 text-[60px] pointer-events-none select-none">EYE</div>
                            {penetrationLogs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
                                    <Activity size={48} className="animate-pulse" />
                                    <p className="uppercase tracking-widest text-xs font-bold">Awaiting Selection</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {penetrationLogs.map((log, idx) => (
                                        <div key={idx} className="flex gap-3 items-start border-l-2 border-violet-500/30 pl-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                            <span className="text-slate-600 select-none">[{idx.toString().padStart(2, '0')}]</span>
                                            <span className={log.includes('[EYE]') ? 'text-cyan-400 font-bold' : log.includes('[GHOST]') ? 'text-violet-400' : 'text-slate-400'}>
                                                {log}
                                            </span>
                                        </div>
                                    ))}
                                    {isPenetrating && <div className="animate-pulse text-violet-400">_</div>}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 flex items-center gap-5 hover:bg-slate-800/50 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                                <Globe size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-xs uppercase tracking-widest text-slate-300">Active Nodes</h4>
                                <p className="text-3xl font-black text-white mt-1">12 <span className="text-sm font-medium text-slate-500">Online</span></p>
                                <div className="flex gap-1 mt-2">
                                    {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0].map((v, i) => (
                                        <div key={i} className={`w-3 h-1 rounded-full ${v ? 'bg-cyan-500' : 'bg-slate-800'}`}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 flex items-center gap-5 hover:bg-slate-800/50 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
                                <Database size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-xs uppercase tracking-widest text-slate-300">Intel Flow</h4>
                                <p className="text-3xl font-black text-white mt-1">4.2k <span className="text-sm font-medium text-slate-500">Packets</span></p>
                                <p className="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-tighter">Verified +18.4% today</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Intelligence Stream */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 h-full flex flex-col shadow-2xl">
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <div className="p-2 bg-amber-500/20 text-amber-500 rounded-lg">
                                <Activity size={18} />
                            </div>
                            <h3 className="font-black text-xs uppercase tracking-widest text-slate-100">Live Insights</h3>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto px-2 custom-scrollbar pr-4">
                            {intelFeed.map((intel) => (
                                <div key={intel.id} className="p-5 bg-slate-950 rounded-3xl border border-slate-800 hover:border-violet-500/30 transition-all group scale-100 hover:scale-[1.02] active:scale-95 duration-300">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[9px] font-black uppercase text-violet-400 tracking-widest">{intel.source}</span>
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[8px] font-black uppercase ${intel.status === 'verified' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 'border-amber-500/30 text-amber-500 bg-amber-500/5'
                                            }`}>
                                            {intel.status === 'verified' ? <Shield size={10} /> : <AlertTriangle size={10} />}
                                            {intel.status}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-200 leading-relaxed font-medium mb-3">{intel.data}</p>
                                    <div className="flex items-center justify-between text-[8px] font-bold text-slate-600 uppercase">
                                        <span>{new Date(intel.timestamp).toLocaleTimeString()}</span>
                                        <span className="flex items-center gap-1">Confidence: <span className="text-cyan-400">{(intel.confidence * 100).toFixed(1)}%</span></span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-800">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Node Network</h4>
                            <div className="aspect-[4/3] bg-slate-950 rounded-[1.5rem] relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 opacity-10 animate-pulse">
                                    <div className="w-full h-full bg-[radial-gradient(circle,#334155_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                                </div>
                                <div className="relative flex flex-col items-center">
                                    <Globe size={40} className="text-slate-800 animate-spin-slow" />
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-700 mt-2">Syncing Data...</p>
                                </div>
                                {/* Random pings */}
                                <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-violet-400 rounded-full animate-ping [animation-delay:1s]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Meta Info */}
            <footer className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Cpu size={20} className="text-slate-500" />
                    <div className="flex gap-2">
                        {['TLS_Fingerprint', 'AES_256', 'DATA_EXTRACTION', 'SECURE_NODE'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-slate-950 rounded-lg text-[9px] font-black text-slate-500 border border-slate-800">{tag}</span>
                        ))}
                    </div>
                </div>
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    EYE-AIG v1.0.0 <ChevronRight size={12} /> <span className="text-slate-500">ACTIVE_MONITORING</span>
                </div>
            </footer>
        </div>
    );
};

export default SpecializedAIG;
