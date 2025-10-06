'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, DocumentTextIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface SetupInstructions {
  [key: string]: {
    [version: string]: {
      title: string;
      steps: string[];
      config?: string;
    };
  };
}

const setupInstructions: SetupInstructions = {
  'Windows': {
    'Windows 10/11': {
      title: 'Windows 10/11 Setup',
      steps: [
        'Download the OpenVPN Connect client from the Microsoft Store',
        'Open the OpenVPN Connect app',
        'Tap the "+" button to add a new connection',
        'Select "File" and upload your .ovpn configuration file',
        'Enter your username and password when prompted',
        'Tap "Add" to save the connection',
        'Tap the connection to connect to the VPN'
      ],
      config: `client
dev tun
proto udp
remote your-server.com 1194
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-CBC
auth SHA256
verb 3
auth-user-pass
<ca>
-----BEGIN CERTIFICATE-----
[Your CA Certificate Here]
-----END CERTIFICATE-----
</ca>`
    },
    'Windows 7/8': {
      title: 'Windows 7/8 Setup',
      steps: [
        'Download OpenVPN GUI from the official website',
        'Install OpenVPN GUI with administrator privileges',
        'Copy your .ovpn configuration file to the config folder',
        'Right-click the OpenVPN GUI system tray icon',
        'Select your server from the list',
        'Click "Connect" and enter your credentials'
      ],
      config: `client
dev tun
proto udp
remote your-server.com 1194
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-CBC
auth SHA256
verb 3
auth-user-pass
<ca>
-----BEGIN CERTIFICATE-----
[Your CA Certificate Here]
-----END CERTIFICATE-----
</ca>`
    }
  },
  'macOS': {
    'macOS 12+ (Monterey)': {
      title: 'macOS Monterey+ Setup',
      steps: [
        'Download Tunnelblick from the official website',
        'Install Tunnelblick and grant necessary permissions',
        'Double-click your .ovpn configuration file',
        'Tunnelblick will automatically import the configuration',
        'Click "Connect" in the Tunnelblick menu bar',
        'Enter your username and password when prompted'
      ],
      config: `client
dev tun
proto udp
remote your-server.com 1194
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-CBC
auth SHA256
verb 3
auth-user-pass
<ca>
-----BEGIN CERTIFICATE-----
[Your CA Certificate Here]
-----END CERTIFICATE-----
</ca>`
    },
    'macOS 11 (Big Sur)': {
      title: 'macOS Big Sur Setup',
      steps: [
        'Download Tunnelblick from the official website',
        'Install Tunnelblick and grant necessary permissions',
        'Double-click your .ovpn configuration file',
        'Tunnelblick will automatically import the configuration',
        'Click "Connect" in the Tunnelblick menu bar',
        'Enter your username and password when prompted'
      ],
      config: `client
dev tun
proto udp
remote your-server.com 1194
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-CBC
auth SHA256
verb 3
auth-user-pass
<ca>
-----BEGIN CERTIFICATE-----
[Your CA Certificate Here]
-----END CERTIFICATE-----
</ca>`
    }
  },
  'iOS': {
    'iOS 15+': {
      title: 'iOS 15+ Setup',
      steps: [
        'Download OpenVPN Connect from the App Store',
        'Open the OpenVPN Connect app',
        'Tap the "+" button to add a new connection',
        'Select "File" and upload your .ovpn configuration file',
        'Enter your username and password when prompted',
        'Tap "Add" to save the connection',
        'Tap the connection to connect to the VPN'
      ],
      config: `client
dev tun
proto udp
remote your-server.com 1194
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-CBC
auth SHA256
verb 3
auth-user-pass
<ca>
-----BEGIN CERTIFICATE-----
[Your CA Certificate Here]
-----END CERTIFICATE-----
</ca>`
    },
    'iOS 14': {
      title: 'iOS 14 Setup',
      steps: [
        'Download OpenVPN Connect from the App Store',
        'Open the OpenVPN Connect app',
        'Tap the "+" button to add a new connection',
        'Select "File" and upload your .ovpn configuration file',
        'Enter your username and password when prompted',
        'Tap "Add" to save the connection',
        'Tap the connection to connect to the VPN'
      ],
      config: `client
dev tun
proto udp
remote your-server.com 1194
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-CBC
auth SHA256
verb 3
auth-user-pass
<ca>
-----BEGIN CERTIFICATE-----
[Your CA Certificate Here]
-----END CERTIFICATE-----
</ca>`
    }
  },
  'Android': {
    'Android 12+': {
      title: 'Android 12+ Setup',
      steps: [
        'Download OpenVPN Connect from Google Play Store',
        'Open the OpenVPN Connect app',
        'Tap the "+" button to add a new connection',
        'Select "File" and upload your .ovpn configuration file',
        'Enter your username and password when prompted',
        'Tap "Add" to save the connection',
        'Tap the connection to connect to the VPN'
      ],
      config: `client
dev tun
proto udp
remote your-server.com 1194
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-CBC
auth SHA256
verb 3
auth-user-pass
<ca>
-----BEGIN CERTIFICATE-----
[Your CA Certificate Here]
-----END CERTIFICATE-----
</ca>`
    },
    'Android 11': {
      title: 'Android 11 Setup',
      steps: [
        'Download OpenVPN Connect from Google Play Store',
        'Open the OpenVPN Connect app',
        'Tap the "+" button to add a new connection',
        'Select "File" and upload your .ovpn configuration file',
        'Enter your username and password when prompted',
        'Tap "Add" to save the connection',
        'Tap the connection to connect to the VPN'
      ],
      config: `client
dev tun
proto udp
remote your-server.com 1194
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-CBC
auth SHA256
verb 3
auth-user-pass
<ca>
-----BEGIN CERTIFICATE-----
[Your CA Certificate Here]
-----END CERTIFICATE-----
</ca>`
    }
  },
  'Linux': {
    'Ubuntu/Debian': {
      title: 'Ubuntu/Debian Setup',
      steps: [
        'Install OpenVPN: sudo apt update && sudo apt install openvpn',
        'Download your .ovpn configuration file',
        'Copy the config file to /etc/openvpn/client/',
        'Start the VPN: sudo openvpn --config /etc/openvpn/client/your-config.ovpn',
        'Enter your username and password when prompted',
        'To run as a service: sudo systemctl start openvpn@your-config'
      ],
      config: `client
dev tun
proto udp
remote your-server.com 1194
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-CBC
auth SHA256
verb 3
auth-user-pass
<ca>
-----BEGIN CERTIFICATE-----
[Your CA Certificate Here]
-----END CERTIFICATE-----
</ca>`
    },
    'CentOS/RHEL': {
      title: 'CentOS/RHEL Setup',
      steps: [
        'Install OpenVPN: sudo yum install openvpn',
        'Download your .ovpn configuration file',
        'Copy the config file to /etc/openvpn/client/',
        'Start the VPN: sudo openvpn --config /etc/openvpn/client/your-config.ovpn',
        'Enter your username and password when prompted',
        'To run as a service: sudo systemctl start openvpn@your-config'
      ],
      config: `client
dev tun
proto udp
remote your-server.com 1194
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-CBC
auth SHA256
verb 3
auth-user-pass
<ca>
-----BEGIN CERTIFICATE-----
[Your CA Certificate Here]
-----END CERTIFICATE-----
</ca>`
    }
  }
};

export default function VPNSetupInstructions() {
  const [activeOS, setActiveOS] = useState('Windows');
  const [activeVersion, setActiveVersion] = useState(Object.keys(setupInstructions[activeOS])[0]);
  const [showConfig, setShowConfig] = useState(false);

  const handleOSChange = (os: string) => {
    setActiveOS(os);
    setActiveVersion(Object.keys(setupInstructions[os])[0]);
    setShowConfig(false);
  };

  const handleVersionChange = (version: string) => {
    setActiveVersion(version);
    setShowConfig(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const currentInstructions = setupInstructions[activeOS][activeVersion];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="card bg-white/10 backdrop-blur-sm border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-white flex items-center">
          <DocumentTextIcon className="h-6 w-6 mr-3 text-blue-400" />
          Manual VPN Setup
        </h3>
      </div>

      {/* OS Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(setupInstructions).map((os) => (
            <button
              key={os}
              onClick={() => handleOSChange(os)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeOS === os
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {os}
            </button>
          ))}
        </div>

        {/* Version Dropdown */}
        <div className="relative">
          <select
            value={activeVersion}
            onChange={(e) => handleVersionChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            {Object.keys(setupInstructions[activeOS]).map((version) => (
              <option key={version} value={version} className="bg-gray-800 text-white">
                {version}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-white mb-4">{currentInstructions.title}</h4>
        <div className="space-y-3">
          {currentInstructions.steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <p className="text-gray-300 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration File */}
      <div className="border-t border-white/20 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">Configuration File</h4>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
            >
              {showConfig ? 'Hide' : 'Show'} Config
            </button>
            <button
              onClick={() => copyToClipboard(currentInstructions.config || '')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <ClipboardDocumentIcon className="h-4 w-4" />
              <span>Copy</span>
            </button>
          </div>
        </div>

        {showConfig && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
          >
            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
              {currentInstructions.config}
            </pre>
          </motion.div>
        )}
      </div>

      {/* Download Links */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <h4 className="text-lg font-semibold text-white mb-4">Download Required Software</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {activeOS === 'Windows' && (
            <>
              <a
                href="#"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-center"
              >
                OpenVPN Connect
              </a>
              <a
                href="#"
                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-center"
              >
                OpenVPN GUI
              </a>
            </>
          )}
          {activeOS === 'macOS' && (
            <a
              href="#"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-center"
            >
              Tunnelblick
            </a>
          )}
          {activeOS === 'iOS' && (
            <a
              href="#"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-center"
            >
              OpenVPN Connect
            </a>
          )}
          {activeOS === 'Android' && (
            <a
              href="#"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-center"
            >
              OpenVPN Connect
            </a>
          )}
          {activeOS === 'Linux' && (
            <>
              <a
                href="#"
                className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-center"
              >
                Ubuntu/Debian
              </a>
              <a
                href="#"
                className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-center"
              >
                CentOS/RHEL
              </a>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
