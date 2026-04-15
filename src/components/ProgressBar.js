/**
 * Composant ProgressBar
 *
 * @param {number} percentage - Valeur de progression (0 à 100)
 * @param {string} label      - Libellé affiché au-dessus de la barre
 */
const ProgressBar = ({ percentage = 0, label = 'Progression' }) => {
    const safePercentage = Number.isFinite(percentage)
        ? Math.min(100, Math.max(0, Math.round(percentage)))
        : 0;

    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-stone-700">{label}</p>
                <p className="text-sm font-bold text-stone-800">{safePercentage}%</p>
            </div>

            <div
                className="h-3 w-full overflow-hidden rounded-full bg-stone-200"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={safePercentage}
                aria-label={label}
            >
                <div
                    className="h-full rounded-full bg-stone-800 transition-all duration-300 ease-out"
                    style={{ width: `${safePercentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
