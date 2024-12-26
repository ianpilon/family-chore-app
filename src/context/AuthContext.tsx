import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  createFamilyProfile: (familyData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: result.user.email,
          name: result.user.displayName,
          avatar: result.user.photoURL,
          role: 'parent',
          points: 0,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const signOut = () => firebaseSignOut(auth);

  const createFamilyProfile = async (familyData: Partial<User>) => {
    if (!user) return;

    const familyRef = doc(db, 'families', user.uid);
    await setDoc(familyRef, {
      ...familyData,
      createdAt: new Date(),
      members: [{
        uid: user.uid,
        role: 'parent',
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      }],
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithGoogle,
      signOut,
      createFamilyProfile,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}