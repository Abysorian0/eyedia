import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search as SearchIcon, 
  Database, 
  BarChart3, 
  Mic, 
  Keyboard, 
  X, 
  Sparkles,
  Zap,
  Star,
  Clock,
  CheckCircle2,
  LogOut,
  Bell,
  User as UserIcon,
  Globe,
  ArrowUpRight,
  ShieldCheck,
  Loader2,
  CreditCard,
  Crown,
  Tag,
  UserCog,
  FileSearch,
  Layers,
  ExternalLink,
  Info,
  Activity,
  Maximize2,
  Image as ImageIcon,
  Smartphone,
  PlayCircle,
  Apple,
  Download,
  AlertTriangle,
  ChevronRight,
  Shield,
  MonitorSmartphone,
  UploadCloud,
  Settings2,
  RefreshCw,
  Upload,
  Trash,
  Rocket
} from 'lucide-react';
import { Idea, Category, Stats, Tab, User, CMSAnnouncement, WebResult, SubscriptionPlan, MobileLaunchStatus } from './types';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS, STORAGE_KEYS, TABS } from './constants';
import IdeaCard from './components/IdeaCard';
import AudioVisualizer from './components/AudioVisualizer';
import AuthView from './components/AuthView';
import CMSView from './components/CMSView';
import UserManagementView from './components/UserManagementView';
import BillingView from './components/BillingView';
import OnboardingTour from './components/OnboardingTour';
import { enhanceIdea, searchWeb } from './services/gemini';

const App: React.FC = () => {
  // Global States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [cmsContent, setCmsContent] = useState<CMSAnnouncement[]>([]);
  const [currentTab, setCurrentTab] = useState<Tab>('capture');
  
  // App States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [webInsights, setWebInsights] = useState<{ text: string; sources: WebResult[] } | null>(null);
  
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [typedInput, setTypedInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Note');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Mobile Hub Assets
  const [googlePlayIcon, setGooglePlayIcon] = useState<string | null>(null);
  const [appStoreIcon, setAppStoreIcon] = useState<string | null>(null);
  const googleIconRef = useRef<HTMLInputElement>(null);
  const appStoreIconRef = useRef<HTMLInputElement>(null);

  // Mobile-specific haptics
  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = { light: 10, medium: 30, heavy: 60 };
      navigator.vibrate(patterns[style]);
    }
  };

  // Auth & Init
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    
    const savedCMS = localStorage.getItem(STORAGE_KEYS.CMS);
    if (savedCMS) setCmsContent(JSON.parse(savedCMS));
    
    const savedIdeas = localStorage.getItem(STORAGE_KEYS.IDEAS);
    if (savedIdeas) setIdeas(JSON.parse(savedIdeas));

    // Load icons from local storage if available
    const savedGP = localStorage.getItem('mobile_icon_gp');
    const savedAS = localStorage.getItem('mobile_icon_as');
    if (savedGP) setGooglePlayIcon(savedGP);
    if (savedAS) setAppStoreIcon(savedAS);
  }, []);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setCurrentTab('capture');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(updated));
    
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users.map(u => u.id === updated.id ? updated : u)));
  };

  const handleUpdateSubscription = (plan: SubscriptionPlan) => {
    updateProfile({ subscriptionPlan: plan, subscriptionActive: true });
  };

  const handleTourComplete = () => {
    updateProfile({ hasCompletedTour: true });
  };

  // Asset Handlers
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>, platform: 'gp' | 'as') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (platform === 'gp') {
          setGooglePlayIcon(base64String);
          localStorage.setItem('mobile_icon_gp', base64String);
          updateProfile({ mobileLaunchStatus: 'Asset Preparation' });
        } else {
          setAppStoreIcon(base64String);
          localStorage.setItem('mobile_icon_as', base64String);
        }
        triggerHaptic('medium');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeIcon = (platform: 'gp' | 'as') => {
    if (platform === 'gp') {
      setGooglePlayIcon(null);
      localStorage.removeItem('mobile_icon_gp');
    } else {
      setAppStoreIcon(null);
      localStorage.removeItem('mobile_icon_as');
    }
    triggerHaptic('light');
  };

  const handleDeployToGooglePlay = () => {
    if (!googlePlayIcon) {
      alert("Please upload a Google Play app icon before deploying.");
      return;
    }
    triggerHaptic('heavy');
    setIsDeploying(true);
    
    // Simulate deployment process
    setTimeout(() => {
      setIsDeploying(false);
      updateProfile({ mobileLaunchStatus: 'Store Review' });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }, 4000);
  };

  // Persistence
  useEffect(() => {
    if (currentUser) localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
  }, [ideas, currentUser]);

  const addIdea = async (content: string, source: "Voice" | "Typed", category: Category, tags: string[]) => {
    if (!currentUser || !content.trim()) return;
    triggerHaptic('medium');
    setIsSaving(true);
    const aiData = await enhanceIdea(content);
    const newIdea: Idea = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content, 
      source, 
      category,
      tags: Array.from(new Set([...tags, ...(aiData?.tags || [])])),
      createdAt: new Date().toISOString(),
      starred: false,
      aiSummary: aiData?.summary || undefined
    };
    setIdeas(prev => [newIdea, ...prev]);
    setIsSaving(false);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleDeepSearch = async () => {
    if (!searchQuery.trim() || isSearchingWeb) return;
    if (currentUser?.subscriptionPlan === 'Free') {
      alert("Stealth Deep Search is a Pro feature. Please upgrade to use it!");
      setCurrentTab('billing');
      return;
    }
    triggerHaptic('light');
    setIsSearchingWeb(true);
    setWebInsights(null);
    const results = await searchWeb(searchQuery);
    setWebInsights(results);
    setIsSearchingWeb(false);
  };

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      triggerHaptic('heavy');
      setIsRecording(true);
      setTranscript('');
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      const checkLevel = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        setAudioLevel(dataArray.reduce((a, b) => a + b, 0) / dataArray.length);
        if (isRecording) requestAnimationFrame(checkLevel);
      };
      checkLevel();
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.onresult = (e: any) => {
          setTranscript(Array.from(e.results).map((r: any) => r[0].transcript).join(''));
        };
        recognitionRef.current.start();
      }
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
    } catch (err) { alert("Mic denied."); }
  };

  const stopRecording = () => {
    triggerHaptic('medium');
    setIsRecording(false);
    setAudioLevel(0);
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
    recognitionRef.current?.stop();
    audioContextRef.current?.close();
  };

  if (!currentUser) return <AuthView onAuthSuccess={handleAuthSuccess} />;

  const userIdeas = ideas.filter(i => i.userId === currentUser.id);
  const filteredIdeas = userIdeas.filter(idea => {
    const matchesSearch = idea.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          idea.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'All' || idea.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics for the dashboard
  const stats: Stats = {
    total: userIdeas.length,
    voice: userIdeas.filter(i => i.source === 'Voice').length,
    typed: userIdeas.filter(i => i.source === 'Typed').length,
    today: userIdeas.filter(i => {
      const today = new Date().setHours(0, 0, 0, 0);
      const ideaDate = new Date(i.createdAt).setHours(0, 0, 0, 0);
      return today === ideaDate;
    }).length,
  };

  // Calculate readiness percentage
  const gpReady = googlePlayIcon ? 1 : 0;
  const asReady = appStoreIcon ? 1 : 0;
  const readiness = 50 + (gpReady * 15) + (asReady * 15);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row overflow-hidden pb-safe pt-safe">
      {!currentUser.hasCompletedTour && (
        <OnboardingTour onComplete={handleTourComplete} />
      )}

      {/* Sidebar - Desktop */}
      <nav className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-6 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-violet-600 flex items-center justify-center">
            <Zap size={22} className="text-white fill-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">IdeaFlow</h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Mobile Command</p>
          </div>
        </div>

        <div className="space-y-1.5">
          {TABS.map(tab => (
            (!tab.adminOnly || currentUser.isAdmin) && (
              <button
                key={tab.id}
                onClick={() => { triggerHaptic('light'); setCurrentTab(tab.id); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  currentTab === tab.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner' : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            )
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800 flex flex-col gap-4">
          <div 
            onClick={() => setCurrentTab('billing')}
            className="p-4 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 rounded-2xl cursor-pointer hover:border-cyan-500/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest">Plan</span>
              {currentUser.subscriptionPlan !== 'Free' && <Crown size={12} className="text-amber-400" />}
            </div>
            <p className="text-sm font-bold">{currentUser.subscriptionPlan}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <UserIcon size={20} className="text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{currentUser.username}</p>
              <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-rose-400 transition-colors"><LogOut size={18} /></button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {showNotification && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[250] animate-bounce bg-emerald-500 text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold">
            <CheckCircle2 size={18} /> {isDeploying ? 'Deployment Initialized...' : 'Sync Successful!'}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto w-full">
            
            {/* Mobile Launch Hub Refined */}
            {currentTab === 'mobile-hub' && (
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
                     <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{width: `${readiness}%`}}></div>
                   </div>
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Activity size={16} className="text-emerald-400" /> Deployment Readiness
                      </h3>
                      <span className="text-xs font-black text-emerald-400">{readiness}% Complete</span>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Core Bundle', status: 'verified', icon: <CheckCircle2 size={16}/> },
                        { label: 'Google Icon', status: googlePlayIcon ? 'verified' : 'pending', icon: googlePlayIcon ? <CheckCircle2 size={16}/> : <Clock size={16}/> },
                        { label: 'Apple Icon', status: appStoreIcon ? 'verified' : 'pending', icon: appStoreIcon ? <CheckCircle2 size={16}/> : <Clock size={16}/> },
                        { label: 'Review', status: (currentUser.mobileLaunchStatus === 'Store Review' || currentUser.mobileLaunchStatus === 'Live on Google Play') ? 'verified' : 'waiting', icon: <Shield size={16}/> }
                      ].map((item, idx) => (
                        <div key={idx} className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all ${
                          item.status === 'verified' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                          item.status === 'pending' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                          'bg-slate-950 border-slate-800 text-slate-600'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
                            {item.icon}
                          </div>
                          <div className={`h-1 rounded-full ${
                             item.status === 'verified' ? 'bg-emerald-500' :
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
                        className={`group relative h-64 rounded-[2.5rem] border-4 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center gap-4 cursor-pointer shadow-2xl ${
                          googlePlayIcon ? 'bg-slate-950 border-emerald-500/50' : 'bg-slate-950/50 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900'
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
                        className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
                          isDeploying 
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
                                    <ImageIcon size={32} />
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
                             {[1,2,3,4].map(i => (
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
                               <Apple size={24} />
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
                            <Zap size={28} />
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
            )}

            {/* Other Tab Routing Logic (Capture, Bank, Search, etc.) */}
            {currentTab === 'search' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <header className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-600/20 text-cyan-400 rounded-2xl">
                      <FileSearch size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black tracking-tight text-white">Intelligent Scraper</h2>
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
                        placeholder="Target query for scraping..."
                        className="flex-1 bg-transparent border-none outline-none py-4 text-lg text-white placeholder:text-slate-700"
                        onKeyDown={(e) => e.key === 'Enter' && handleDeepSearch()}
                      />
                      <button 
                        onClick={handleDeepSearch}
                        disabled={isSearchingWeb || !searchQuery.trim()}
                        className="bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSearchingWeb ? <Loader2 size={18} className="animate-spin" /> : <Layers size={18} />}
                        {isSearchingWeb ? '...' : 'Scrape'}
                      </button>
                    </div>
                  </div>
                </header>
              </div>
            )}

            {currentTab === 'capture' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header>
                  <h2 className="text-2xl font-bold mb-1 text-white">New Capture</h2>
                  <p className="text-slate-500 text-sm">Organize your thoughts with AI precision.</p>
                </header>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-x-auto no-scrollbar">
                  <div className="flex gap-3">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { triggerHaptic('light'); setSelectedCategory(cat); }}
                        className={`flex flex-col items-center justify-center p-4 min-w-[100px] rounded-2xl border transition-all duration-300 gap-2 group ${
                          selectedCategory === cat 
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
                      <h3 className="font-bold flex items-center gap-2 text-violet-400"><Mic size={20}/> Voice Mode</h3>
                    </div>
                    <AudioVisualizer isRecording={isRecording} audioLevel={audioLevel} />
                    <div className="flex gap-2">
                      <button 
                        onClick={isRecording ? stopRecording : startRecording} 
                        className={`flex-1 py-3 rounded-xl font-bold transition-all active:scale-[0.98] ${isRecording ? 'bg-rose-500 hover:bg-rose-600' : 'bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-600/20'}`}
                      >
                        {isRecording ? 'Stop' : 'Capture'}
                      </button>
                      {!isRecording && transcript && (
                        <button 
                          onClick={() => addIdea(transcript, 'Voice', selectedCategory, [])} 
                          disabled={isSaving}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20 disabled:opacity-50 text-white"
                        >
                          {isSaving ? '...' : 'Save'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                    <h3 className="font-bold flex items-center gap-2 text-cyan-400"><Keyboard size={20}/> Typed Mode</h3>
                    <textarea 
                      value={typedInput} 
                      onChange={e => setTypedInput(e.target.value)} 
                      className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder:text-slate-700 text-white" 
                      placeholder="Start drafting..."
                    />
                    <button 
                      onClick={() => { addIdea(typedInput, 'Typed', selectedCategory, []); setTypedInput(''); }} 
                      className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-cyan-600/20 disabled:opacity-50 text-white" 
                      disabled={!typedInput.trim() || isSaving}
                    >
                      {isSaving ? '...' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'bank' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <header className="flex flex-col gap-4">
                  <h2 className="text-2xl font-bold text-white">Knowledge Bank</h2>
                  <div className="relative group p-1 bg-slate-800 rounded-[22px] transition-all duration-300">
                    <div className="bg-slate-950 rounded-[20px] p-2 flex items-center gap-2">
                      <SearchIcon className="ml-3 text-slate-500" size={20} />
                      <input 
                        type="text"
                        placeholder="Filter ideas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none py-2 px-1 text-slate-200"
                      />
                    </div>
                  </div>
                </header>
                <div className="grid grid-cols-1 gap-4 pb-20 md:pb-0">
                  {filteredIdeas.length > 0 ? filteredIdeas.map(idea => (
                    <IdeaCard key={idea.id} idea={idea} onDelete={id => setIdeas(ideas.filter(i => i.id !== id))} onToggleStar={id => setIdeas(ideas.map(i => i.id === id ? {...i, starred: !i.starred} : i))} onUpdate={(id, up) => setIdeas(ideas.map(i => i.id === id ? {...i, ...up} : i))} />
                  )) : (
                    <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
                      <p className="text-slate-600 font-medium">No ideas found.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentTab === 'billing' && <BillingView user={currentUser} onUpdateSubscription={handleUpdateSubscription} />}
            {currentTab === 'cms' && <CMSView />}
            {currentTab === 'users' && currentUser.isAdmin && <UserManagementView currentUser={currentUser} />}
            {currentTab === 'settings' && (
               <div className="space-y-8 animate-in fade-in duration-500">
                 <h2 className="text-2xl font-bold text-white">Settings</h2>
                 <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
                    <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest">Profile Management</h3>
                    <div className="space-y-4">
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase px-2">Display Name</label><input type="text" value={currentUser.username} onChange={e => updateProfile({ username: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-white" /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase px-2">Email Address</label><input type="email" value={currentUser.email} onChange={e => updateProfile({ email: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-white" /></div>
                    </div>
                  </div>
               </div>
            )}

            {currentTab === 'stats' && (
               <div className="space-y-8 animate-in fade-in duration-500">
                 <h2 className="text-2xl font-bold text-white">Insights</h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                       <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Sparks</p>
                       <p className="text-3xl font-black text-white mt-1">{stats.total}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                       <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Voice Captures</p>
                       <p className="text-3xl font-black text-violet-400 mt-1">{stats.voice}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                       <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Typed Captures</p>
                       <p className="text-3xl font-black text-cyan-400 mt-1">{stats.typed}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                       <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Fresh Today</p>
                       <p className="text-3xl font-black text-emerald-400 mt-1">{stats.today}</p>
                    </div>
                 </div>
               </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex bg-slate-900/90 backdrop-blur-2xl border-t border-slate-800 p-3 pb-safe shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-[200]">
          {TABS.filter(t => !t.adminOnly || currentUser.isAdmin).slice(0, 5).map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => { triggerHaptic('light'); setCurrentTab(tab.id); }} 
              className={`flex-1 flex flex-col items-center py-1 transition-all relative ${currentTab === tab.id ? 'text-cyan-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <div className="relative">
                {tab.icon}
                {currentTab === tab.id && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                )}
              </div>
              <span className="text-[9px] font-black mt-1.5 uppercase tracking-tighter">{tab.label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;