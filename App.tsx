import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2
} from 'lucide-react';
import { Idea, Category, Tab, User, CMSAnnouncement, WebResult, SubscriptionPlan } from './types';
import { STORAGE_KEYS } from './constants';

import AuthView from './components/AuthView';
import CMSView from './components/CMSView';
import UserManagementView from './components/UserManagementView';
import BillingView from './components/BillingView';
import SpecializedAIG from './components/SpecializedAIG';
import Sidebar from './components/Sidebar';
import IntelligentScraper from './components/IntelligentScraper';
import CaptureView from './components/CaptureView';
import KnowledgeBank from './components/KnowledgeBank';
import MobileNav from './components/MobileNav';
import MobileLaunchHub from './components/MobileLaunchHub';
import AccountSettings from './components/AccountSettings';
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
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

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

  const requestNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        updateProfile({ notificationsEnabled: true });
        new Notification("Notifications Enabled!", { body: "You will now receive daily digests of your ideas." });
      }
    }
  };

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

  // Calculate readiness percentage
  const gpReady = googlePlayIcon ? 1 : 0;
  const asReady = appStoreIcon ? 1 : 0;
  const readiness = 50 + (gpReady * 15) + (asReady * 15);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row overflow-hidden pb-safe pt-safe">
      {!currentUser.hasCompletedTour && (
        <OnboardingTour onComplete={handleTourComplete} />
      )}

      <Sidebar
        currentUser={currentUser}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        handleLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {showNotification && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[250] animate-bounce bg-emerald-500 text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold">
            <CheckCircle2 size={18} /> {isDeploying ? 'Deployment Initialized...' : 'Sync Successful!'}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto w-full">
            {currentTab === 'capture' && (
              <CaptureView
                addIdea={addIdea}
                setSelectedCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
                isRecording={isRecording}
                audioLevel={audioLevel}
                startRecording={startRecording}
                stopRecording={stopRecording}
                transcript={transcript}
                typedInput={typedInput}
                setTypedInput={setTypedInput}
                isSaving={isSaving}
                cmsContent={cmsContent}
                triggerHaptic={triggerHaptic}
              />
            )}

            {currentTab === 'bank' && (
              <KnowledgeBank
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filteredIdeas={filteredIdeas}
                triggerHaptic={triggerHaptic}
              />
            )}

            {currentTab === 'search' && (
              <IntelligentScraper
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleDeepSearch={handleDeepSearch}
                isSearchingWeb={isSearchingWeb}
                webInsights={webInsights}
                setWebInsights={setWebInsights}
                triggerHaptic={triggerHaptic}
              />
            )}

            {currentTab === 'aig' && <SpecializedAIG />}

            {currentTab === 'mobile-hub' && (
              <MobileLaunchHub
                currentUser={currentUser}
                readiness={readiness}
                googlePlayIcon={googlePlayIcon}
                appStoreIcon={appStoreIcon}
                handleIconUpload={handleIconUpload}
                removeIcon={removeIcon}
                handleDeployToGooglePlay={handleDeployToGooglePlay}
                isDeploying={isDeploying}
                googleIconRef={googleIconRef}
                appStoreIconRef={appStoreIconRef}
              />
            )}

            {currentTab === 'stats' && (
              <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold mb-6">Activity Insights</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Ideas', val: userIdeas.length, color: 'text-cyan-400' },
                    { label: 'Voice Captures', val: userIdeas.filter(i => i.source === 'Voice').length, color: 'text-violet-400' },
                    { label: 'Typed Captures', val: userIdeas.filter(i => i.source === 'Typed').length, color: 'text-emerald-400' },
                    { label: 'New Today', val: userIdeas.filter(i => new Date(i.createdAt).toDateString() === new Date().toDateString()).length, color: 'text-rose-400' }
                  ].map(stat => (
                    <div key={stat.label} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-inner">
                      <p className="text-[10px] font-black uppercase text-slate-500 mb-2">{stat.label}</p>
                      <p className={`text-3xl font-black ${stat.color}`}>{stat.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentTab === 'cms' && <CMSView cmsContent={cmsContent} setCmsContent={setCmsContent} />}
            {currentTab === 'users' && <UserManagementView />}
            {currentTab === 'billing' && (
              <BillingView
                currentUser={currentUser}
                onUpdateSubscription={handleUpdateSubscription}
                triggerHaptic={triggerHaptic}
              />
            )}
            {currentTab === 'settings' && (
              <AccountSettings
                currentUser={currentUser}
                updateProfile={updateProfile}
                requestNotifications={requestNotifications}
                triggerHaptic={triggerHaptic}
              />
            )}
          </div>
        </div>

        <MobileNav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          triggerHaptic={triggerHaptic}
          currentUser={currentUser}
        />
      </main>
    </div>
  );
};

export default App;