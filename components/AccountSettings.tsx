
import React from 'react';
import { User } from '../types';

interface AccountSettingsProps {
    currentUser: User;
    updateProfile: (updates: Partial<User>) => void;
    requestNotifications: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
    currentUser,
    updateProfile,
    requestNotifications
}) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold">Account Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
                    <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest">
                        Profile Management
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label htmlFor="display-name" className="text-[10px] font-bold text-slate-500 uppercase px-2">
                                Display Name
                            </label>
                            <input
                                id="display-name"
                                type="text"
                                value={currentUser.username}
                                onChange={e => updateProfile({ username: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="Enter display name"
                                aria-label="Display Name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase px-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={currentUser.email}
                                onChange={e => updateProfile({ email: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="Enter email"
                                aria-label="Email"
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
                    <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest">
                        Preferences
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                        <div>
                            <p className="text-sm font-bold">Push Notifications</p>
                            <p className="text-[10px] text-slate-500">Alerts for daily digests & features</p>
                        </div>
                        <button
                            onClick={requestNotifications}
                            className={`w-12 h-6 rounded-full transition-colors relative ${currentUser.notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                                }`}
                            title={currentUser.notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
                            aria-label={currentUser.notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
                        >
                            <div
                                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${currentUser.notificationsEnabled ? 'left-7' : 'left-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
