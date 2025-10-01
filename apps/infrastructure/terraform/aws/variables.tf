# ConSERVERtive VPN - Terraform Variables

# AWS Configuration
variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "aws_access_key" {
  description = "AWS access key"
  type        = string
  sensitive   = true
}

variable "aws_secret_key" {
  description = "AWS secret key"
  type        = string
  sensitive   = true
}

# Cloudflare Configuration
variable "cloudflare_api_token" {
  description = "Cloudflare API token"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for DNS records"
  type        = string
}

variable "cloudflare_email" {
  description = "Cloudflare account email"
  type        = string
}

# Environment Configuration
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

# VPN Server Configuration
variable "vpn_server_count" {
  description = "Number of VPN servers to deploy"
  type        = number
  default     = 1
  
  validation {
    condition     = var.vpn_server_count > 0 && var.vpn_server_count <= 10
    error_message = "VPN server count must be between 1 and 10."
  }
}

variable "instance_type" {
  description = "EC2 instance type for VPN servers"
  type        = string
  default     = "c5n.xlarge"
  
  validation {
    condition = contains([
      "t3.medium", "t3.large", "t3.xlarge",
      "c5.large", "c5.xlarge", "c5.2xlarge",
      "c5n.large", "c5n.xlarge", "c5n.2xlarge",
      "m5.large", "m5.xlarge", "m5.2xlarge"
    ], var.instance_type)
    error_message = "Instance type must be a valid EC2 instance type."
  }
}

# Network Configuration
variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access VPN servers"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "vpc_cidr_block" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

# Security Configuration
variable "enable_detailed_monitoring" {
  description = "Enable detailed monitoring for EC2 instances"
  type        = bool
  default     = true
}

variable "enable_termination_protection" {
  description = "Enable termination protection for EC2 instances"
  type        = bool
  default     = false
}

variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 7
  
  validation {
    condition     = var.backup_retention_days >= 1 && var.backup_retention_days <= 30
    error_message = "Backup retention days must be between 1 and 30."
  }
}

# VPN Protocol Configuration
variable "openvpn_port" {
  description = "Port for OpenVPN server"
  type        = number
  default     = 1194
  
  validation {
    condition     = var.openvpn_port > 0 && var.openvpn_port <= 65535
    error_message = "OpenVPN port must be between 1 and 65535."
  }
}

variable "wireguard_port" {
  description = "Port for WireGuard server"
  type        = number
  default     = 51820
  
  validation {
    condition     = var.wireguard_port > 0 && var.wireguard_port <= 65535
    error_message = "WireGuard port must be between 1 and 65535."
  }
}

variable "ikev2_port" {
  description = "Port for IKEv2/IPSec server"
  type        = number
  default     = 500
  
  validation {
    condition     = var.ikev2_port > 0 && var.ikev2_port <= 65535
    error_message = "IKEv2 port must be between 1 and 65535."
  }
}

variable "ikev2_nat_port" {
  description = "Port for IKEv2/IPSec NAT-T"
  type        = number
  default     = 4500
  
  validation {
    condition     = var.ikev2_nat_port > 0 && var.ikev2_nat_port <= 65535
    error_message = "IKEv2 NAT port must be between 1 and 65535."
  }
}

# DNS Configuration
variable "dns_servers" {
  description = "DNS servers to use for VPN clients"
  type        = list(string)
  default     = ["1.1.1.1", "1.0.0.1"]
}

variable "vpn_domain" {
  description = "Domain name for VPN servers"
  type        = string
  default     = "conservertive.com"
}

# Monitoring Configuration
variable "enable_cloudwatch_logs" {
  description = "Enable CloudWatch logs for VPN servers"
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "Number of days to retain CloudWatch logs"
  type        = number
  default     = 14
  
  validation {
    condition     = var.log_retention_days >= 1 && var.log_retention_days <= 365
    error_message = "Log retention days must be between 1 and 365."
  }
}

# Cost Optimization
variable "enable_spot_instances" {
  description = "Use Spot instances for cost optimization"
  type        = bool
  default     = false
}

variable "spot_price" {
  description = "Maximum spot price (only used if enable_spot_instances is true)"
  type        = string
  default     = "0.10"
}

# Tags
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "conservertive-vpn"
}

variable "owner" {
  description = "Owner of the resources"
  type        = string
  default     = "conservertive-team"
}

variable "cost_center" {
  description = "Cost center for billing"
  type        = string
  default     = "vpn-infrastructure"
}

variable "additional_tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}

# Local values for computed tags
locals {
  common_tags = merge({
    Project     = var.project_name
    Environment = var.environment
    Owner       = var.owner
    CostCenter  = var.cost_center
    ManagedBy   = "terraform"
    CreatedAt   = timestamp()
  }, var.additional_tags)
}
