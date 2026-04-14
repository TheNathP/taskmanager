'use client';

import SearchBar from './SearchBar';
import PriorityFilter from './PriorityFilter';

/**
 * Composant TaskFilters
 *
 * Regroupe la SearchBar, le PriorityFilter et un lien de réinitialisation.
 */
const TaskFilters = ({ search, onSearchChange, priority, onPriorityChange, onReset }) => {
    const hasActiveFilters = search !== '' || priority !== '';

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Ligne principale : SearchBar + PriorityFilter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex-1">
                    <SearchBar value={search} onChange={onSearchChange} />
                </div>
                <div className="sm:w-52">
                    <PriorityFilter value={priority} onChange={onPriorityChange} />
                </div>
            </div>

            {/* Réinitialisation */}
            {hasActiveFilters && (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onReset}
                        aria-label="Réinitialiser tous les filtres"
                        className="text-xs text-stone-400 hover:text-[#3D6FE8] font-semibold underline underline-offset-2 transition-colors"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskFilters;
