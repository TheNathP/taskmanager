'use client';

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import TaskList from '../src/components/TaskList';
import TaskCreateForm from '../src/components/TaskCreateForm';
import TaskFilters from '../src/components/TaskFilters';
import Dashboard from '../src/components/Dashboard';
import { useAuth } from "../src/contexts/AuthContext";

/* Page d'accueil principale de TaskManager */
export default function Home() {
  const router = useRouter();
  const { user, isAuthLoading, signOut } = useAuth();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  /* État initial des tâches */
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Créer le design system', description: 'Définir les couleurs, typographies et composants de base.', priority: 'High', completed: false },
    { id: 2, title: "Intégrer l'API REST", description: 'Connecter le front-end aux endpoints du back-end.', priority: 'Medium', completed: false },
    { id: 3, title: 'Rédiger la documentation', description: 'Documenter les composants et les règles du projet.', priority: 'Low', completed: true },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('');

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/login");
    }
  }, [isAuthLoading, router, user]);

  if (isAuthLoading) {
    return (
      <main className="min-h-screen bg-[#F2EDE4] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-2xl text-sm font-medium text-stone-500">
          Verification de la session...
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  /* Bascule l'état complété d'une tâche */
  const handleToggle = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  /* Supprime une tâche de la liste */
  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  /* Ajoute une nouvelle tâche en haut de la liste */
  const handleCreate = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    setShowForm(false);
  };

  const handleSignOut = async () => {
    setSignOutError("");
    setIsSigningOut(true);

    try {
      await signOut();
      router.replace("/login");
    } catch (error) {
      setSignOutError(error.message || "Impossible de se deconnecter.");
    } finally {
      setIsSigningOut(false);
    }
  };

  /* Tâches filtrées selon la recherche et la priorité */
  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter((task) => (priority ? task.priority === priority : true));

  return (
    <main className="min-h-screen bg-[#F2EDE4] px-4 py-10 sm:px-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-medium text-stone-500 tracking-wide uppercase">Bonjour 👋</p>
            <h1 className="text-4xl font-black text-stone-900 leading-tight">
              Task<span className="text-[#3D6FE8]">Manager</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              aria-label="Se deconnecter"
              className="rounded-full border border-stone-300 bg-white px-4 py-3 text-sm font-bold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningOut ? "Deconnexion..." : "Se deconnecter"}
            </button>
            <button
              onClick={() => setShowForm((v) => !v)}
              aria-label="Créer une nouvelle tâche"
              className="flex items-center gap-2 bg-[#3D6FE8] hover:bg-blue-700 active:scale-95 transition-all text-white font-bold px-5 py-3 rounded-full shadow-lg shadow-blue-500/20 text-sm"
            >
              <span className="text-lg leading-none">+</span> Nouvelle tâche
            </button>
          </div>
        </div>

        {signOutError && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
          >
            {signOutError}
          </p>
        )}

        <p className="text-stone-500 text-sm mb-8">
          {tasks.filter(t => !t.completed).length} tâche{tasks.filter(t => !t.completed).length !== 1 ? 's' : ''} en cours
        </p>

        {/* Formulaire de création (collapsible) */}
        {showForm && (
          <div className="mb-8">
            <TaskCreateForm onCreateTask={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {/* Tableau de bord */}
        <div className="mb-6">
          <Dashboard tasks={tasks} />
        </div>

        {/* Filtres */}
        <div className="mb-6">
          <TaskFilters
            search={search}
            onSearchChange={setSearch}
            priority={priority}
            onPriorityChange={setPriority}
            onReset={() => { setSearch(''); setPriority(''); }}
          />
        </div>

        {/* Liste des tâches filtrées */}
        <TaskList
          tasks={filteredTasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
