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
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Vue d'ensemble</p>
                <h2 className="mt-1 text-2xl font-black text-stone-900">
                    Tableau de <span className="text-[#3D6FE8]">bord</span>
                </h2>
            </header>

            {totalTasks === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white p-6 text-center shadow-sm">
                    <p className="text-sm font-bold text-stone-700">Aucune tâche à afficher.</p>
                    <p className="mt-1 text-sm text-stone-500">Ajoutez une tâche pour voir vos statistiques.</p>
                </div>
            ) : (
                <>
                    <TaskStats tasks={safeTasks} />
                    <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm">
                        <ProgressBar percentage={completionRate} label="Progression globale" />
                    </div>
                </>
            )}
        </section>
    );
};

export default Dashboard;
