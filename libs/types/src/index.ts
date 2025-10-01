import { z } from 'zod';

// User Types
export const UserRoleSchema = z.enum(['user', 'admin', 'sponsor']);
export const UserCountrySchema = z.enum(['free', 'censored']);
export const SubscriptionPlanSchema = z.enum(['free', 'basic', 'premium', 'enterprise']);

export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserCountry = z.infer<typeof UserCountrySchema>;
export type SubscriptionPlan = z.infer<typeof SubscriptionPlanSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: UserRoleSchema,
  country: UserCountrySchema,
  isSponsored: z.boolean().default(false),
  sponsorId: z.string().uuid().optional(),
  subscriptionPlan: SubscriptionPlanSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Authentication Types
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  country: UserCountrySchema,
});

export const AuthResponseSchema = z.object({
  access_token: z.string(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    role: UserRoleSchema,
    country: UserCountrySchema,
    isSponsored: z.boolean(),
  }),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// VPN Types
export const VpnProtocolSchema = z.enum(['openvpn', 'wireguard', 'ikev2']);
export type VpnProtocol = z.infer<typeof VpnProtocolSchema>;

export const VpnServerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  country: z.string(),
  city: z.string(),
  ip: z.string().ip(),
  port: z.number().int().positive(),
  protocol: VpnProtocolSchema,
  load: z.number().min(0).max(100),
  isObfuscated: z.boolean().default(false),
  isOnline: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type VpnServer = z.infer<typeof VpnServerSchema>;

export const VpnConnectionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  serverId: z.string().uuid(),
  protocol: VpnProtocolSchema,
  connectedAt: z.date(),
  disconnectedAt: z.date().optional(),
  bytesTransferred: z.number().default(0),
  duration: z.number().default(0),
});

export type VpnConnection = z.infer<typeof VpnConnectionSchema>;

// Billing Types
export const PaymentMethodSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum(['card', 'paypal', 'crypto']),
  last4: z.string().optional(),
  brand: z.string().optional(),
  expiryMonth: z.number().optional(),
  expiryYear: z.number().optional(),
  isDefault: z.boolean().default(false),
  createdAt: z.date(),
});

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  plan: SubscriptionPlanSchema,
  status: z.enum(['active', 'cancelled', 'past_due', 'unpaid']),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  cancelAtPeriodEnd: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;

export const InvoiceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  subscriptionId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  status: z.enum(['draft', 'open', 'paid', 'void', 'uncollectible']),
  dueDate: z.date(),
  paidAt: z.date().optional(),
  createdAt: z.date(),
});

export type Invoice = z.infer<typeof InvoiceSchema>;

// Analytics Types
export const AnalyticsEventSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  event: z.string(),
  properties: z.record(z.any()),
  timestamp: z.date(),
});

export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

// API Response Types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// Error Types
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Sponsorship Types
export const SponsorshipSchema = z.object({
  id: z.string().uuid(),
  sponsorId: z.string().uuid(),
  sponsoredUserId: z.string().uuid(),
  status: z.enum(['active', 'cancelled', 'completed']),
  startDate: z.date(),
  endDate: z.date().optional(),
  createdAt: z.date(),
});

export type Sponsorship = z.infer<typeof SponsorshipSchema>;

// Domain Hosting Types
export const DomainSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  domain: z.string(),
  isAnonymous: z.boolean().default(true),
  sslEnabled: z.boolean().default(true),
  cdnEnabled: z.boolean().default(true),
  status: z.enum(['active', 'suspended', 'expired']),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export type Domain = z.infer<typeof DomainSchema>;
