'use client';

import TaskItem from './TaskItem';

/**
 * Composant TaskList
 *
 * Affiche une liste de tâches sous forme de grille responsive.
 * 3 colonnes sur desktop, 1 colonne sur mobile.
 *
 * @param {Array}    tasks    - Tableau d'objets tâche
 * @param {function} onToggle - Fonction appelée pour basculer l'état d'une tâche
 * @param {function} onDelete - Fonction appelée lors de la suppression d'une tâche
 */
const TaskList = ({ tasks, onToggle, onDelete }) => {
    /* Vérifie si des tâches sont disponibles */
    const hasTasks = tasks && tasks.length > 0;

    return (
        <section
            className="w-full p-8 bg-slate-50 rounded-[3rem] min-h-[400px]"
            aria-label="Liste de vos tâches"
        >
            {!hasTasks ? (
                /* État vide */
                <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                    <p className="text-slate-500 font-medium text-lg">
                        Aucune tâche pour le moment
                    </p>
                </div>
            ) : (
                /* Grille de tâches : 1 colonne mobile, 3 colonnes desktop */
                <ul
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    aria-label="Tâches"
                >
                    {tasks.map((task) => (
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
            )}
        </section>
    );
};

export default TaskList;