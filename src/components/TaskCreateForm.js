'use client';

import { useState } from 'react';

/**
 * Composant TaskCreateForm
 *
 * Formulaire de création d'une nouvelle tâche au style "Create Task" de l'image de référence.
 *
 * @param {function} onCreateTask - Fonction appelée lors de la soumission valide du formulaire
 * @param {function} onCancel     - Fonction appelée pour fermer le formulaire
 */
const TaskCreateForm = ({ onCreateTask, onCancel }) => {
    /* Données du formulaire */
    const [formData, setFormData] = useState({
        title: '',
        priority: 'medium',
    });

    /* Erreurs de validation */
    const [errors, setErrors] = useState({});

    /* Met à jour un champ et efface son erreur */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    /* Valide et soumet le formulaire */
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Le nom de la tâche est obligatoire';
        }
        if (!formData.priority) {
            newErrors.priority = 'La priorité est obligatoire';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onCreateTask({
            title: formData.title.trim(),
            priority: formData.priority || 'medium',
        });
        setFormData({ title: '', priority: 'medium' });
    };

    const priorityColors = {
        high: 'bg-[#E05C4A]',
        medium: 'bg-[#D4A827]',
        low: 'bg-[#2A8C6E]',
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-5 p-6 bg-white rounded-[2rem] shadow-sm w-full"
            aria-labelledby="form-title"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 id="form-title" className="text-xl font-extrabold text-stone-900">
                    Créer une tâche
                </h2>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        aria-label="Fermer le formulaire"
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Champ Nom */}
            <div className="flex flex-col space-y-1">
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Nom de la tâche"
                    className={`px-5 py-3 bg-stone-50 border-2 rounded-xl outline-none transition-all text-stone-900 font-medium placeholder-stone-400 focus:bg-white ${errors.title ? 'border-red-300 focus:border-red-400' : 'border-transparent focus:border-[#3D6FE8]'
                        }`}
                    aria-required="true"
                    aria-invalid={!!errors.title}
                />
                {errors.title && (
                    <span role="alert" className="text-xs font-medium text-red-500 ml-1">
                        {errors.title}
                    </span>
                )}
            </div>

            {/* Sélecteur de priorité — style pill boutons */}
            <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">Priorité</p>
                <div className="flex gap-2">
                    {['low', 'medium', 'high'].map((p) => {
                        const labels = { low: 'Basse', medium: 'Moyenne', high: 'Haute' };
                        const selected = formData.priority === p;
                        return (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, priority: p }))}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all active:scale-95 ${selected
                                        ? `${priorityColors[p]} text-white border-transparent`
                                        : 'bg-transparent border-stone-200 text-stone-500 hover:border-stone-300'
                                    }`}
                            >
                                {selected && <span className="w-2 h-2 rounded-full bg-white/70 inline-block" />}
                                {labels[p]}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Bouton de création */}
            <button
                type="submit"
                aria-label="Créer la tâche"
                className="w-full py-4 bg-[#3D6FE8] hover:bg-blue-700 text-white text-sm font-extrabold rounded-full shadow-lg shadow-blue-500/20 transition-all active:scale-95 tracking-wide"
            >
                Créer la tâche
            </button>
        </form>
    );
};

export default TaskCreateForm;