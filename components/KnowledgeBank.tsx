
import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Idea, Category } from '../types';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../constants';
import IdeaCard from './IdeaCard';

interface KnowledgeBankProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterCategory: Category | 'All';
    setFilterCategory: (cat: Category | 'All') => void;
    filteredIdeas: Idea[];
    setIdeas: React.Dispatch<React.SetStateAction<Idea[]>>;
    ideas: Idea[];
}

const KnowledgeBank: React.FC<KnowledgeBankProps> = ({
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filteredIdeas,
    setIdeas,
    ideas
}) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Knowledge Bank</h2>
                        <p className="text-slate-500 text-sm">Organized thoughts enhanced by AI.</p>
                    </div>
                </div>

                <div className="relative group p-1 bg-slate-800 rounded-[22px] transition-all duration-300">
                    <div className="bg-slate-950 rounded-[20px] p-2 flex items-center gap-2">
                        <SearchIcon className="ml-3 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Filter local ideas or tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none py-2 px-1 text-slate-200 placeholder:text-slate-700"
                        />
                    </div>
                </div>
            </header>

            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                <button
                    onClick={() => setFilterCategory('All')}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterCategory === 'All' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}
                >
                    All Ideas
                </button>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${filterCategory === cat ? CATEGORY_COLORS[cat] : 'bg-slate-900 text-slate-500 border-slate-800'
                            }`}
                    >
                        {CATEGORY_ICONS[cat]} {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredIdeas.length > 0 ? (
                    filteredIdeas.map(idea => (
                        <IdeaCard
                            key={idea.id}
                            idea={idea}
                            onDelete={id => setIdeas(ideas.filter(i => i.id !== id))}
                            onToggleStar={id =>
                                setIdeas(ideas.map(i => (i.id === id ? { ...i, starred: !i.starred } : i)))
                            }
                            onUpdate={(id, up) =>
                                setIdeas(ideas.map(i => (i.id === id ? { ...i, ...up } : i)))
                            }
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
                        <p className="text-slate-600 font-medium">No ideas found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KnowledgeBank;
