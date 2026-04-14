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
            {/* Select de filtre par priorité */}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label="Filtrer les tâches par priorité"
                className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl outline-none transition-all focus:border-[#2E5BFF] text-slate-800 cursor-pointer appearance-none"
            >
                {/* Option par défaut — placeholder */}
                <option value="" aria-label="Toutes les priorités">
                    Toutes les priorités
                </option>

                <option value="High" aria-label="Priorité haute">
                    Haute
                </option>

                <option value="Medium" aria-label="Priorité moyenne">
                    Moyenne
                </option>

                <option value="Low" aria-label="Priorité basse">
                    Basse
                </option>
            </select>

            {/* Icône chevron bas (droite) */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-slate-400">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

export default PriorityFilter;
