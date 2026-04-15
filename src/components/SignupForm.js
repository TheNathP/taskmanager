"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

const EMAIL_PATTERN = /\S+@\S+\.\S+/;

const SignupForm = () => {
  const { signUp, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const nextErrors = {};
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      nextErrors.email = "L'email est obligatoire.";
    } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
      nextErrors.email = "Le format de l'email est invalide.";
    }

    if (!password) {
      nextErrors.password = "Le mot de passe est obligatoire.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "La confirmation du mot de passe est obligatoire.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email.trim(), password);
    } catch (submissionError) {
      setFormError(submissionError.message || "Impossible de creer le compte.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayedError = formError || authError;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-5 rounded-[2rem] bg-white p-6 shadow-sm"
      aria-describedby={displayedError ? "signup-form-error" : undefined}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Authentification</p>
        <h1 className="mt-1 text-2xl font-black text-stone-900">
          Inscription <span className="text-[#3D6FE8]">TaskManager</span>
        </h1>
      </div>

      {displayedError && (
        <p
          id="signup-form-error"
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
        >
          {displayedError}
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="signup-email" className="block text-sm font-medium text-stone-700">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (errors.email) {
              setErrors((previous) => ({ ...previous, email: "" }));
            }
          }}
          placeholder="votre@email.com"
          className={`w-full rounded-xl border-2 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition ${
            errors.email
              ? "border-red-300 focus:border-red-400"
              : "border-transparent focus:border-[#3D6FE8] focus:bg-white"
          }`}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "signup-email-error" : undefined}
          autoComplete="email"
        />
        {errors.email && (
          <p id="signup-email-error" className="text-xs text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="signup-password" className="block text-sm font-medium text-stone-700">
          Mot de passe
        </label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (errors.password || errors.confirmPassword) {
              setErrors((previous) => ({
                ...previous,
                password: "",
                confirmPassword: "",
              }));
            }
          }}
          placeholder="Votre mot de passe"
          className={`w-full rounded-xl border-2 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition ${
            errors.password
              ? "border-red-300 focus:border-red-400"
              : "border-transparent focus:border-[#3D6FE8] focus:bg-white"
          }`}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "signup-password-error" : undefined}
          autoComplete="new-password"
        />
        {errors.password && (
          <p id="signup-password-error" className="text-xs text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-stone-700">
          Confirmation du mot de passe
        </label>
        <input
          id="signup-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            if (errors.confirmPassword) {
              setErrors((previous) => ({ ...previous, confirmPassword: "" }));
            }
          }}
          placeholder="Confirmez votre mot de passe"
          className={`w-full rounded-xl border-2 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition ${
            errors.confirmPassword
              ? "border-red-300 focus:border-red-400"
              : "border-transparent focus:border-[#3D6FE8] focus:bg-white"
          }`}
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={errors.confirmPassword ? "signup-confirm-password-error" : undefined}
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <p id="signup-confirm-password-error" className="text-xs text-red-600">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-[#3D6FE8] px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {isLoading ? "Inscription..." : "S'inscrire"}
      </button>

      <p className="text-center text-sm text-stone-600">
        Déjà un compte ?{" "}
        <Link href="/login" className="font-bold text-[#3D6FE8] hover:text-blue-700">
          Se connecter
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
