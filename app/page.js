'use client';

import { useState } from 'react';
import TaskList from '../src/components/TaskList';
import TaskCreateForm from '../src/components/TaskCreateForm';
import TaskFilters from '../src/components/TaskFilters';

/* Page d'accueil principale de TaskManager */
export default function Home() {
  /* État initial des tâches */
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Créer le design system', description: 'Définir les couleurs, typographies et composants de base.', priority: 'High', completed: false },
    { id: 2, title: "Intégrer l'API REST", description: 'Connecter le front-end aux endpoints du back-end.', priority: 'Medium', completed: false },
    { id: 3, title: 'Rédiger la documentation', description: 'Documenter les composants et les règles du projet.', priority: 'Low', completed: true },
  ]);

  const [showForm, setShowForm] = useState(false);

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

  /* États des filtres */
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('');

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
          <button
            onClick={() => setShowForm((v) => !v)}
            aria-label="Créer une nouvelle tâche"
            className="flex items-center gap-2 bg-[#3D6FE8] hover:bg-blue-700 active:scale-95 transition-all text-white font-bold px-5 py-3 rounded-full shadow-lg shadow-blue-500/20 text-sm"
          >
            <span className="text-lg leading-none">+</span> Nouvelle tâche
          </button>
        </div>

        <p className="text-stone-500 text-sm mb-8">
          {tasks.filter(t => !t.completed).length} tâche{tasks.filter(t => !t.completed).length !== 1 ? 's' : ''} en cours
        </p>

        {/* Formulaire de création (collapsible) */}
        {showForm && (
          <div className="mb-8">
            <TaskCreateForm onCreateTask={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        )}

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
