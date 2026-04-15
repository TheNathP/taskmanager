'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Affiche les informations utilisateur et l'action de déconnexion.
 */
const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState('');

  const handleSignOut = async () => {
    setError('');
    setIsSigningOut(true);

    try {
      await signOut();
    } catch (signOutError) {
      setError(signOutError.message || 'Impossible de se deconnecter.');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <section
      className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
      aria-label="Menu utilisateur"
    >
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Connecte en tant que
        </p>
        <p className="truncate text-sm font-bold text-stone-800">{user?.email || 'Utilisateur inconnu'}</p>
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        aria-label="Se deconnecter"
        className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSigningOut ? 'Deconnexion...' : 'Se deconnecter'}
      </button>

      {error && (
        <p role="alert" className="text-xs font-medium text-red-600 sm:ml-2">
          {error}
        </p>
      )}
    </section>
  );
};

export default UserMenu;
