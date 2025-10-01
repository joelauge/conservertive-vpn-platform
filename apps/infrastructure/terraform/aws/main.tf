# ConSERVERtive VPN - Main Terraform Configuration

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
  
  # Backend configuration (uncomment and configure for production)
  # backend "s3" {
  #   bucket         = "conservertive-terraform-state"
  #   key            = "vpn-infrastructure/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "conservertive-terraform-locks"
  # }
}

# Configure AWS Provider
provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  
  default_tags {
    tags = local.common_tags
  }
}

# Configure Cloudflare Provider
provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-22.04-lts-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# VPC Configuration
resource "aws_vpc" "conservertive_vpc" {
  cidr_block           = var.vpc_cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(local.common_tags, {
    Name = "conservertive-vpc-${var.environment}"
  })
}

# Internet Gateway
resource "aws_internet_gateway" "conservertive_igw" {
  vpc_id = aws_vpc.conservertive_vpc.id

  tags = merge(local.common_tags, {
    Name = "conservertive-igw-${var.environment}"
  })
}

# Public Subnets
resource "aws_subnet" "conservertive_public" {
  count = length(var.public_subnet_cidrs)

  vpc_id                  = aws_vpc.conservertive_vpc.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = merge(local.common_tags, {
    Name = "conservertive-public-${count.index + 1}-${var.environment}"
    Type = "public"
  })
}

# Route Table for Public Subnets
resource "aws_route_table" "conservertive_public" {
  vpc_id = aws_vpc.conservertive_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.conservertive_igw.id
  }

  tags = merge(local.common_tags, {
    Name = "conservertive-public-rt-${var.environment}"
  })
}

# Route Table Associations
resource "aws_route_table_association" "conservertive_public" {
  count = length(aws_subnet.conservertive_public)

  subnet_id      = aws_subnet.conservertive_public[count.index].id
  route_table_id = aws_route_table.conservertive_public.id
}

# Security Group for VPN Servers
resource "aws_security_group" "conservertive_vpn" {
  name_prefix = "conservertive-vpn-${var.environment}"
  vpc_id      = aws_vpc.conservertive_vpc.id

  # SSH Access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
    description = "SSH access"
  }

  # OpenVPN Ports
  ingress {
    from_port   = var.openvpn_port
    to_port     = var.openvpn_port
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "OpenVPN"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "OpenVPN over HTTPS"
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "OpenVPN over HTTP"
  }

  # WireGuard Port
  ingress {
    from_port   = var.wireguard_port
    to_port     = var.wireguard_port
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "WireGuard"
  }

  # IKEv2/IPSec Ports
  ingress {
    from_port   = var.ikev2_port
    to_port     = var.ikev2_port
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "IKEv2/IPSec"
  }

  ingress {
    from_port   = var.ikev2_nat_port
    to_port     = var.ikev2_nat_port
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "IKEv2/IPSec NAT-T"
  }

  # Cloudflare Tunnel Port
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Cloudflare Tunnel Management"
  }

  # All outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "conservertive-vpn-sg-${var.environment}"
  })
}

# Key Pair for SSH Access
resource "aws_key_pair" "conservertive_key" {
  key_name   = "conservertive-vpn-${var.environment}"
  public_key = file("~/.ssh/id_rsa.pub")

  tags = merge(local.common_tags, {
    Name = "conservertive-vpn-key-${var.environment}"
  })
}

# IAM Role for VPN Servers
resource "aws_iam_role" "conservertive_vpn_role" {
  name = "conservertive-vpn-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(local.common_tags, {
    Name = "conservertive-vpn-role-${var.environment}"
  })
}

# IAM Policy for VPN Servers
resource "aws_iam_role_policy" "conservertive_vpn_policy" {
  name = "conservertive-vpn-policy-${var.environment}"
  role = aws_iam_role.conservertive_vpn_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ec2:DescribeInstances",
          "ec2:DescribeTags",
          "ec2:DescribeVolumes",
          "ec2:DescribeSnapshots"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ]
        Resource = "*"
      }
    ]
  })
}

# IAM Instance Profile
resource "aws_iam_instance_profile" "conservertive_vpn_profile" {
  name = "conservertive-vpn-profile-${var.environment}"
  role = aws_iam_role.conservertive_vpn_role.name

  tags = merge(local.common_tags, {
    Name = "conservertive-vpn-profile-${var.environment}"
  })
}

# User Data Script for VPN Server Setup
locals {
  user_data = base64encode(templatefile("${path.module}/user-data.sh", {
    environment = var.environment
    region      = var.aws_region
  }))
}

# VPN Server Instances
resource "aws_instance" "conservertive_vpn" {
  count = var.vpn_server_count

  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name              = aws_key_pair.conservertive_key.key_name
  vpc_security_group_ids = [aws_security_group.conservertive_vpn.id]
  subnet_id             = aws_subnet.conservertive_public[count.index % length(aws_subnet.conservertive_public)].id
  iam_instance_profile   = aws_iam_instance_profile.conservertive_vpn_profile.name

  user_data = local.user_data

  monitoring = var.enable_detailed_monitoring
  disable_api_termination = var.enable_termination_protection

  root_block_device {
    volume_type = "gp3"
    volume_size = 100
    encrypted   = true

    tags = merge(local.common_tags, {
      Name = "conservertive-vpn-root-${count.index + 1}-${var.environment}"
    })
  }

  tags = merge(local.common_tags, {
    Name  = "conservertive-vpn-${count.index + 1}-${var.environment}"
    Type  = "vpn-server"
    Index = count.index + 1
  })

  lifecycle {
    create_before_destroy = true
  }
}

# Elastic IPs for VPN Servers
resource "aws_eip" "conservertive_vpn" {
  count = var.vpn_server_count

  instance = aws_instance.conservertive_vpn[count.index].id
  domain   = "vpc"

  tags = merge(local.common_tags, {
    Name  = "conservertive-vpn-eip-${count.index + 1}-${var.environment}"
    Index = count.index + 1
  })

  depends_on = [aws_internet_gateway.conservertive_igw]
}

# Cloudflare DNS Records
resource "cloudflare_record" "conservertive_vpn" {
  count = var.vpn_server_count

  zone_id = var.cloudflare_zone_id
  name    = "vpn-${count.index + 1}-${var.environment}"
  value   = aws_eip.conservertive_vpn[count.index].public_ip
  type    = "A"
  ttl     = 300

  comment = "ConSERVERtive VPN Server ${count.index + 1} - ${var.environment}"
}
