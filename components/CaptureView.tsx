
import React from 'react';
import {
    Bell,
    Sparkles,
    Tag,
    Mic,
    Keyboard,
    Loader2
} from 'lucide-react';
import { Category, CMSAnnouncement } from '../types';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../constants';
import AudioVisualizer from './AudioVisualizer';

interface CaptureViewProps {
    cmsContent: CMSAnnouncement[];
    selectedCategory: Category;
    setSelectedCategory: (cat: Category) => void;
    isRecording: boolean;
    audioLevel: number;
    transcript: string;
    startRecording: () => void;
    stopRecording: () => void;
    addIdea: (content: string, source: "Voice" | "Typed", category: Category, tags: string[]) => void;
    isSaving: boolean;
    typedInput: string;
    setTypedInput: (input: string) => void;
}

const CaptureView: React.FC<CaptureViewProps> = ({
    cmsContent,
    selectedCategory,
    setSelectedCategory,
    isRecording,
    audioLevel,
    transcript,
    startRecording,
    stopRecording,
    addIdea,
    isSaving,
    typedInput,
    setTypedInput
}) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {cmsContent.some(c => c.isActive) && (
                <div className="mb-8 p-6 bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-violet-500/30 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                        <Sparkles size={80} />
                    </div>
                    <h4 className="text-xs font-black uppercase text-violet-400 mb-2 flex items-center gap-2 tracking-widest">
                        <Bell size={12} /> Featured Announcement
                    </h4>
                    {cmsContent.filter(c => c.isActive).slice(0, 1).map(c => (
                        <div key={c.id}>
                            <h3 className="text-xl font-bold mb-1">{c.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{c.text}</p>
                        </div>
                    ))}
                </div>
            )}

            <header>
                <h2 className="text-2xl font-bold mb-1">New Capture</h2>
                <p className="text-slate-500 text-sm">Organize your thoughts with AI precision.</p>
            </header>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                        <Tag size={18} />
                    </div>
                    <h3 className="font-bold text-sm uppercase tracking-widest">Select Context</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 gap-2 group ${selectedCategory === cat
                                    ? CATEGORY_COLORS[cat] + ' scale-[1.05] shadow-lg shadow-cyan-500/5'
                                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                                }`}
                        >
                            <div className={`transition-transform duration-300 group-hover:scale-110`}>
                                {CATEGORY_ICONS[cat]}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-tighter">{cat}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2 text-violet-400">
                            <Mic size={20} /> Voice Mode
                        </h3>
                        <div className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-500">
                            PCM 16k
                        </div>
                    </div>
                    <AudioVisualizer isRecording={isRecording} audioLevel={audioLevel} />
                    {transcript && (
                        <div className="p-3 bg-slate-950 rounded-xl text-sm italic opacity-80 max-h-24 overflow-y-auto border border-slate-800">
                            {transcript}
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all active:scale-[0.98] ${isRecording ? 'bg-rose-500 hover:bg-rose-600' : 'bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-600/20'
                                }`}
                        >
                            {isRecording ? 'Stop Recording' : 'Start Capture'}
                        </button>
                        {!isRecording && transcript && (
                            <button
                                onClick={() => addIdea(transcript, 'Voice', selectedCategory, [])}
                                disabled={isSaving}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                            >
                                {isSaving ? 'Processing...' : 'Save As ' + selectedCategory}
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                    <h3 className="font-bold flex items-center gap-2 text-cyan-400">
                        <Keyboard size={20} /> Typed Mode
                    </h3>
                    <textarea
                        value={typedInput}
                        onChange={e => setTypedInput(e.target.value)}
                        className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder:text-slate-700"
                        placeholder="Start drafting your next big thing..."
                    />
                    <button
                        onClick={() => {
                            addIdea(typedInput, 'Typed', selectedCategory, []);
                            setTypedInput('');
                        }}
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-cyan-600/20 disabled:opacity-50"
                        disabled={!typedInput.trim() || isSaving}
                    >
                        {isSaving ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 size={18} className="animate-spin" /> Enhancing...
                            </span>
                        ) : 'Save As ' + selectedCategory}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CaptureView;
