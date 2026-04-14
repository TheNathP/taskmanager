'use client';

/**
 * Composant TaskItem
 *
 * Carte de tâche au style coloré inspiré de l'image de référence.
 *
 * @param {string}   title       - Le titre de la tâche
 * @param {string}   description - La description détaillée de la tâche
 * @param {string}   priority    - Niveau de priorité ('High', 'Medium', 'Low')
 * @param {boolean}  completed   - Statut de la tâche (complétée ou non)
 * @param {function} onComplete  - Fonction appelée pour marquer comme complétée
 * @param {function} onDelete    - Fonction appelée lors de la suppression
 */
const TaskItem = ({ title, description, priority, completed, onComplete, onDelete }) => {
    // Association des priorités à des couleurs de carte vives
    const cardColors = {
        High: 'bg-[#E05C4A]',    // Coral rouge
        Medium: 'bg-[#D4A827]',  // Jaune doré
        Low: 'bg-[#2A8C6E]',     // Vert émeraude
    };

    const cardBg = cardColors[priority] || 'bg-[#3D6FE8]';

    const priorityLabels = {
        High: 'Haute',
        Medium: 'Moyenne',
        Low: 'Basse',
    };

    return (
        <article className={`flex flex-col justify-between p-5 rounded-[1.75rem] min-h-[140px] ${cardBg} ${completed ? 'opacity-60' : ''} transition-opacity`}>
            {/* En-tête : titre + badge état */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className={`text-lg font-extrabold text-white leading-snug ${completed ? 'line-through' : ''}`}>
                    {title}
                </h3>
                {/* Cercle de complétion */}
                <button
                    type="button"
                    onClick={onComplete}
                    aria-label={`Marquer la tâche "${title}" comme ${completed ? 'non complétée' : 'complétée'}`}
                    className={`flex-shrink-0 w-7 h-7 rounded-full border-2 border-white/70 flex items-center justify-center transition-all active:scale-90 ${completed ? 'bg-white' : 'bg-transparent hover:bg-white/20'}`}
                >
                    {completed && (
                        <svg className="w-4 h-4 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Description */}
            {description && (
                <p className="text-white/75 text-xs leading-relaxed mb-4 line-clamp-2">
                    {description}
                </p>
            )}

            {/* Pied de carte : priorité + supprimer */}
            <div className="flex items-center justify-between mt-auto">
                {/* Badge priorité */}
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/15 text-white text-xs font-bold uppercase tracking-wider">
                    {priorityLabels[priority] || priority}
                </span>

                {/* Bouton supprimer */}
                <button
                    type="button"
                    onClick={onDelete}
                    aria-label={`Supprimer la tâche "${title}"`}
                    className="flex items-center gap-1 text-white/70 hover:text-white text-xs font-semibold transition-colors active:scale-95"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                </button>
            </div>
        </article>
    );
};

export default TaskItem;
