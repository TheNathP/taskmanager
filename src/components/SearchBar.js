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
    const handleClear = () => onChange('');

    return (
        <div className="relative w-full">
            <label htmlFor="search" className="sr-only">
                Rechercher une tâche
            </label>

            {/* Icône loupe */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-stone-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
            </div>

            {/* Input */}
            <input
                id="search"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Rechercher une tâche..."
                className="w-full pl-12 pr-10 py-3 bg-white border-2 border-transparent rounded-full outline-none transition-all focus:border-[#3D6FE8] text-stone-800 placeholder-stone-400 text-sm font-medium shadow-sm"
            />

            {/* Effacer */}
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Effacer la recherche"
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 hover:text-stone-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchBar;
