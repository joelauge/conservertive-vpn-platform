// apps/mobile/src/services/APIService.ts
import axios, { AxiosInstance } from 'axios';
import AuthService from './AuthService';

export interface APIResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  subscription?: {
    plan: 'basic' | 'premium' | 'enterprise' | 'sponsor';
    status: 'active' | 'inactive' | 'cancelled';
    expiresAt?: Date;
  };
  sponsorship?: {
    sponsoredUsers: number;
    totalImpact: number;
  };
}

export interface VPNStats {
  dataProtected: number; // in bytes
  countriesAccessed: number;
  uptime: number; // in seconds
  lastConnected?: Date;
}

class APIService {
  private api: AxiosInstance;
  private baseURL = 'https://api.conservertive.co';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          // Get auth token from Clerk (this will be implemented with Clerk)
          const token = await this.getAuthToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Failed to get auth token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          await AuthService.signOut();
        }
        return Promise.reject(error);
      }
    );
  }

  private async getAuthToken(): Promise<string | null> {
    // This will be implemented with Clerk's token management
    return null; // Placeholder
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<APIResponse> {
    try {
      const response = await this.api.get('/health');
      return {
        data: response.data,
        status: 'success'
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        data: null,
        message: 'Service unavailable',
        status: 'error'
      };
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<APIResponse<UserProfile>> {
    try {
      const response = await this.api.get('/api/v1/users/profile');
      return {
        data: response.data,
        status: 'success'
      };
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  }

  /**
   * Get VPN statistics
   */
  async getVPNStats(): Promise<APIResponse<VPNStats>> {
    try {
      const response = await this.api.get('/api/v1/users/vpn-stats');
      return {
        data: response.data,
        status: 'success'
      };
    } catch (error) {
      console.error('Failed to get VPN stats:', error);
      throw error;
    }
  }

  /**
   * Get available VPN servers
   */
  async getVPNServers(): Promise<APIResponse<any[]>> {
    try {
      const response = await this.api.get('/api/v1/vpn/servers');
      return {
        data: response.data.servers || [],
        status: 'success'
      };
    } catch (error) {
      console.error('Failed to get VPN servers:', error);
      throw error;
    }
  }

  /**
   * Get VPN configuration
   */
  async getVPNConfig(serverId: string, protocol: string): Promise<APIResponse<any>> {
    try {
      const response = await this.api.post('/api/v1/vpn/clients/config', {
        serverId,
        protocol
      });
      return {
        data: response.data,
        status: 'success'
      };
    } catch (error) {
      console.error('Failed to get VPN config:', error);
      throw error;
    }
  }

  /**
   * Update VPN connection status
   */
  async updateConnectionStatus(status: {
    connected: boolean;
    serverId?: string;
    protocol?: string;
    bytesReceived?: number;
    bytesSent?: number;
  }): Promise<APIResponse> {
    try {
      const response = await this.api.post('/api/v1/vpn/connection-status', status);
      return {
        data: response.data,
        status: 'success'
      };
    } catch (error) {
      console.error('Failed to update connection status:', error);
      throw error;
    }
  }

  /**
   * Get subscription information
   */
  async getSubscription(): Promise<APIResponse<any>> {
    try {
      const response = await this.api.get('/api/v1/billing/subscription');
      return {
        data: response.data,
        status: 'success'
      };
    } catch (error) {
      console.error('Failed to get subscription:', error);
      throw error;
    }
  }

  /**
   * Get sponsorship information
   */
  async getSponsorship(): Promise<APIResponse<any>> {
    try {
      const response = await this.api.get('/api/v1/sponsorship/status');
      return {
        data: response.data,
        status: 'success'
      };
    } catch (error) {
      console.error('Failed to get sponsorship info:', error);
      throw error;
    }
  }
}

export default new APIService();

