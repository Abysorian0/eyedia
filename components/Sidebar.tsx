
import React from 'react';
import {
    Zap,
    LogOut,
    User as UserIcon,
    Crown
} from 'lucide-react';
import { User, Tab } from '../types';
import { TABS } from '../constants';

interface SidebarProps {
    currentUser: User;
    currentTab: Tab;
    setCurrentTab: (tab: Tab) => void;
    handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    currentUser,
    currentTab,
    setCurrentTab,
    handleLogout
}) => {
    return (
        <nav className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-6 shrink-0">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-violet-600 flex items-center justify-center">
                    <Zap size={22} className="text-white fill-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">IdeaFlow</h1>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Member Portal</p>
                </div>
            </div>

            <div className="space-y-1.5">
                {TABS.map(tab => (
                    (!tab.adminOnly || currentUser.isAdmin) && (
                        <button
                            key={tab.id}
                            onClick={() => setCurrentTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentTab === tab.id
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner'
                                : 'text-slate-400 hover:bg-slate-800/50'
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
                        <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest">Your Plan</span>
                        {currentUser.subscriptionPlan !== 'Free' && <Crown size={12} className="text-amber-400" />}
                    </div>
                    <p className="text-sm font-bold">{currentUser.subscriptionPlan}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Upgrade for more power</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                        <UserIcon size={20} className="text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{currentUser.username}</p>
                        <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Logout"
                        aria-label="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
