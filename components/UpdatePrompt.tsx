import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

interface UpdatePromptProps {
    onUpdate: () => void;
}

const UpdatePrompt: React.FC<UpdatePromptProps> = ({ onUpdate }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Listen for service worker updates
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                setShow(true);
            });
        }
    }, []);

    const handleUpdate = () => {
        setShow(false);
        onUpdate();
        window.location.reload();
    };

    if (!show) return null;

    return (
        <div className="fixed top-20 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 animate-in slide-in-from-top-8 duration-500">
            <div className="bg-gradient-to-br from-emerald-600 to-cyan-600 p-[2px] rounded-2xl shadow-2xl">
                <div className="bg-slate-900 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shrink-0 animate-pulse">
                            <RefreshCw size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-white mb-1">Update Available</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                A new version of IdeaFlow is ready to install.
                            </p>
                        </div>
                        <button
                            onClick={() => setShow(false)}
                            className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleUpdate}
                            className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                        >
                            Update Now
                        </button>
                        <button
                            onClick={() => setShow(false)}
                            className="px-4 py-2.5 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                        >
                            Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePrompt;
