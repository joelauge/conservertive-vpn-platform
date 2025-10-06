// apps/mobile/src/store/useVPNStore.ts
import { create } from 'zustand';
import { VPNServer, ConnectionStatus } from '../services/VPNService';

interface VPNState {
  // Connection state
  connectionStatus: ConnectionStatus;
  isConnecting: boolean;
  isDisconnecting: boolean;
  
  // Server state
  servers: VPNServer[];
  selectedServer: VPNServer | null;
  selectedProtocol: 'OpenVPN' | 'WireGuard' | 'IKEv2' | null;
  
  // Statistics
  bytesReceived: number;
  bytesSent: number;
  connectionTime: number;
  
  // Actions
  setConnectionStatus: (status: ConnectionStatus) => void;
  setConnecting: (connecting: boolean) => void;
  setDisconnecting: (disconnecting: boolean) => void;
  setServers: (servers: VPNServer[]) => void;
  setSelectedServer: (server: VPNServer | null) => void;
  setSelectedProtocol: (protocol: 'OpenVPN' | 'WireGuard' | 'IKEv2' | null) => void;
  updateStats: (bytesReceived: number, bytesSent: number) => void;
  resetStats: () => void;
}

export const useVPNStore = create<VPNState>((set, get) => ({
  // Initial state
  connectionStatus: { connected: false },
  isConnecting: false,
  isDisconnecting: false,
  servers: [],
  selectedServer: null,
  selectedProtocol: null,
  bytesReceived: 0,
  bytesSent: 0,
  connectionTime: 0,

  // Actions
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  
  setConnecting: (connecting) => set({ isConnecting: connecting }),
  
  setDisconnecting: (disconnecting) => set({ isDisconnecting: disconnecting }),
  
  setServers: (servers) => set({ servers }),
  
  setSelectedServer: (server) => set({ selectedServer: server }),
  
  setSelectedProtocol: (protocol) => set({ selectedProtocol: protocol }),
  
  updateStats: (bytesReceived, bytesSent) => 
    set((state) => ({
      bytesReceived: state.bytesReceived + bytesReceived,
      bytesSent: state.bytesSent + bytesSent,
    })),
  
  resetStats: () => set({ 
    bytesReceived: 0, 
    bytesSent: 0, 
    connectionTime: 0 
  }),
}));

