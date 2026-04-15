'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateListForm from '../../src/components/CreateListForm';
import SharedListCard from '../../src/components/SharedListCard';
import SharedListView from '../../src/components/SharedListView';
import { useAuth } from '../../src/contexts/AuthContext';
import {
  addMemberToList,
  addSharedTask,
  createSharedList,
  deleteSharedList,
  deleteSharedTask,
  getSharedListTasks,
  removeMemberFromList,
  subscribeToSharedLists,
  subscribeToSharedTasks,
  updateSharedTask,
} from '../../src/services/sharedListService';

export default function SharedPage() {
  const router = useRouter();
  const { user, isAuthLoading } = useAuth();

  const [sharedLists, setSharedLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState('');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace('/login');
    }
  }, [isAuthLoading, router, user]);

  useEffect(() => {
    if (!user?.uid) {
      setSharedLists([]);
      setSelectedListId('');
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError('');

    try {
      const unsubscribe = subscribeToSharedLists(user.uid, async (lists) => {
        try {
          const listsWithStats = await Promise.all(
            lists.map(async (list) => {
              const tasks = await getSharedListTasks(list.id);
              const completedTasks = tasks.filter((task) => task.completed).length;

              return {
                ...list,
                totalTasks: tasks.length,
                completedTasks,
              };
            })
          );

          setSharedLists(listsWithStats);
          setLoading(false);
        } catch (listsError) {
          setError(listsError.message || 'Impossible de charger les statistiques des listes.');
          setLoading(false);
        }
      });

      return unsubscribe;
    } catch (subscriptionError) {
      setError(subscriptionError.message || 'Impossible de charger les listes partagées.');
      setLoading(false);
      return undefined;
    }
  }, [user?.uid]);

  const selectedList = useMemo(
    () => sharedLists.find((list) => list.id === selectedListId) || null,
    [sharedLists, selectedListId]
  );

  useEffect(() => {
    if (!selectedListId) {
      setSelectedTasks([]);
      return undefined;
    }

    setError('');

    try {
      const unsubscribe = subscribeToSharedTasks(selectedListId, (tasks) => {
        setSelectedTasks(tasks);
      });

      return unsubscribe;
    } catch (subscriptionError) {
      setError(subscriptionError.message || "Impossible de charger les tâches partagées.");
      return undefined;
    }
  }, [selectedListId]);

  const handleCreateList = async (name) => {
    if (!user?.uid) return;

    setError('');
    try {
      await createSharedList(user.uid, name);
    } catch (createError) {
      setError(createError.message || 'Impossible de créer la liste.');
    }
  };

  const handleDeleteList = async (list) => {
    if (!user?.uid || !list?.id) return;

    setError('');
    try {
      await deleteSharedList(list.id, user.uid);
      if (selectedListId === list.id) {
        setSelectedListId('');
      }
    } catch (deleteError) {
      setError(deleteError.message || 'Impossible de supprimer la liste.');
    }
  };

  const handleAddMember = async (email) => {
    if (!selectedList?.id) return;

    setError('');
    try {
      await addMemberToList(selectedList.id, email);
    } catch (addMemberError) {
      setError(addMemberError.message || "Impossible d'ajouter ce membre.");
      throw addMemberError;
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!selectedList?.id) return;

    setError('');
    try {
      await removeMemberFromList(selectedList.id, memberId);
    } catch (removeMemberError) {
      setError(removeMemberError.message || 'Impossible de retirer ce membre.');
      throw removeMemberError;
    }
  };

  const handleAddTask = async (task) => {
    if (!selectedList?.id || !user?.uid) return;

    setError('');
    try {
      await addSharedTask(selectedList.id, user.uid, task);
    } catch (addTaskError) {
      setError(addTaskError.message || "Impossible d'ajouter la tâche.");
      throw addTaskError;
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    if (!selectedList?.id || !taskId) return;

    setError('');
    try {
      await updateSharedTask(selectedList.id, taskId, updates);
    } catch (updateTaskError) {
      setError(updateTaskError.message || 'Impossible de mettre à jour la tâche.');
      throw updateTaskError;
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!selectedList?.id || !taskId) return;

    setError('');
    try {
      await deleteSharedTask(selectedList.id, taskId);
    } catch (deleteTaskError) {
      setError(deleteTaskError.message || 'Impossible de supprimer la tâche.');
      throw deleteTaskError;
    }
  };

  if (isAuthLoading) {
    return (
      <main className="min-h-screen bg-[#F2EDE4] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-4xl text-sm font-medium text-stone-500">
          Verification de la session...
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F2EDE4] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <h1 className="text-4xl font-black text-stone-900">
            Listes <span className="text-[#3D6FE8]">partagées</span>
          </h1>
        </header>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        {selectedList ? (
          <SharedListView
            list={selectedList}
            tasks={selectedTasks}
            currentUserId={user.uid}
            members={selectedList.members || []}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onBack={() => setSelectedListId('')}
          />
        ) : (
          <>
            <CreateListForm onCreateList={handleCreateList} />

            {loading ? (
              <p className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-stone-600">
                Chargement...
              </p>
            ) : sharedLists.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-bold text-stone-700">Aucune liste partagée.</p>
                <p className="mt-1 text-sm text-stone-500">Créez votre première liste pour commencer.</p>
              </div>
            ) : (
              <section aria-label="Vos listes partagées" className="grid grid-cols-1 gap-4">
                {sharedLists.map((list) => (
                  <SharedListCard
                    key={list.id}
                    list={list}
                    currentUserId={user.uid}
                    onOpen={() => setSelectedListId(list.id)}
                    onDelete={handleDeleteList}
                  />
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
