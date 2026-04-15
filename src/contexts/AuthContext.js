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
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

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

const createFriendlyAuthError = (firebaseError) => {
  const message = getFirebaseAuthErrorMessage(firebaseError);
  const authError = new Error(message);
  authError.code = firebaseError?.code;
  return authError;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState(null);

  const syncUserProfile = async (firebaseUser) => {
    if (!firebaseUser?.uid || !firebaseUser?.email) {
      return;
    }

    const normalizedEmail = firebaseUser.email.trim().toLowerCase();

    await setDoc(
      doc(db, "users", firebaseUser.uid),
      {
        email: firebaseUser.email,
        emailLowercase: normalizedEmail,
        displayName: firebaseUser.displayName || "",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
          syncUserProfile(firebaseUser).catch((profileError) => {
            console.error("Impossible de synchroniser le profil utilisateur.", profileError);
            setError(
              "Impossible de synchroniser votre profil pour le partage de listes. Reessayez plus tard."
            );
          });
        }

        setUser(firebaseUser);
        setIsAuthLoading(false);
      },
      (firebaseError) => {
        setError(getFirebaseAuthErrorMessage(firebaseError));
        setIsAuthLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const signUp = async (email, password) => {
    setError(null);
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (firebaseError) {
      const authError = createFriendlyAuthError(firebaseError);
      setError(authError.message);
      throw authError;
    }
  };

  const signIn = async (email, password) => {
    setError(null);
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (firebaseError) {
      const authError = createFriendlyAuthError(firebaseError);
      setError(authError.message);
      throw authError;
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    } catch (firebaseError) {
      const authError = createFriendlyAuthError(firebaseError);
      setError(authError.message);
      throw authError;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (firebaseError) {
      const authError = createFriendlyAuthError(firebaseError);
      setError(authError.message);
      throw authError;
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      isAuthLoading,
      error,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
    }),
    [user, isAuthLoading, error]
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
