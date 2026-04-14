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
    /* Conteneur plein écran centré */
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      {/* Titre principal */}
      <h1 className="text-5xl font-bold tracking-tight text-gray-900">
        TaskManager
      </h1>

      {/* Sous-titre */}
      <p className="mt-4 text-lg text-gray-500">
        Gérez vos tâches efficacement
      </p>

      {/* Bouton d'action */}
      <button
        className="mt-8 rounded-full bg-blue-600 px-8 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
        aria-label="Commencer à utiliser TaskManager"
      >
        Commencer
      </button>

      {/* Formulaire de création */}
      <div className="mt-10 w-full max-w-lg">
        <TaskCreateForm onCreateTask={handleCreate} />
      </div>

      {/* Filtres */}
      <div className="mt-6 w-full max-w-5xl">
        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          priority={priority}
          onPriorityChange={setPriority}
          onReset={() => { setSearch(''); setPriority(''); }}
        />
      </div>

      {/* Liste des tâches filtrées */}
      <div className="mt-6 w-full max-w-5xl">
        <TaskList
          tasks={filteredTasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
