import * as SecureStore from 'expo-secure-store';

export class CertificateManager {
  private static instance: CertificateManager;

  static getInstance(): CertificateManager {
    if (!CertificateManager.instance) {
      CertificateManager.instance = new CertificateManager();
    }
    return CertificateManager.instance;
  }

  async storeCertificate(key: string, certificate: string): Promise<void> {
    await SecureStore.setItemAsync(key, certificate);
  }

  async getCertificate(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  }

  async deleteCertificate(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }
}






