import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';
import { UserProfile } from '../types';
import { userProfileService } from '../services/firestoreService';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: FirebaseUser | UserProfile | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isDemoMode: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, company: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginDemoUser: () => void;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_PROFILE: UserProfile = {
  uid: 'demo-user-sme-123',
  email: 'alex.morgan@greentech.io',
  displayName: 'Alex Morgan',
  companyName: 'GreenTech Solutions SME',
  role: 'Supply Chain Carbon Lead',
  targetReductionPercent: 35,
  netZeroTargetYear: 2030,
  highEmissionThresholdTons: 15,
  createdAt: new Date().toISOString()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | UserProfile | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    // Check if demo user session exists in local storage
    const savedDemo = localStorage.getItem('ecochain_demo_session');
    if (savedDemo === 'true') {
      setCurrentUser(DEMO_USER_PROFILE);
      setUserProfile(DEMO_USER_PROFILE);
      setIsDemoMode(true);
      setLoading(false);
      return () => {};
    }

    if (isFirebaseConfigured) {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          try {
            let profile = await userProfileService.getProfile(user.uid);
            if (!profile) {
              profile = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || 'Sustainability User',
                companyName: 'My Enterprise',
                role: 'ESG Manager',
                targetReductionPercent: 30,
                netZeroTargetYear: 2030,
                highEmissionThresholdTons: 15,
                createdAt: new Date().toISOString()
              };
              await userProfileService.saveProfile(profile);
            }
            setUserProfile(profile);
          } catch (err) {
            console.error('Error fetching user profile:', err);
          }
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      });
      return () => {
        if (unsubscribe) unsubscribe();
      };
    } else {
      // Automatic Demo Mode fallback if Firebase credentials are not set
      setCurrentUser(DEMO_USER_PROFILE);
      setUserProfile(DEMO_USER_PROFILE);
      setIsDemoMode(true);
      setLoading(false);
      return () => {};
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured) {
        try {
          await signInWithEmailAndPassword(auth, email, pass);
          toast.success('Successfully logged in!');
          return;
        } catch (firebaseErr: any) {
          // If using the demo credentials or demo mode identifier
          const isDemoEmail = email.toLowerCase().includes('demo') || email.toLowerCase() === 'alex.morgan@greentech.io';
          if (isDemoEmail) {
            const mockProfile: UserProfile = {
              ...DEMO_USER_PROFILE,
              email,
              displayName: email.split('@')[0] || 'Demo Manager'
            };
            setCurrentUser(mockProfile);
            setUserProfile(mockProfile);
            setIsDemoMode(true);
            localStorage.setItem('ecochain_demo_session', 'true');
            toast.success('Logged in successfully (Demo Session)');
            return;
          }
          throw firebaseErr;
        }
      } else {
        // Fallback for non-Firebase environment
        const mockProfile: UserProfile = {
          ...DEMO_USER_PROFILE,
          email,
          displayName: email.split('@')[0]
        };
        setCurrentUser(mockProfile);
        setUserProfile(mockProfile);
        setIsDemoMode(true);
        localStorage.setItem('ecochain_demo_session', 'true');
        toast.success('Logged in successfully (Demo Mode)');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string, company: string) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured) {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        const newProfile: UserProfile = {
          uid: res.user.uid,
          email,
          displayName: name,
          companyName: company,
          role: 'Scope 3 Administrator',
          targetReductionPercent: 30,
          netZeroTargetYear: 2030,
          highEmissionThresholdTons: 15,
          createdAt: new Date().toISOString()
        };
        await userProfileService.saveProfile(newProfile);
        setUserProfile(newProfile);
        toast.success('Account created successfully!');
      } else {
        const newProfile: UserProfile = {
          uid: 'user-' + Date.now(),
          email,
          displayName: name,
          companyName: company,
          role: 'Scope 3 Administrator',
          targetReductionPercent: 30,
          netZeroTargetYear: 2030,
          highEmissionThresholdTons: 15,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(newProfile);
        setUserProfile(newProfile);
        setIsDemoMode(true);
        localStorage.setItem('ecochain_demo_session', 'true');
        toast.success('Demo account created!');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (isFirebaseConfigured && auth.currentUser) {
        await signOut(auth);
      }
      localStorage.removeItem('ecochain_demo_session');
      setCurrentUser(null);
      setUserProfile(null);
      setIsDemoMode(false);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (isFirebaseConfigured) {
        await sendPasswordResetEmail(auth, email);
        toast.success('Password reset email sent!');
      } else {
        toast.success('Demo Mode: Password reset link simulated for ' + email);
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send reset email');
    }
  };

  const loginDemoUser = () => {
    setCurrentUser(DEMO_USER_PROFILE);
    setUserProfile(DEMO_USER_PROFILE);
    setIsDemoMode(true);
    localStorage.setItem('ecochain_demo_session', 'true');
    toast.success('Welcome! Logged in as Demo SME Carbon Manager.');
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = { ...userProfile, ...data };
    setUserProfile(updated);
    await userProfileService.saveProfile(updated);
    toast.success('Profile updated successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isDemoMode,
        login,
        register,
        logout,
        resetPassword,
        loginDemoUser,
        updateProfileData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
