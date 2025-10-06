# Production Backend Optimization for ConSERVERtive VPN

## Current State Analysis
- ✅ Backend deployed on Google Cloud
- ✅ PostgreSQL database operational
- ✅ Clerk authentication integrated
- ✅ Stripe payments working
- ✅ VPN credential management implemented

## Production Optimizations Needed

### 1. Performance Optimization
```typescript
// apps/backend/src/app.module.ts - Production optimizations
TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false, // Always false in production
  migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
  migrationsRun: true,
  ssl: { rejectUnauthorized: false },
  // Production performance settings
  maxQueryExecutionTime: 5000,
  logging: ['error', 'warn'],
  cache: {
    type: 'redis',
    options: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
  },
  // Connection pooling
  extra: {
    max: 20,
    min: 5,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  },
}),
```

### 2. Security Hardening
```typescript
// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// Rate limiting per user
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyGenerator: (req) => req.user?.userId || req.ip,
    message: 'Too many requests from this user',
  }),
);
```

### 3. Monitoring & Health Checks
```typescript
// Enhanced health check endpoint
@Controller('health')
export class HealthController {
  constructor(
    private dataSource: DataSource,
    private redis: Redis,
  ) {}

  @Get()
  async getHealth() {
    const checks = {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };

    const isHealthy = Object.values(checks).every(check => 
      typeof check === 'object' ? check.status === 'ok' : true
    );

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      checks,
    };
  }
}
```

### 4. Error Handling & Logging
```typescript
// Global exception filter
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : exception,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

## Environment Variables for Production
```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
REDIS_URL=redis://user:pass@host:port

# Security
JWT_SECRET=your-super-secure-jwt-secret-key
ENCRYPTION_KEY=your-32-character-encryption-key

# External Services
CLERK_SECRET_KEY=sk_live_your_clerk_secret_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info

# Performance
NODE_ENV=production
PORT=3001
MAX_CONNECTIONS=1000
```

## Google Cloud Production Configuration

### 1. Compute Engine Optimization
```yaml
# Cloud Run configuration
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: conservertive-backend
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: "100"
        autoscaling.knative.dev/minScale: "2"
        run.googleapis.com/cpu-throttling: "false"
    spec:
      containerConcurrency: 1000
      containers:
      - image: gcr.io/PROJECT_ID/conservertive-backend
        resources:
          limits:
            cpu: "2"
            memory: "4Gi"
          requests:
            cpu: "1"
            memory: "2Gi"
        env:
        - name: NODE_ENV
          value: "production"
```

### 2. Cloud SQL Production Setup
```sql
-- Production database optimizations
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;

-- Create indexes for performance
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX CONCURRENTLY idx_vpn_credentials_user_id ON users(id) WHERE vpn_username IS NOT NULL;
```

### 3. Redis Cache Configuration
```yaml
# Redis Cloud configuration
redis:
  host: your-redis-host
  port: 6379
  password: your-redis-password
  db: 0
  retryDelayOnFailover: 100
  enableReadyCheck: false
  maxRetriesPerRequest: 3
  lazyConnect: true
  keepAlive: 30000
  family: 4
```

## Deployment Commands

### 1. Build and Deploy
```bash
# Build production image
docker build -t gcr.io/PROJECT_ID/conservertive-backend:latest .

# Push to Google Container Registry
docker push gcr.io/PROJECT_ID/conservertive-backend:latest

# Deploy to Cloud Run
gcloud run deploy conservertive-backend \
  --image gcr.io/PROJECT_ID/conservertive-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 100 \
  --min-instances 2
```

### 2. Database Migration
```bash
# Run production migrations
npm run migration:run

# Verify database health
npm run db:health
```

### 3. Health Check
```bash
# Test production endpoints
curl https://api.conservertive.co/health
curl https://api.conservertive.co/vpn/credentials
```

## Monitoring Setup

### 1. Google Cloud Monitoring
```yaml
# monitoring.yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: conservertive-backend
spec:
  selector:
    matchLabels:
      app: conservertive-backend
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
```

### 2. Custom Metrics
```typescript
// Custom metrics collection
@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  @Cron('*/5 * * * *')
  async collectMetrics() {
    const metrics = {
      activeUsers: await this.getActiveUserCount(),
      vpnConnections: await this.getVPNConnectionCount(),
      apiRequests: await this.getAPIRequestCount(),
      errorRate: await this.getErrorRate(),
      responseTime: await this.getAverageResponseTime(),
    };

    this.logger.log('Metrics collected', metrics);
    // Send to monitoring service
  }
}
```

## Performance Targets
- **Response Time**: < 200ms (95th percentile)
- **Uptime**: > 99.9%
- **Error Rate**: < 0.1%
- **Concurrent Users**: 10,000+
- **Database Queries**: < 100ms average
- **Cache Hit Rate**: > 90%
