# ConSERVERtive VPN - Terraform Outputs

# VPN Server Information
output "vpn_servers" {
  description = "Information about deployed VPN servers"
  value = {
    count = length(aws_instance.conservertive_vpn)
    instances = [
      for i, instance in aws_instance.conservertive_vpn : {
        id           = instance.id
        public_ip    = aws_eip.conservertive_vpn[i].public_ip
        private_ip   = instance.private_ip
        dns_name     = cloudflare_record.conservertive_vpn[i].hostname
        instance_type = instance.instance_type
        availability_zone = instance.availability_zone
        state        = instance.state
      }
    ]
  }
}

output "vpn_server_ips" {
  description = "Public IP addresses of VPN servers"
  value       = aws_eip.conservertive_vpn[*].public_ip
}

output "vpn_server_dns" {
  description = "DNS names of VPN servers"
  value       = cloudflare_record.conservertive_vpn[*].hostname
}

# Network Information
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.conservertive_vpc.id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.conservertive_vpc.cidr_block
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.conservertive_public[*].id
}

output "internet_gateway_id" {
  description = "ID of the Internet Gateway"
  value       = aws_internet_gateway.conservertive_igw.id
}

# Security Information
output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.conservertive_vpn.id
}

output "security_group_name" {
  description = "Name of the security group"
  value       = aws_security_group.conservertive_vpn.name
}

# Key Pair Information
output "key_pair_name" {
  description = "Name of the key pair"
  value       = aws_key_pair.conservertive_key.key_name
}

# IAM Information
output "iam_role_name" {
  description = "Name of the IAM role"
  value       = aws_iam_role.conservertive_vpn_role.name
}

output "iam_instance_profile_name" {
  description = "Name of the IAM instance profile"
  value       = aws_iam_instance_profile.conservertive_vpn_profile.name
}

# VPN Protocol Information
output "vpn_protocols" {
  description = "VPN protocols and their configurations"
  value = {
    openvpn = {
      port     = var.openvpn_port
      protocol = "udp"
      status   = "enabled"
    }
    wireguard = {
      port     = var.wireguard_port
      protocol = "udp"
      status   = "enabled"
    }
    ikev2 = {
      port     = var.ikev2_port
      nat_port = var.ikev2_nat_port
      protocol = "udp"
      status   = "enabled"
    }
  }
}

# DNS Information
output "dns_records" {
  description = "DNS records created in Cloudflare"
  value = [
    for record in cloudflare_record.conservertive_vpn : {
      name    = record.name
      type    = record.type
      value   = record.value
      ttl     = record.ttl
      comment = record.comment
    }
  ]
}

# Connection Information
output "connection_info" {
  description = "Information for connecting to VPN servers"
  value = {
    openvpn = {
      server = aws_eip.conservertive_vpn[0].public_ip
      port   = var.openvpn_port
      protocol = "udp"
      config_url = "http://${aws_eip.conservertive_vpn[0].public_ip}:8080/config/openvpn/client1"
    }
    wireguard = {
      server = aws_eip.conservertive_vpn[0].public_ip
      port   = var.wireguard_port
      protocol = "udp"
      config_url = "http://${aws_eip.conservertive_vpn[0].public_ip}:8080/config/wireguard/client1"
    }
    ikev2 = {
      server = aws_eip.conservertive_vpn[0].public_ip
      port   = var.ikev2_port
      nat_port = var.ikev2_nat_port
      protocol = "udp"
      config_url = "http://${aws_eip.conservertive_vpn[0].public_ip}:8080/config/ikev2/client1"
    }
  }
}

# Management Information
output "management_endpoints" {
  description = "Management endpoints for VPN servers"
  value = {
    health_check = "http://${aws_eip.conservertive_vpn[0].public_ip}:8080/health"
    status_api   = "http://${aws_eip.conservertive_vpn[0].public_ip}:8080/status"
    ssh_access   = "ssh -i ~/.ssh/id_rsa ubuntu@${aws_eip.conservertive_vpn[0].public_ip}"
  }
}

# Cost Information
output "estimated_monthly_cost" {
  description = "Estimated monthly cost for the infrastructure"
  value = {
    ec2_instances = var.vpn_server_count * 150  # Approximate cost per instance
    eip_addresses = var.vpn_server_count * 3.65  # Elastic IP cost
    data_transfer = 100  # Estimated data transfer cost
    total_estimated = var.vpn_server_count * 150 + var.vpn_server_count * 3.65 + 100
  }
}

# Environment Information
output "environment_info" {
  description = "Environment and deployment information"
  value = {
    environment    = var.environment
    region         = var.aws_region
    instance_type  = var.instance_type
    server_count   = var.vpn_server_count
    project_name   = var.project_name
    deployment_time = timestamp()
  }
}

# Next Steps
output "next_steps" {
  description = "Next steps for VPN server setup"
  value = {
    step_1 = "Authenticate with Cloudflare: cloudflared tunnel login"
    step_2 = "Create Cloudflare tunnel: cloudflared tunnel create conservertive-vpn-${var.environment}"
    step_3 = "Configure tunnel routing in Cloudflare dashboard"
    step_4 = "Start tunnel: cloudflared tunnel run conservertive-vpn-${var.environment}"
    step_5 = "Test VPN connections using the provided endpoints"
    step_6 = "Monitor server health at: http://${aws_eip.conservertive_vpn[0].public_ip}:8080/health"
  }
}
