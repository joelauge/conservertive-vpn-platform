# Oracle Cloud CLI Configuration Steps

## Get API Credentials from Oracle Cloud Console

### 1. Navigate to User Settings
- Go to Oracle Cloud Console
- Click your profile icon (top right)
- Select "User Settings"

### 2. Generate API Key
- Click "API Keys" in the left menu
- Click "Add API Key"
- Choose "Generate API Key Pair"
- Download the private key file (keep it secure!)
- Copy the "Configuration File Preview"

### 3. Get Compartment OCID
- Go to "Identity & Security" → "Compartments"
- Copy the OCID of your root compartment

### 4. Get Region
- Note your region (e.g., us-ashburn-1, us-phoenix-1)

## Configure CLI
Run: `oci setup config`
- Enter the values from your configuration file preview
- Use the downloaded private key file path

## Test Configuration
Run: `oci iam user get --user-id $(oci iam user list --query 'data[0].id' --raw-output)`
