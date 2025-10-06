# Production Database Setup

## Option 1: Railway PostgreSQL (Recommended)
1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL database
4. Copy connection string

## Option 2: Supabase (Alternative)
1. Go to https://supabase.com
2. Create new project
3. Get connection details

## Option 3: AWS RDS (Enterprise)
1. Go to AWS Console
2. Create RDS PostgreSQL instance
3. Configure security groups

## Database Configuration
```env
# Production Database
DB_HOST=your-production-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-secure-password
DB_NAME=conservertive_production
DB_SSL=true
```
