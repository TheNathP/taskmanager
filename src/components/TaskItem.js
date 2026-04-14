'use client';

/**
 * Composant TaskItem
 *
 * @param {string}   title       - Le titre de la tâche
 * @param {string}   description - La description détaillée de la tâche
 * @param {string}   priority    - Niveau de priorité ('High', 'Medium', 'Low')
 * @param {boolean}  completed   - Statut de la tâche (complétée ou non)
 * @param {function} onComplete  - Fonction appelée pour marquer comme complétée
 * @param {function} onDelete    - Fonction appelée lors de la suppression
 */
const TaskItem = ({ title, description, priority, completed, onComplete, onDelete }) => {
    // Association des priorités à des styles Tailwind
    const priorityColors = {
        High: 'text-red-600 bg-red-50',
        Medium: 'text-amber-600 bg-amber-50',
        Low: 'text-emerald-600 bg-emerald-50',
    };

    const priorityStyle = priorityColors[priority] || 'text-slate-600 bg-slate-50';

    return (
        <article className="flex flex-col p-6 bg-white rounded-[2rem] shadow-sm border border-slate-100 max-w-sm">
            {/* Contenu de la tâche */}
            <div className="flex flex-col space-y-2 mb-6">
                <h3 className={`text-xl font-bold text-slate-900 ${completed ? 'line-through opacity-50' : ''}`}>
                    {title}
                </h3>

                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit ${priorityStyle}`}>
                    {priority}
                </span>

                <p className="text-slate-500 text-sm leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
                <button
                    type="button"
                    onClick={onComplete}
                    aria-label={`Marquer la tâche "${title}" comme complétée`}
                    className="flex-1 px-4 py-3 bg-[#2E5BFF] hover:bg-blue-700 text-white text-sm font-bold rounded-full transition-all active:scale-95"
                >
                    Compléter
                </button>

                <button
                    type="button"
                    onClick={onDelete}
                    aria-label={`Supprimer la tâche "${title}"`}
                    className="px-4 py-3 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-sm font-bold rounded-full transition-all active:scale-95"
                >
                    Supprimer
                </button>
            </div>
        </article>
    );
};

export default TaskItem;
