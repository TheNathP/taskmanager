import TaskStats from './TaskStats';
import ProgressBar from './ProgressBar';

/**
 * Composant Dashboard
 *
 * Assemble les composants TaskStats et ProgressBar.
 *
 * @param {Array} tasks - Tableau d'objets tâche
 */
const Dashboard = ({ tasks = [] }) => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const totalTasks = safeTasks.length;
    const completedTasks = safeTasks.filter((task) => task?.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <section aria-label="Tableau de bord des tâches" className="w-full space-y-4">
            <header>
                <h2 className="text-xl font-extrabold text-stone-900">Tableau de bord</h2>
            </header>

            {totalTasks === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center">
                    <p className="text-sm font-semibold text-stone-600">Aucune tâche à afficher.</p>
                    <p className="mt-1 text-sm text-stone-500">Ajoutez une tâche pour voir vos statistiques.</p>
                </div>
            ) : (
                <>
                    <TaskStats tasks={safeTasks} />
                    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                        <ProgressBar percentage={completionRate} label="Progression globale" />
                    </div>
                </>
            )}
        </section>
    );
};

export default Dashboard;
