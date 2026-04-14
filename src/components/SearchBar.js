'use client';

/**
 * Composant SearchBar
 *
 * Barre de recherche avec icône loupe et bouton d'effacement.
 *
 * @param {string}   value    - Valeur actuelle de l'input
 * @param {function} onChange - Fonction appelée à chaque changement de valeur
 */
const SearchBar = ({ value, onChange }) => {
    /* Efface le contenu de la recherche */
    const handleClear = () => {
        onChange('');
    };

    return (
        <div className="relative w-full">
            {/* Label accessible masqué visuellement */}
            <label htmlFor="search" className="sr-only">
                Rechercher une tâche
            </label>

            {/* Icône loupe (gauche) */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-slate-400">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
            </div>

            {/* Champ de recherche */}
            <input
                id="search"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Rechercher une tâche..."
                className="w-full pl-14 pr-12 py-4 bg-white border-2 border-slate-200 rounded-2xl outline-none transition-all focus:border-[#2E5BFF] text-slate-800 placeholder-slate-400"
            />

            {/* Bouton d'effacement (droite) — affiché seulement si l'input n'est pas vide */}
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Effacer la recherche"
                    className="absolute inset-y-0 right-0 flex items-center pr-5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchBar;
