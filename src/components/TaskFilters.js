'use client';

import SearchBar from './SearchBar';
import PriorityFilter from './PriorityFilter';

/**
 * Composant TaskFilters
 *
 * Regroupe la SearchBar, le PriorityFilter et un lien de réinitialisation.
 *
 * @param {string}   search           - Valeur de la recherche textuelle
 * @param {function} onSearchChange   - Callback de mise à jour de la recherche
 * @param {string}   priority         - Valeur du filtre de priorité
 * @param {function} onPriorityChange - Callback de mise à jour de la priorité
 * @param {function} onReset          - Callback de réinitialisation de tous les filtres
 */
const TaskFilters = ({ search, onSearchChange, priority, onPriorityChange, onReset }) => {
    /* Vérifie si au moins un filtre est actif */
    const hasActiveFilters = search !== '' || priority !== '';

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Ligne principale : SearchBar + PriorityFilter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
                {/* Barre de recherche */}
                <div className="flex-1">
                    <SearchBar value={search} onChange={onSearchChange} />
                </div>

                {/* Filtre par priorité */}
                <div className="sm:w-56">
                    <PriorityFilter value={priority} onChange={onPriorityChange} />
                </div>
            </div>

            {/* Lien de réinitialisation — affiché seulement si un filtre est actif */}
            {hasActiveFilters && (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onReset}
                        aria-label="Réinitialiser tous les filtres"
                        className="text-sm text-slate-400 hover:text-[#2E5BFF] underline underline-offset-2 transition-colors"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskFilters;
