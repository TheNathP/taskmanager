'use client';

import { useMemo, useState } from 'react';
import TaskItem from './TaskItem';

const normalizePriorityForCard = (priority) => {
  const value = String(priority || 'medium').toLowerCase();
  if (value === 'high') return 'High';
  if (value === 'low') return 'Low';
  return 'Medium';
};

const getMemberIdentity = (member) => {
  if (!member) {
    return { id: '', label: 'Membre inconnu' };
  }

  if (typeof member === 'string') {
    return { id: member, label: member };
  }

  const id = member.id || member.uid || '';
  const label = member.email || member.displayName || member.name || id || 'Membre';
  return { id, label };
};

/**
 * Vue détaillée d'une liste partagée.
 */
const SharedListView = ({
  list = {},
  tasks = [],
  currentUserId = '',
  members = [],
  onAddMember = async () => {},
  onRemoveMember = async () => {},
  onAddTask = async () => {},
  onUpdateTask = async () => {},
  onDeleteTask = async () => {},
  onBack = () => {},
}) => {
  const isOwner = Boolean(list?.ownerId && currentUserId && list.ownerId === currentUserId);
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeMembers = Array.isArray(members) ? members : [];

  const [memberEmail, setMemberEmail] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [error, setError] = useState('');
  const [isSubmittingMember, setIsSubmittingMember] = useState(false);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const pendingTasks = useMemo(
    () => safeTasks.filter((task) => !task?.completed),
    [safeTasks]
  );
  const completedTasks = useMemo(
    () => safeTasks.filter((task) => task?.completed),
    [safeTasks]
  );

  const handleAddMember = async (event) => {
    event.preventDefault();
    setError('');

    const email = memberEmail.trim().toLowerCase();
    if (!email) {
      setError("L'email du membre est obligatoire.");
      return;
    }

    try {
      setIsSubmittingMember(true);
      await onAddMember(email);
      setMemberEmail('');
    } catch (submitError) {
      setError(submitError.message || "Impossible d'ajouter ce membre.");
    } finally {
      setIsSubmittingMember(false);
    }
  };

  const handleAddTask = async (event) => {
    event.preventDefault();
    setError('');

    const title = newTaskTitle.trim();
    if (!title) {
      setError('Le titre de la tâche est obligatoire.');
      return;
    }

    try {
      setIsSubmittingTask(true);
      await onAddTask({
        title,
        priority: newTaskPriority,
      });
      setNewTaskTitle('');
      setNewTaskPriority('medium');
    } catch (submitError) {
      setError(submitError.message || "Impossible d'ajouter la tâche.");
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleToggleTask = async (task) => {
    setError('');
    try {
      await onUpdateTask(task.id, { completed: !task.completed });
    } catch (updateError) {
      setError(updateError.message || 'Impossible de mettre à jour la tâche.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    setError('');
    try {
      await onDeleteTask(taskId);
    } catch (deleteError) {
      setError(deleteError.message || 'Impossible de supprimer la tâche.');
    }
  };

  const handleRemoveMember = async (memberId) => {
    setError('');
    try {
      await onRemoveMember(memberId);
    } catch (removeError) {
      setError(removeError.message || 'Impossible de retirer ce membre.');
    }
  };

  return (
    <section
      aria-label={`Vue détaillée de ${list?.name || 'la liste partagée'}`}
      className="w-full space-y-6"
    >
      <header className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Liste partagée</p>
            <h2 className="mt-1 text-2xl font-black text-stone-900">{list?.name || 'Sans nom'}</h2>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2"
            aria-label="Retour à la vue principale"
          >
            Retour
          </button>
        </div>
      </header>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-extrabold text-stone-900">Membres</h3>
        <ul className="mt-4 space-y-2" aria-label="Liste des membres">
          {safeMembers.length === 0 ? (
            <li className="rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-500">Aucun membre.</li>
          ) : (
            safeMembers.map((member) => {
              const identity = getMemberIdentity(member);
              const isMemberOwner = identity.id && identity.id === list?.ownerId;

              return (
                <li
                  key={identity.id || identity.label}
                  className="flex items-center justify-between gap-3 rounded-xl bg-stone-50 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-sm font-medium text-stone-800">{identity.label}</p>
                    {isMemberOwner && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
                        Proprietaire
                      </span>
                    )}
                  </div>

                  {isOwner && !isMemberOwner && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(identity.id)}
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
                      aria-label={`Retirer ${identity.label}`}
                    >
                      Retirer
                    </button>
                  )}
                </li>
              );
            })
          )}
        </ul>

        <form onSubmit={handleAddMember} className="mt-5 flex flex-col gap-3 sm:flex-row" aria-label="Ajouter un membre">
          <label htmlFor="memberEmail" className="sr-only">
            Email du membre
          </label>
          <input
            id="memberEmail"
            type="email"
            value={memberEmail}
            onChange={(event) => setMemberEmail(event.target.value)}
            placeholder="email@exemple.com"
            className="w-full rounded-full border-2 border-transparent bg-stone-50 px-5 py-3 text-sm font-medium text-stone-900 outline-none transition focus:border-[#3D6FE8] focus:bg-white"
            required
          />
          <button
            type="submit"
            disabled={isSubmittingMember}
            className="rounded-full bg-[#3D6FE8] px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Ajouter un membre"
          >
            {isSubmittingMember ? 'Ajout...' : 'Ajouter un membre'}
          </button>
        </form>
      </div>

      <form
        onSubmit={handleAddTask}
        className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm"
        aria-label="Ajouter une tâche partagée"
      >
        <h3 className="text-lg font-extrabold text-stone-900">Nouvelle tâche partagée</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
          <label htmlFor="sharedTaskTitle" className="sr-only">
            Nom de la tâche
          </label>
          <input
            id="sharedTaskTitle"
            type="text"
            value={newTaskTitle}
            onChange={(event) => setNewTaskTitle(event.target.value)}
            placeholder="Nom de la tâche"
            className="w-full rounded-xl border-2 border-transparent bg-stone-50 px-5 py-3 text-sm font-medium text-stone-900 outline-none transition focus:border-[#3D6FE8] focus:bg-white"
            required
          />

          <select
            value={newTaskPriority}
            onChange={(event) => setNewTaskPriority(event.target.value)}
            className="rounded-xl border-2 border-transparent bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700 outline-none transition focus:border-[#3D6FE8] focus:bg-white"
            aria-label="Priorité de la tâche"
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmittingTask}
          className="mt-4 w-full rounded-full bg-[#3D6FE8] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Créer la tâche partagée"
        >
          {isSubmittingTask ? 'Creation...' : 'Ajouter la tâche'}
        </button>
      </form>

      <section aria-label="Liste des tâches partagées" className="space-y-8">
        {safeTasks.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-bold text-stone-700">Aucune tâche partagée.</p>
            <p className="mt-1 text-sm text-stone-500">Ajoutez une tâche pour commencer la collaboration.</p>
          </div>
        ) : (
          <>
            {pendingTasks.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="text-base font-extrabold uppercase tracking-wider text-stone-800">À faire</h3>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-800 text-xs font-bold text-white">
                    {pendingTasks.length}
                  </span>
                </div>
                <ul className="grid grid-cols-1 gap-3" aria-label="Tâches partagées à faire">
                  {pendingTasks.map((task) => (
                    <li key={task.id} className="space-y-2">
                      <TaskItem
                        title={task.title}
                        description={task.description}
                        priority={normalizePriorityForCard(task.priority)}
                        completed={task.completed}
                        onComplete={() => handleToggleTask(task)}
                        onDelete={() => handleDeleteTask(task.id)}
                      />
                      <p className="px-2 text-xs font-medium text-stone-500">
                        Ajoutée par : {task?.addedBy || 'inconnu'}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {completedTasks.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="text-base font-extrabold uppercase tracking-wider text-stone-800">Terminées</h3>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-400 text-xs font-bold text-white">
                    {completedTasks.length}
                  </span>
                </div>
                <ul className="grid grid-cols-1 gap-3" aria-label="Tâches partagées terminées">
                  {completedTasks.map((task) => (
                    <li key={task.id} className="space-y-2">
                      <TaskItem
                        title={task.title}
                        description={task.description}
                        priority={normalizePriorityForCard(task.priority)}
                        completed={task.completed}
                        onComplete={() => handleToggleTask(task)}
                        onDelete={() => handleDeleteTask(task.id)}
                      />
                      <p className="px-2 text-xs font-medium text-stone-500">
                        Ajoutée par : {task?.addedBy || 'inconnu'}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>
    </section>
  );
};

export default SharedListView;
