'use client';

import TaskItem from './TaskItem';

/**
 * Composant TaskList
 *
 * Affiche les tâches groupées par statut (À faire / Complétées).
 *
 * @param {Array}    tasks    - Tableau d'objets tâche
 * @param {function} onToggle - Fonction appelée pour basculer l'état d'une tâche
 * @param {function} onDelete - Fonction appelée lors de la suppression d'une tâche
 */
const TaskList = ({ tasks, onToggle, onDelete }) => {
    const hasTasks = tasks && tasks.length > 0;

    const pending = tasks.filter(t => !t.completed);
    const done = tasks.filter(t => t.completed);

    return (
        <section aria-label="Liste de vos tâches" className="w-full space-y-8">
            {!hasTasks ? (
                /* État vide */
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <p className="text-stone-500 font-semibold text-base">Aucune tâche pour le moment</p>
                    <p className="text-stone-400 text-sm mt-1">Créez votre première tâche !</p>
                </div>
            ) : (
                <>
                    {/* Groupe : À faire */}
                    {pending.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-base font-extrabold text-stone-800 uppercase tracking-wider">À faire</h2>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-800 text-white text-xs font-bold">
                                    {pending.length}
                                </span>
                            </div>
                            <ul className="grid grid-cols-1 gap-3" aria-label="Tâches à faire">
                                {pending.map((task) => (
                                    <li key={task.id}>
                                        <TaskItem
                                            title={task.title}
                                            description={task.description}
                                            priority={task.priority}
                                            completed={task.completed}
                                            onComplete={() => onToggle(task.id)}
                                            onDelete={() => onDelete(task.id)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Groupe : Complétées */}
                    {done.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-base font-extrabold text-stone-800 uppercase tracking-wider">Terminées</h2>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-400 text-white text-xs font-bold">
                                    {done.length}
                                </span>
                            </div>
                            <ul className="grid grid-cols-1 gap-3" aria-label="Tâches terminées">
                                {done.map((task) => (
                                    <li key={task.id}>
                                        <TaskItem
                                            title={task.title}
                                            description={task.description}
                                            priority={task.priority}
                                            completed={task.completed}
                                            onComplete={() => onToggle(task.id)}
                                            onDelete={() => onDelete(task.id)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default TaskList;