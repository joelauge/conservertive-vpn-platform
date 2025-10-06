import Foundation
import NetworkExtension
import React

@objc(ConSERVERtiveVPN)
class ConSERVERtiveVPN: RCTEventEmitter {
    
    private var vpnManager: NEVPNManager?
    
    override init() {
        super.init()
        setupVPNManager()
    }
    
    private func setupVPNManager() {
        vpnManager = NEVPNManager.shared()
        vpnManager?.loadFromPreferences { [weak self] error in
            if let error = error {
                print("Error loading VPN preferences: \(error)")
            } else {
                self?.setupVPNObserver()
            }
        }
    }
    
    private func setupVPNObserver() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(vpnStatusDidChange),
            name: .NEVPNStatusDidChange,
            object: vpnManager?.connection
        )
    }
    
    @objc private func vpnStatusDidChange() {
        guard let connection = vpnManager?.connection else { return }
        
        let status: String
        switch connection.status {
        case .connected:
            status = "connected"
        case .disconnected:
            status = "disconnected"
        case .connecting:
            status = "connecting"
        case .disconnecting:
            status = "disconnecting"
        case .reasserting:
            status = "reasserting"
        case .invalid:
            status = "invalid"
        @unknown default:
            status = "unknown"
        }
        
        sendEvent(withName: "VPNStatusChanged", body: ["status": status])
    }
    
    @objc
    func installConfiguration(_ config: NSDictionary, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard let vpnManager = vpnManager else {
            rejecter("VPN_ERROR", "VPN Manager not available", nil)
            return
        }
        
        guard let serverAddress = config["serverAddress"] as? String,
              let username = config["username"] as? String,
              let password = config["password"] as? String else {
            rejecter("INVALID_CONFIG", "Invalid VPN configuration", nil)
            return
        }
        
        let ikev2Protocol = NEVPNProtocolIKEv2()
        ikev2Protocol.serverAddress = serverAddress
        ikev2Protocol.remoteIdentifier = serverAddress
        ikev2Protocol.localIdentifier = username
        ikev2Protocol.authenticationMethod = .none
        ikev2Protocol.username = username
        ikev2Protocol.passwordReference = password.data(using: .utf8)
        ikev2Protocol.useExtendedAuthentication = true
        ikev2Protocol.disconnectOnSleep = false
        
        vpnManager.protocolConfiguration = ikev2Protocol
        vpnManager.localizedDescription = "ConSERVERtive VPN"
        vpnManager.isEnabled = true
        
        vpnManager.saveToPreferences { error in
            if let error = error {
                rejecter("SAVE_ERROR", "Failed to save VPN configuration: \(error.localizedDescription)", error)
            } else {
                resolver(["success": true])
            }
        }
    }
    
    @objc
    func connect(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard let vpnManager = vpnManager else {
            rejecter("VPN_ERROR", "VPN Manager not available", nil)
            return
        }
        
        do {
            try vpnManager.connection.startVPNTunnel()
            resolver(["success": true])
        } catch {
            rejecter("CONNECT_ERROR", "Failed to start VPN tunnel: \(error.localizedDescription)", error)
        }
    }
    
    @objc
    func disconnect(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard let vpnManager = vpnManager else {
            rejecter("VPN_ERROR", "VPN Manager not available", nil)
            return
        }
        
        vpnManager.connection.stopVPNTunnel()
        resolver(["success": true])
    }
    
    @objc
    func getStatus(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard let connection = vpnManager?.connection else {
            rejecter("VPN_ERROR", "VPN connection not available", nil)
            return
        }
        
        let status: String
        switch connection.status {
        case .connected:
            status = "connected"
        case .disconnected:
            status = "disconnected"
        case .connecting:
            status = "connecting"
        case .disconnecting:
            status = "disconnecting"
        case .reasserting:
            status = "reasserting"
        case .invalid:
            status = "invalid"
        @unknown default:
            status = "unknown"
        }
        
        resolver(["status": status])
    }
    
    override func supportedEvents() -> [String]! {
        return ["VPNStatusChanged"]
    }
    
    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
