# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
}

# VPN Server Instances
resource "aws_instance" "conservertive_vpn" {
  count         = var.vpn_server_count
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_name
  subnet_id     = var.subnet_id
  vpc_security_group_ids = [aws_security_group.vpn_server_sg.id]

  user_data = base64encode(file("${path.module}/user-data.sh"))

  tags = {
    Name        = "conservertive-vpn-server-${count.index + 1}-${var.environment}"
    Environment = var.environment
    Project     = "conservertive-vpn"
  }
}

# Security Group for VPN Servers
resource "aws_security_group" "vpn_server_sg" {
  name        = "conservertive-vpn-server-sg-${var.environment}"
  description = "Allow VPN traffic and SSH access"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 1194
    to_port     = 1194
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 51820
    to_port     = 51820
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 500
    to_port     = 500
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 4500
    to_port     = 4500
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "conservertive-vpn-server-sg-${var.environment}"
    Environment = var.environment
    Project     = "conservertive-vpn"
  }
}

# Variables
variable "aws_region" {
  description = "The AWS region to deploy resources."
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "The deployment environment (e.g., dev, prod)."
  type        = string
  default     = "dev"
}

variable "instance_type" {
  description = "The EC2 instance type for VPN servers."
  type        = string
  default     = "t3.medium"
}

variable "ami_id" {
  description = "The AMI ID for the VPN server instances (e.g., Ubuntu 22.04 LTS)."
  type        = string
  default     = "ami-053b0d53c279acc90" # Ubuntu Server 22.04 LTS (HVM), SSD Volume Type
}

variable "key_name" {
  description = "The name of the SSH key pair to use for EC2 instances."
  type        = string
  default     = "id_rsa" # Assuming id_rsa.pub exists in ~/.ssh/
}

variable "vpc_id" {
  description = "The ID of the VPC to deploy the VPN servers into."
  type        = string
  default     = "vpc-0abcdef1234567890" # Replace with your actual VPC ID
}

variable "subnet_id" {
  description = "The ID of the subnet to deploy the VPN servers into."
  type        = string
  default     = "subnet-0fedcba9876543210" # Replace with your actual Subnet ID
}

variable "vpn_server_count" {
  description = "The number of VPN servers to deploy."
  type        = number
  default     = 1
}

# Outputs
output "vpn_server_public_ips" {
  description = "Public IP addresses of the VPN servers."
  value       = aws_instance.conservertive_vpn[*].public_ip
}

output "vpn_server_instance_ids" {
  description = "IDs of the VPN server instances."
  value       = aws_instance.conservertive_vpn[*].id
}