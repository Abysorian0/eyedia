
import React from 'react';
import {
    FileSearch,
    Globe,
    Layers,
    Loader2,
    Activity,
    ShieldCheck,
    Maximize2,
    Info,
    Image as ImageIcon,
    ExternalLink,
    ArrowUpRight
} from 'lucide-react';
import { WebResult } from '../types';

interface IntelligentScraperProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isSearchingWeb: boolean;
    handleDeepSearch: () => void;
    webInsights: { text: string; sources: WebResult[] } | null;
    setWebInsights: (insights: { text: string; sources: WebResult[] } | null) => void;
}

const IntelligentScraper: React.FC<IntelligentScraperProps> = ({
    searchQuery,
    setSearchQuery,
    isSearchingWeb,
    handleDeepSearch,
    webInsights,
    setWebInsights
}) => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-600/20 text-cyan-400 rounded-2xl">
                        <FileSearch size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight">Intelligent Scraper</h2>
                        <p className="text-slate-500 text-sm">Deep-dive into the web's knowledge layers.</p>
                    </div>
                </div>

                <div className="relative p-1 bg-slate-800 rounded-[2rem] shadow-2xl focus-within:ring-2 focus-within:ring-cyan-500 transition-all duration-300">
                    <div className="bg-slate-950 rounded-[1.8rem] flex items-center p-2">
                        <div className="p-4 text-cyan-500">
                            <Globe size={24} className={isSearchingWeb ? "animate-spin" : ""} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Target keyword, concept, or domain for scraping..."
                            className="flex-1 bg-transparent border-none outline-none py-4 text-lg text-white placeholder:text-slate-700"
                            onKeyDown={(e) => e.key === 'Enter' && handleDeepSearch()}
                        />
                        <button
                            onClick={handleDeepSearch}
                            disabled={isSearchingWeb || !searchQuery.trim()}
                            className="bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSearchingWeb ? <Loader2 size={18} className="animate-spin" /> : <Layers size={18} />}
                            {isSearchingWeb ? 'Scraping...' : 'Deep Scrape'}
                        </button>
                    </div>
                </div>
            </header>

            {!webInsights && !isSearchingWeb ? (
                <div className="py-20 text-center space-y-6">
                    <div className="relative inline-block">
                        <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 mx-auto">
                            <Activity size={40} className="text-slate-800" />
                        </div>
                        <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-500/10 rounded-full animate-ping"></div>
                    </div>
                    <div className="max-w-sm mx-auto">
                        <h3 className="text-lg font-bold text-slate-400">Ready for Extraction</h3>
                        <p className="text-sm text-slate-600 mt-2">Enter a query above to begin a multi-threaded web crawl and analysis powered by Gemini.</p>
                    </div>
                </div>
            ) : null}

            {isSearchingWeb && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 text-center space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                            <div className="h-full bg-cyan-500 animate-[shimmer_2s_infinite] w-[40%]"></div>
                        </div>

                        <div className="flex justify-center gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-3 h-3 rounded-full bg-cyan-500 animate-bounce delay-${i}`}></div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-black uppercase text-cyan-400 tracking-widest">Active Scrape Sequence</h4>
                            <div className="flex flex-wrap justify-center gap-3">
                                {['Resolving Nodes', 'Scraping Metadata', 'Analyzing Sentiment', 'Extracting Grounding Chunks'].map((task, idx) => (
                                    <div key={task} className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all duration-1000 ${idx === 0 ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-slate-800 text-slate-600'}`}>
                                        {task}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-48 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed animate-pulse"></div>
                        <div className="h-48 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed animate-pulse"></div>
                    </div>
                </div>
            )}

            {webInsights && !isSearchingWeb && (
                <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-1000">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-tighter">Verified Intelligence</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Confidence Score: 98.4%</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setWebInsights(null)}
                                className="p-2 hover:bg-slate-800 rounded-xl text-slate-600 transition-colors"
                                title="Close Insights"
                                aria-label="Close Insights"
                            >
                                <Maximize2 size={18} />
                            </button>
                        </div>

                        <div className="p-8 space-y-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-cyan-400">
                                    <Info size={18} />
                                    <h4 className="text-xs font-black uppercase tracking-widest">Executive Summary</h4>
                                </div>
                                <p className="text-slate-300 leading-relaxed text-lg italic bg-slate-950/50 p-6 rounded-2xl border border-slate-800 shadow-inner">
                                    {webInsights.text}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-violet-400">
                                    <ImageIcon size={18} />
                                    <h4 className="text-xs font-black uppercase tracking-widest">Visual Landscape Analysis</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { label: 'Primary Context', color: 'from-cyan-500/20 to-violet-500/20', icon: <Layers size={24} /> },
                                        { label: 'Market Sentiment', color: 'from-violet-500/20 to-rose-500/20', icon: <Activity size={24} /> },
                                        { label: 'Related Entities', color: 'from-emerald-500/20 to-cyan-500/20', icon: <Globe size={24} /> }
                                    ].map((v, idx) => (
                                        <div key={idx} className={`p-6 rounded-3xl bg-gradient-to-br ${v.color} border border-white/5 flex flex-col items-center justify-center gap-3 text-center group hover:scale-[1.02] transition-transform cursor-default shadow-lg shadow-black/20`}>
                                            <div className="p-4 bg-slate-950/80 rounded-2xl text-white shadow-xl group-hover:rotate-6 transition-transform">
                                                {v.icon}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-300">{v.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-amber-400">
                                    <ExternalLink size={18} />
                                    <h4 className="text-xs font-black uppercase tracking-widest">Verified Sources & Grounding</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {webInsights.sources.map((source, idx) => (
                                        <a
                                            key={idx}
                                            href={source.uri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:border-cyan-500/50 hover:bg-slate-900 transition-all group shadow-sm"
                                        >
                                            <div className="flex-1 min-w-0 pr-4">
                                                <p className="text-xs font-bold text-slate-200 truncate">{source.title}</p>
                                                <p className="text-[10px] text-slate-600 truncate mt-1">{source.uri}</p>
                                            </div>
                                            <ArrowUpRight size={16} className="text-slate-700 group-hover:text-cyan-400 transition-colors" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntelligentScraper;
