'use client';

import { useState } from 'react';

/**
 * Formulaire de création d'une liste partagée.
 *
 * @param {function} onCreateList - Fonction async appelée avec le nom de la liste.
 */
const CreateListForm = ({ onCreateList = async () => {} }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Le nom de la liste est obligatoire.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateList(trimmedName);
      setName('');
    } catch (createError) {
      setError(createError.message || 'Impossible de créer la liste.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
      aria-labelledby="create-list-form-title"
    >
      <h2 id="create-list-form-title" className="text-xl font-extrabold text-stone-900">
        Créer une liste
      </h2>

      <div className="mt-4 flex flex-col space-y-2">
        <label htmlFor="listName" className="text-sm font-semibold text-stone-700">
          Nom de la liste
        </label>
        <input
          id="listName"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex : Projet équipe"
          aria-required="true"
          aria-invalid={Boolean(error)}
          className={`w-full rounded-xl border-2 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 outline-none transition ${
            error
              ? 'border-red-300 focus:border-red-400 bg-white'
              : 'border-transparent focus:border-[#3D6FE8] focus:bg-white'
          }`}
        />
        {error && (
          <p role="alert" className="text-xs font-medium text-red-600">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        aria-label="Créer la liste"
        className="mt-5 w-full rounded-full bg-[#3D6FE8] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Création...' : 'Créer'}
      </button>
    </form>
  );
};

export default CreateListForm;
