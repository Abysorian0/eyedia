
import React from 'react';
import { User, Tab } from '../types';
import { TABS } from '../constants';

interface MobileNavProps {
    currentUser: User;
    currentTab: Tab;
    setCurrentTab: (tab: Tab) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({
    currentUser,
    currentTab,
    setCurrentTab
}) => {
    return (
        <div className="md:hidden flex bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 p-2 shrink-0">
            {TABS.map(tab => (
                (!tab.adminOnly || currentUser.isAdmin) && (
                    <button
                        key={tab.id}
                        onClick={() => setCurrentTab(tab.id)}
                        className={`flex-1 flex flex-col items-center py-2 ${currentTab === tab.id ? 'text-cyan-400' : 'text-slate-500'
                            }`}
                    >
                        {tab.icon}
                        <span className="text-[8px] font-bold mt-1 uppercase">{tab.label}</span>
                    </button>
                )
            ))}
        </div>
    );
};

export default MobileNav;
