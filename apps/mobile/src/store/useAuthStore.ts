// apps/mobile/src/store/useAuthStore.ts
import { create } from 'zustand';
import { User } from '../services/AuthService';

interface AuthState {
  // Auth state
  isSignedIn: boolean;
  isLoading: boolean;
  user: User | null;
  
  // User profile
  subscription?: {
    plan: 'basic' | 'premium' | 'enterprise' | 'sponsor';
    status: 'active' | 'inactive' | 'cancelled';
    expiresAt?: Date;
  };
  
  sponsorship?: {
    sponsoredUsers: number;
    totalImpact: number;
  };
  
  // Actions
  setAuthState: (isSignedIn: boolean, user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setSubscription: (subscription: AuthState['subscription']) => void;
  setSponsorship: (sponsorship: AuthState['sponsorship']) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  isSignedIn: false,
  isLoading: true,
  user: null,

  // Actions
  setAuthState: (isSignedIn, user) => set({ isSignedIn, user }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setUser: (user) => set({ user }),
  
  setSubscription: (subscription) => set({ subscription }),
  
  setSponsorship: (sponsorship) => set({ sponsorship }),
  
  signOut: () => set({ 
    isSignedIn: false, 
    user: null, 
    subscription: undefined, 
    sponsorship: undefined 
  }),
}));

