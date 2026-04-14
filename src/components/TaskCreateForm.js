'use client';

import { useState } from 'react';

/**
 * Composant TaskCreateForm
 *
 * Formulaire de création d'une nouvelle tâche.
 *
 * @param {function} onCreateTask - Fonction appelée lors de la soumission valide du formulaire
 */
const TaskCreateForm = ({ onCreateTask }) => {
    /* Données du formulaire */
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
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

        /* Appel du callback parent avec la nouvelle tâche */
        onCreateTask({ ...formData, id: Date.now(), completed: false });

        /* Réinitialisation du formulaire */
        setFormData({ title: '', description: '', priority: 'Medium' });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-6 p-8 bg-white rounded-[3rem] shadow-sm border border-slate-100 w-full max-w-lg"
            aria-labelledby="form-title"
        >
            {/* Titre du formulaire */}
            <h2 id="form-title" className="text-2xl font-bold text-slate-900">
                Créer une nouvelle tâche
            </h2>

            {/* Champ Nom (obligatoire) */}
            <div className="flex flex-col space-y-2">
                <label htmlFor="title" className="text-sm font-bold text-slate-700 ml-1">
                    Nom *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex : Réviser le design system"
                    className={`px-6 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all focus:bg-white ${errors.title
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-transparent focus:border-[#2E5BFF]'
                        }`}
                    aria-required="true"
                    aria-invalid={!!errors.title}
                    aria-describedby={errors.title ? 'title-error' : undefined}
                />
                {errors.title && (
                    <span id="title-error" role="alert" className="text-xs font-medium text-red-500 ml-2">
                        {errors.title}
                    </span>
                )}
            </div>

            {/* Champ Description (optionnel) */}
            <div className="flex flex-col space-y-2">
                <label htmlFor="description" className="text-sm font-bold text-slate-700 ml-1">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Ajoutez des précisions sur cette tâche..."
                    rows="3"
                    className="px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none transition-all focus:bg-white focus:border-[#2E5BFF] resize-none"
                />
            </div>

            {/* Champ Priorité (obligatoire) */}
            <div className="flex flex-col space-y-2">
                <label htmlFor="priority" className="text-sm font-bold text-slate-700 ml-1">
                    Priorité *
                </label>
                <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none transition-all focus:bg-white focus:border-[#2E5BFF] cursor-pointer"
                    aria-required="true"
                >
                    <option value="Low">Basse</option>
                    <option value="Medium">Moyenne</option>
                    <option value="High">Haute</option>
                </select>
            </div>

            {/* Bouton de création */}
            <button
                type="submit"
                aria-label="Créer la tâche"
                className="w-full py-4 bg-[#2E5BFF] hover:bg-blue-700 text-white text-base font-bold rounded-full shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
                Créer
            </button>
        </form>
    );
};

export default TaskCreateForm;