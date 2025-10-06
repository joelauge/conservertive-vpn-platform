// apps/mobile/src/services/AuthService.ts
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

export interface AuthState {
  isSignedIn: boolean;
  user?: User;
  isLoading: boolean;
}

class AuthService {
  private authState: AuthState = {
    isSignedIn: false,
    isLoading: true
  };

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // Check if user is already signed in
      const storedToken = await SecureStore.getItemAsync('clerk_token');
      if (storedToken) {
        // Validate token with Clerk
        // This will be handled by Clerk's built-in persistence
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      this.authState.isLoading = false;
    }
  }

  /**
   * Get current authentication state
   */
  getAuthState(): AuthState {
    return this.authState;
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<void> {
    try {
      // This will be handled by Clerk's signIn method
      console.log('Signing in with:', email);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  }

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, firstName?: string, lastName?: string): Promise<void> {
    try {
      // This will be handled by Clerk's signUp method
      console.log('Signing up with:', email);
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      // Clear stored tokens
      await SecureStore.deleteItemAsync('clerk_token');
      
      this.authState = {
        isSignedIn: false,
        isLoading: false
      };
      
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(): Promise<User | null> {
    try {
      // This will be handled by Clerk's user object
      return null; // Placeholder
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<void> {
    try {
      // This will be handled by Clerk's user update methods
      console.log('Updating profile:', updates);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }
}

export default new AuthService();

