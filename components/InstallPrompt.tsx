import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Show prompt after 3 seconds delay
            setTimeout(() => {
                setShowPrompt(true);
            }, 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`User ${outcome} the install prompt`);
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Don't show again for this session
    };

    if (!showPrompt || !deferredPrompt) return null;

    return (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 animate-in slide-in-from-bottom-8 duration-500">
            <div className="bg-gradient-to-br from-cyan-600 to-violet-600 p-[2px] rounded-2xl shadow-2xl">
                <div className="bg-slate-900 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shrink-0">
                            <Download size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-white mb-1">Install IdeaFlow</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Install this app on your device for quick access and offline support.
                            </p>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleInstall}
                            className="flex-1 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                        >
                            Install Now
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="px-4 py-2.5 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                        >
                            Not Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
