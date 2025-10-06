import { Platform, NativeModules, NativeEventEmitter } from 'react-native';

// iOS Network Extension integration
const { ConSERVERtiveVPN } = NativeModules || {};

export interface VPNConfiguration {
  serverAddress: string;
  serverPort: number;
  username: string;
  password: string;
  protocol: 'IKEv2' | 'IPSec' | 'WireGuard';
  certificate?: string;
  privateKey?: string;
}

class NativeVPNService {
  private eventEmitter: NativeEventEmitter | null = null;

  constructor() {
    if (Platform.OS === 'ios' && ConSERVERtiveVPN) {
      this.eventEmitter = new NativeEventEmitter(ConSERVERtiveVPN);
    }
  }

  async installVPNConfiguration(config: VPNConfiguration): Promise<boolean> {
    try {
      if (Platform.OS === 'ios' && ConSERVERtiveVPN) {
        // This will trigger iOS to show the VPN configuration dialog
        const result = await ConSERVERtiveVPN.installConfiguration({
          serverAddress: config.serverAddress,
          serverPort: config.serverPort,
          username: config.username,
          password: config.password,
          protocol: config.protocol,
          certificate: config.certificate,
          privateKey: config.privateKey,
        });
        
        return result.success;
      }
      // Return false for non-iOS platforms or when native module is not available
      console.log('Native VPN module not available on this platform');
      return false;
    } catch (error) {
      console.error('Failed to install VPN configuration:', error);
      return false;
    }
  }

  async connectVPN(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios' && ConSERVERtiveVPN) {
        const result = await ConSERVERtiveVPN.connect();
        return result.success;
      }
      // Return false for non-iOS platforms or when native module is not available
      console.log('Native VPN module not available on this platform');
      return false;
    } catch (error) {
      console.error('Failed to connect VPN:', error);
      return false;
    }
  }

  async disconnectVPN(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios' && ConSERVERtiveVPN) {
        const result = await ConSERVERtiveVPN.disconnect();
        return result.success;
      }
      // Return false for non-iOS platforms or when native module is not available
      console.log('Native VPN module not available on this platform');
      return false;
    } catch (error) {
      console.error('Failed to disconnect VPN:', error);
      return false;
    }
  }

  async getVPNStatus(): Promise<'connected' | 'disconnected' | 'connecting' | 'disconnecting'> {
    try {
      if (Platform.OS === 'ios' && ConSERVERtiveVPN) {
        const result = await ConSERVERtiveVPN.getStatus();
        return result.status;
      }
      // Return disconnected for non-iOS platforms or when native module is not available
      console.log('Native VPN module not available on this platform');
      return 'disconnected';
    } catch (error) {
      console.error('Failed to get VPN status:', error);
      return 'disconnected';
    }
  }

  async getTrafficStats(): Promise<{ bytesIn: number; bytesOut: number; connectedTime: number }> {
    try {
      if (Platform.OS === 'ios' && ConSERVERtiveVPN) {
        const result = await ConSERVERtiveVPN.getTrafficStats();
        return result;
      }
      return { bytesIn: 0, bytesOut: 0, connectedTime: 0 };
    } catch (error) {
      console.error('Failed to get traffic stats:', error);
      return { bytesIn: 0, bytesOut: 0, connectedTime: 0 };
    }
  }

  // Listen for VPN status changes
  onVPNStatusChange(callback: (data: { status: string; trafficStats?: any }) => void) {
    if (this.eventEmitter) {
      return this.eventEmitter.addListener('VPNStatusChanged', callback);
    }
    return null;
  }
}

export default new NativeVPNService();



