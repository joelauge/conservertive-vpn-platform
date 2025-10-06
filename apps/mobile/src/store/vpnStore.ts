import { create } from 'zustand';
import { VPNServer, VPNStatus, VPNConfig } from '../services/VPNService';

interface VPNStore {
  // State
  status: VPNStatus;
  servers: VPNServer[];
  selectedServer: VPNServer | null;
  selectedProtocol: string;
  settings: {
    autoConnect: boolean;
    killSwitch: boolean;
    notifications: boolean;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setStatus: (status: VPNStatus) => void;
  setServers: (servers: VPNServer[]) => void;
  setSelectedServer: (server: VPNServer | null) => void;
  setSelectedProtocol: (protocol: string) => void;
  updateSettings: (settings: Partial<VPNStore['settings']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // VPN Actions
  connect: (config: VPNConfig) => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  refreshServers: () => Promise<void>;
  
  // Utility Actions
  reset: () => void;
}

const initialState = {
  status: {
    connected: false,
    bytesReceived: 0,
    bytesSent: 0,
    connectionTime: 0,
  },
  servers: [],
  selectedServer: null,
  selectedProtocol: 'OpenVPN',
  settings: {
    autoConnect: false,
    killSwitch: true,
    notifications: true,
  },
  isLoading: false,
  error: null,
};

export const useVPNStore = create<VPNStore>((set, get) => ({
  ...initialState,

  setStatus: (status) => set({ status }),
  
  setServers: (servers) => set({ servers }),
  
  setSelectedServer: (server) => set({ selectedServer: server }),
  
  setSelectedProtocol: (protocol) => set({ selectedProtocol: protocol }),
  
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),

  connect: async (config) => {
    const { setLoading, setError, setStatus } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      // Import VPN service dynamically to avoid circular dependencies
      const { vpnService } = await import('../services/VPNService');
      
      const success = await vpnService.connect(config);
      
      if (success) {
        setStatus(vpnService.getStatus());
      } else {
        setError('Failed to connect to VPN server');
      }
      
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  },

  disconnect: async () => {
    const { setLoading, setError, setStatus } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      const { vpnService } = await import('../services/VPNService');
      
      const success = await vpnService.disconnect();
      
      if (success) {
        setStatus(vpnService.getStatus());
      } else {
        setError('Failed to disconnect from VPN server');
      }
      
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  },

  refreshServers: async () => {
    const { setLoading, setError, setServers } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      const { vpnService } = await import('../services/VPNService');
      
      const servers = await vpnService.getServers();
      setServers(servers);
      
      // Set default server if none selected
      const { selectedServer } = get();
      if (!selectedServer && servers.length > 0) {
        get().setSelectedServer(servers[0]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load servers';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  },

  reset: () => set(initialState),
}));

// Selectors for common use cases
export const useVPNStatus = () => useVPNStore((state) => state.status);
export const useVPNServers = () => useVPNStore((state) => state.servers);
export const useSelectedServer = () => useVPNStore((state) => state.selectedServer);
export const useSelectedProtocol = () => useVPNStore((state) => state.selectedProtocol);
export const useVPNSettings = () => useVPNStore((state) => state.settings);
export const useVPNLoading = () => useVPNStore((state) => state.isLoading);
export const useVPNError = () => useVPNStore((state) => state.error);
