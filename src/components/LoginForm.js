"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const EMAIL_PATTERN = /\S+@\S+\.\S+/;

const LoginForm = ({ showGoogleSignIn = true }) => {
  const { signIn, signInWithGoogle, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      await signIn(email.trim(), password);
    } catch (submissionError) {
      setFormError(submissionError.message || "Impossible de se connecter.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError("");
    setIsLoading(true);

    try {
      await signInWithGoogle();
    } catch (googleError) {
      setFormError(googleError.message || "Connexion Google impossible.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayedError = formError || authError;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-sm"
      aria-describedby={displayedError ? "login-form-error" : undefined}
    >
      {displayedError && (
        <p
          id="login-form-error"
          role="alert"
          className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {displayedError}
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="login-email" className="block text-sm font-medium text-stone-700">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (errors.email) {
              setErrors((previous) => ({ ...previous, email: "" }));
            }
          }}
          placeholder="votre@email.com"
          className={`w-full rounded-xl border px-4 py-3 text-sm text-stone-900 outline-none transition ${
            errors.email
              ? "border-red-400 focus:border-red-500"
              : "border-stone-300 focus:border-blue-500"
          }`}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          autoComplete="email"
        />
        {errors.email && (
          <p id="login-email-error" className="text-xs text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="login-password" className="block text-sm font-medium text-stone-700">
          Mot de passe
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (errors.password) {
              setErrors((previous) => ({ ...previous, password: "" }));
            }
          }}
          placeholder="Votre mot de passe"
          className={`w-full rounded-xl border px-4 py-3 text-sm text-stone-900 outline-none transition ${
            errors.password
              ? "border-red-400 focus:border-red-500"
              : "border-stone-300 focus:border-blue-500"
          }`}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "login-password-error" : undefined}
          autoComplete="current-password"
        />
        {errors.password && (
          <p id="login-password-error" className="text-xs text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>

      {showGoogleSignIn && (
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          aria-label="Se connecter avec Google (ouvre une fenetre)"
          className="w-full rounded-full border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Se connecter avec Google
        </button>
      )}

      <p className="text-center text-sm text-stone-600">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
          S&apos;inscrire
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
