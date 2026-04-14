'use client';

/**
 * Composant PriorityFilter
 *
 * Select permettant de filtrer les tâches par niveau de priorité.
 *
 * @param {string}   value    - Valeur sélectionnée ('', 'High', 'Medium', 'Low')
 * @param {function} onChange - Fonction appelée à chaque changement de sélection
 */
const PriorityFilter = ({ value, onChange }) => {
    return (
        <div className="relative w-full">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label="Filtrer les tâches par priorité"
                className="w-full px-5 py-3 bg-white border-2 border-transparent rounded-full outline-none transition-all focus:border-[#3D6FE8] text-stone-700 text-sm font-semibold cursor-pointer appearance-none shadow-sm"
            >
                <option value="">Toutes les priorités</option>
                <option value="High">Haute priorité</option>
                <option value="Medium">Priorité moyenne</option>
                <option value="Low">Priorité basse</option>
            </select>

            {/* Icône chevron */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-stone-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

export default PriorityFilter;
