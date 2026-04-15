'use client';

/**
 * Composant SharedListCard
 *
 * Affiche une liste partagée avec ses statistiques et ses actions.
 *
 * @param {Object} list
 * @param {string} currentUserId
 * @param {function} onOpen
 * @param {function} onDelete
 */
const SharedListCard = ({
  list = {},
  currentUserId = "",
  onOpen = () => {},
  onDelete = () => {},
}) => {
  const isOwner = Boolean(list?.ownerId && currentUserId && list.ownerId === currentUserId);
  const membersCount = Array.isArray(list?.members) ? list.members.length : 0;

  const derivedTotalTasks = Array.isArray(list?.tasks) ? list.tasks.length : 0;
  const derivedCompletedTasks = Array.isArray(list?.tasks)
    ? list.tasks.filter((task) => task?.completed).length
    : 0;

  const totalTasks = Number.isFinite(list?.totalTasks) ? list.totalTasks : derivedTotalTasks;
  const completedTasks = Number.isFinite(list?.completedTasks)
    ? list.completedTasks
    : derivedCompletedTasks;

  const safeCompletedTasks = Math.min(completedTasks, totalTasks);

  return (
    <article
      className="w-full rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
      aria-label={`Liste partagée ${list?.name || "sans nom"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-extrabold text-stone-900">
            {list?.name || "Liste sans nom"}
          </h3>
          <p className="mt-1 text-sm font-medium text-stone-500">
            {membersCount} membre{membersCount > 1 ? "s" : ""}
          </p>
        </div>

        {isOwner && (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#3D6FE8]">
            Proprietaire
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3" aria-label="Statistiques de la liste">
        <div className="rounded-xl bg-stone-100 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Tâches</p>
          <p className="mt-1 text-xl font-extrabold text-stone-800">{totalTasks}</p>
        </div>
        <div className="rounded-xl bg-green-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Complétées</p>
          <p className="mt-1 text-xl font-extrabold text-green-800">{safeCompletedTasks}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onOpen(list)}
          aria-label={`Ouvrir la liste ${list?.name || ""}`}
          className="rounded-full bg-[#3D6FE8] px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D6FE8] focus-visible:ring-offset-2"
        >
          Ouvrir
        </button>

        {isOwner && (
          <button
            type="button"
            onClick={() => onDelete(list)}
            aria-label={`Supprimer la liste ${list?.name || ""}`}
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
          >
            Supprimer
          </button>
        )}
      </div>
    </article>
  );
};

export default SharedListCard;
