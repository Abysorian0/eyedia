import React, { useRef } from 'react';
import {
    Smartphone,
    CheckCircle2,
    Clock,
    Shield,
    Activity,
    PlayCircle,
    Trash,
    Upload,
    Rocket,
    UploadCloud,
    Settings2,
    MonitorSmartphone,
    RefreshCw,
    ImageIcon,
    Loader2
} from 'lucide-react';
import { User } from '../types';

interface MobileLaunchHubProps {
    currentUser: User;
    readiness: number;
    googlePlayIcon: string | null;
    appStoreIcon: string | null;
    handleIconUpload: (e: React.ChangeEvent<HTMLInputElement>, platform: 'gp' | 'as') => void;
    removeIcon: (platform: 'gp' | 'as') => void;
    handleDeployToGooglePlay: () => void;
    isDeploying: boolean;
    googleIconRef: React.RefObject<HTMLInputElement>;
    appStoreIconRef: React.RefObject<HTMLInputElement>;
}

const MobileLaunchHub: React.FC<MobileLaunchHubProps> = ({
    currentUser,
    readiness,
    googlePlayIcon,
    appStoreIcon,
    handleIconUpload,
    removeIcon,
    handleDeployToGooglePlay,
    isDeploying,
    googleIconRef,
    appStoreIconRef
}) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-emerald-600 to-cyan-700 text-white rounded-3xl shadow-lg shadow-emerald-500/20">
                        <Smartphone size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-white">Mobile Launch Hub</h2>
                        <p className="text-slate-500 text-sm">Deploy IdeaFlow to Google Play and Apple App Store.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl self-start md:self-auto">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">TWA Engine v3.1</span>
                </div>
            </header>

            {/* Progress Tracker */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${readiness}%` }}></div>
                </div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Activity size={16} className="text-emerald-400" /> Deployment Readiness
                    </h3>
                    <span className="text-xs font-black text-emerald-400">{readiness}% Complete</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Core Bundle', status: 'verified', icon: <CheckCircle2 size={16} /> },
                        { label: 'Google Icon', status: googlePlayIcon ? 'verified' : 'pending', icon: googlePlayIcon ? <CheckCircle2 size={16} /> : <Clock size={16} /> },
                        { label: 'Apple Icon', status: appStoreIcon ? 'verified' : 'pending', icon: appStoreIcon ? <CheckCircle2 size={16} /> : <Clock size={16} /> },
                        { label: 'Review', status: (currentUser.mobileLaunchStatus === 'Store Review' || currentUser.mobileLaunchStatus === 'Live on Google Play') ? 'verified' : 'waiting', icon: <Shield size={16} /> }
                    ].map((item, idx) => (
                        <div key={idx} className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all ${item.status === 'verified' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                            item.status === 'pending' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                                'bg-slate-950 border-slate-800 text-slate-600'
                            }`}>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
                                {item.icon}
                            </div>
                            <div className={`h-1 rounded-full ${item.status === 'verified' ? 'bg-emerald-500' :
                                item.status === 'pending' ? 'bg-amber-500' : 'bg-slate-800'
                                }`}></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Google Play Prominent Card */}
                <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl space-y-8 flex flex-col transition-all hover:border-emerald-500/30 group">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-[1.5rem] shadow-inner">
                                <PlayCircle size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white">Google Play</h3>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Store Listing</p>
                            </div>
                        </div>
                        {currentUser.mobileLaunchStatus === 'Store Review' && (
                            <span className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black uppercase text-amber-500 tracking-widest">
                                Reviewing
                            </span>
                        )}
                    </div>

                    {/* Prominent Icon Dropzone */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Master Android Icon</label>
                        </div>

                        <div
                            onClick={() => googleIconRef.current?.click()}
                            className={`group relative h-64 rounded-[2.5rem] border-4 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center gap-4 cursor-pointer shadow-2xl ${googlePlayIcon ? 'bg-slate-950 border-emerald-500/50' : 'bg-slate-950/50 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900'
                                }`}
                        >
                            <input type="file" ref={googleIconRef} className="hidden" accept="image/*" onChange={(e) => handleIconUpload(e, 'gp')} />

                            {googlePlayIcon ? (
                                <>
                                    <img src={googlePlayIcon} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md" alt="Bg" />
                                    <div className="relative group-hover:scale-110 transition-transform duration-500">
                                        <img src={googlePlayIcon} className="relative w-40 h-40 rounded-[2.5rem] shadow-2xl object-cover border-4 border-slate-900" alt="Play Icon" />
                                    </div>
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); removeIcon('gp'); }} className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl transition-all shadow-lg backdrop-blur-md">
                                            <Trash size={20} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center text-slate-600 group-hover:text-emerald-500 transition-all shadow-xl">
                                        <Upload size={32} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-black text-white uppercase tracking-widest">Upload Google Icon</p>
                                        <p className="text-[10px] text-slate-500 mt-1">512x512 PNG Required</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleDeployToGooglePlay}
                            disabled={isDeploying || !googlePlayIcon}
                            className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl ${isDeploying
                                ? 'bg-slate-800 text-slate-500'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:grayscale'
                                }`}
                        >
                            {isDeploying ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> Deploying...
                                </>
                            ) : (
                                <>
                                    <Rocket size={20} /> Deploy to Google Play
                                </>
                            )}
                        </button>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex-1 py-4 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2">
                                <UploadCloud size={16} /> Sync Listing
                            </button>
                            <button className="flex-1 py-4 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2">
                                <Settings2 size={16} /> API Access
                            </button>
                        </div>
                    </div>
                </div>

                {/* Device Preview Section */}
                <div className="space-y-6">
                    {/* Live Mobile Home Screen Preview */}
                    <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden h-[340px] flex flex-col">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
                        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-10 text-center">Live OS Preview</h4>

                        <div className="flex-1 flex flex-col items-center justify-center gap-6">
                            <div className="relative">
                                <div className="w-28 h-28 rounded-[2rem] bg-slate-950 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden transition-all duration-500 transform hover:scale-105">
                                    {googlePlayIcon ? (
                                        <img src={googlePlayIcon} className="w-full h-full object-cover" alt="App Icon" />
                                    ) : (
                                        <div className="flex flex-col items-center opacity-10">
                                            <Smartphone size={32} />
                                            <span className="text-[10px] font-bold mt-2 tracking-tighter">APP ICON</span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                    <span className="text-[13px] font-bold text-white tracking-wide">IdeaFlow</span>
                                </div>
                                {googlePlayIcon && (
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-rose-600 border-4 border-slate-900 rounded-full flex items-center justify-center text-xs font-black shadow-lg animate-bounce">
                                        12
                                    </div>
                                )}
                            </div>

                            <div className="mt-12 w-full grid grid-cols-4 gap-4 px-10 opacity-20 grayscale pointer-events-none">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 bg-slate-800 rounded-2xl shadow-inner"></div>
                                        <div className="w-8 h-1.5 bg-slate-800 rounded-full"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Apple Assets Management */}
                    <div
                        onClick={() => appStoreIconRef.current?.click()}
                        className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 flex items-center justify-between transition-all hover:border-white/10 group cursor-pointer"
                    >
                        <input type="file" ref={appStoreIconRef} className="hidden" accept="image/*" onChange={(e) => handleIconUpload(e, 'as')} />
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 text-white rounded-2xl group-hover:scale-110 transition-transform">
                                {appStoreIcon ? (
                                    <img src={appStoreIcon} className="w-6 h-6 rounded-md object-cover" alt="AS Icon" />
                                ) : (
                                    <Smartphone size={24} />
                                )}
                            </div>
                            <div>
                                <h4 className="font-black text-white">Apple App Store</h4>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                    {appStoreIcon ? 'Asset Link Active' : 'Waiting for 1024px PNG'}
                                </p>
                            </div>
                        </div>
                        {!appStoreIcon && (
                            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                                <AlertTriangle size={18} className="animate-pulse" />
                            </div>
                        )}
                        {appStoreIcon && (
                            <button onClick={(e) => { e.stopPropagation(); removeIcon('as'); }} className="p-2 text-slate-600 hover:text-rose-500">
                                <Trash size={16} />
                            </button>
                        )}
                    </div>

                    {/* Launch Diagnostics */}
                    <div className="bg-slate-950/50 border border-slate-800 rounded-[2.5rem] p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <MonitorSmartphone size={16} className="text-cyan-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Instance Health</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                <p className="text-[10px] font-black text-slate-600 uppercase mb-1">Haptics</p>
                                <p className="text-xs font-bold text-emerald-400">READY</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                <p className="text-[10px] font-black text-slate-600 uppercase mb-1">Push Sync</p>
                                <p className="text-xs font-bold text-emerald-400">SYNCING</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Instance Control */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-center md:text-left">
                        <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-cyan-400 shadow-inner">
                            <RefreshCw size={28} />
                        </div>
                        <div>
                            <h4 className="font-black text-white">Full Instance Reboot</h4>
                            <p className="text-xs text-slate-500">Reset native bridge and clear persistent buffers.</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-white text-xs font-black transition-all active:scale-95 uppercase tracking-widest">
                        <RefreshCw size={16} /> Force Reboot
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileLaunchHub;
