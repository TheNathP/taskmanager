"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";

const AuthContext = createContext(undefined);

const getFirebaseAuthErrorMessage = (error) => {
  if (!error || typeof error !== "object") {
    return "Une erreur est survenue. Veuillez reessayer.";
  }

  const code = error.code || "";

  const errorMessages = {
    "auth/email-already-in-use": "Cette adresse email est deja utilisee.",
    "auth/invalid-email": "Adresse email invalide.",
    "auth/weak-password": "Le mot de passe doit contenir au moins 6 caracteres.",
    "auth/user-disabled": "Ce compte a ete desactive.",
    "auth/user-not-found": "Aucun compte ne correspond a ces informations.",
    "auth/wrong-password": "Mot de passe incorrect.",
    "auth/invalid-credential": "Identifiants invalides. Verifiez email et mot de passe.",
    "auth/too-many-requests":
      "Trop de tentatives. Veuillez patienter avant de reessayer.",
    "auth/popup-closed-by-user":
      "La fenetre de connexion Google a ete fermee avant la fin.",
    "auth/popup-blocked":
      "La fenetre de connexion Google a ete bloquee par le navigateur.",
    "auth/cancelled-popup-request": "Une tentative de connexion est deja en cours.",
    "auth/network-request-failed": "Probleme reseau. Verifiez votre connexion.",
    "auth/internal-error": "Erreur interne du service d'authentification.",
  };

  return errorMessages[code] || "Une erreur est survenue lors de l'authentification.";
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
      },
      (firebaseError) => {
        setError(getFirebaseAuthErrorMessage(firebaseError));
      }
    );

    return unsubscribe;
  }, []);

  const signUp = async (email, password) => {
    setError(null);
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (firebaseError) {
      const message = getFirebaseAuthErrorMessage(firebaseError);
      setError(message);
      throw new Error(message);
    }
  };

  const signIn = async (email, password) => {
    setError(null);
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (firebaseError) {
      const message = getFirebaseAuthErrorMessage(firebaseError);
      setError(message);
      throw new Error(message);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    } catch (firebaseError) {
      const message = getFirebaseAuthErrorMessage(firebaseError);
      setError(message);
      throw new Error(message);
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (firebaseError) {
      const message = getFirebaseAuthErrorMessage(firebaseError);
      setError(message);
      throw new Error(message);
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      error,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
    }),
    [user, error]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit etre utilise dans un AuthProvider.");
  }

  return context;
}
