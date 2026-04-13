/* Page d'accueil principale de TaskManager */
export default function Home() {
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
    </main>
  );
}
