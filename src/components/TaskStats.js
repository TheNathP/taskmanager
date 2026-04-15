/**
 * Composant TaskStats
 *
 * Affiche des statistiques globales sur les tâches :
 * - total
 * - complétées
 * - actives
 * - progression avec barre visuelle
 *
 * @param {Array} tasks - Tableau d'objets tâche ({ completed: boolean, ... })
 */
const TaskStats = ({ tasks = [] }) => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const totalTasks = safeTasks.length;
    const completedTasks = safeTasks.filter((task) => task?.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <section
            aria-label="Statistiques des tâches"
            className="w-full rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
        >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-stone-100 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Total</p>
                    <p className="mt-1 text-2xl font-extrabold text-stone-800">{totalTasks}</p>
                </div>

                <div className="rounded-xl bg-green-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Complétées</p>
                    <p className="mt-1 text-2xl font-extrabold text-green-800">{completedTasks}</p>
                </div>

                <div className="rounded-xl bg-amber-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Actives</p>
                    <p className="mt-1 text-2xl font-extrabold text-amber-800">{activeTasks}</p>
                </div>
            </div>

            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-stone-700">Progression</p>
                    <p className="text-sm font-bold text-stone-800">{progress}%</p>
                </div>

                <div
                    className="h-3 w-full overflow-hidden rounded-full bg-stone-200"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                    aria-label="Progression des tâches complétées"
                >
                    <div
                        className="h-full rounded-full bg-stone-800 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </section>
    );
};

export default TaskStats;
