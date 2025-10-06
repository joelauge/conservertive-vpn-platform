# 🔐 Clerk Authentication Setup Guide

## 📋 **Prerequisites**

1. **Clerk Account**: Sign up at [clerk.com](https://clerk.com)
2. **Node.js**: Version 18+ (current: v18.20.5)
3. **Environment Variables**: Ready to configure

## 🚀 **Step 1: Create Clerk Application**

1. **Go to Clerk Dashboard**: [dashboard.clerk.com](https://dashboard.clerk.com)
2. **Create New Application**:
   - Click "Add application"
   - Choose "Next.js" as the framework
   - Name: "ConSERVERtive VPN"
   - Choose your preferred sign-in methods (Email, Google, etc.)

## 🔑 **Step 2: Get API Keys**

1. **Navigate to API Keys**:
   - Go to "API Keys" in your Clerk dashboard
   - Copy the **Publishable Key** (starts with `pk_test_`)
   - Copy the **Secret Key** (starts with `sk_test_`)

## ⚙️ **Step 3: Configure Environment Variables**

Update `apps/frontend/.env.local`:

```bash
# Replace with your actual Clerk keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here

# Clerk URLs (already configured)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## 🎨 **Step 4: Customize Clerk Appearance**

The authentication pages are already styled to match ConSERVERtive's dark theme:

- **Dark Background**: Gradient from gray-900 to black
- **ConSERVERtive Logo**: Displayed on auth pages
- **Brand Colors**: Blue to purple gradients
- **Glass Morphism**: Backdrop blur effects

## 🔄 **Step 5: Authentication Flow**

### **For New Users:**
1. Click "Start Free Trial" → Clerk Sign-Up Modal
2. Complete registration → Redirected to `/dashboard`
3. Dashboard shows VPN status and user stats

### **For Existing Users:**
1. Click "Get Started" → Clerk Sign-In Modal
2. Sign in → Redirected to `/dashboard`
3. Full access to VPN features

### **For Authenticated Users:**
1. "Get Started" button becomes "Dashboard"
2. Direct access to user dashboard
3. User profile management via Clerk

## 🛡️ **Step 6: Protected Routes**

**Public Routes** (no authentication required):
- `/` - Homepage
- `/sign-in` - Sign-in page
- `/sign-up` - Sign-up page

**Protected Routes** (authentication required):
- `/dashboard` - User dashboard
- `/profile` - User profile (future)
- `/settings` - Account settings (future)

## 🧪 **Step 7: Test Authentication**

1. **Start Development Server**:
   ```bash
   cd apps/frontend
   npm run dev
   ```

2. **Test Sign-Up Flow**:
   - Visit `http://localhost:3000`
   - Click "Start Free Trial"
   - Complete sign-up process
   - Verify redirect to dashboard

3. **Test Sign-In Flow**:
   - Sign out from dashboard
   - Click "Get Started"
   - Sign in with existing credentials
   - Verify redirect to dashboard

## 🚀 **Step 8: Deploy to Production**

1. **Update Production Environment**:
   - Add Clerk keys to Vercel environment variables
   - Update domain settings in Clerk dashboard

2. **Configure Clerk Domains**:
   - Add `conservertive.co` to allowed domains
   - Configure production redirect URLs

## 📊 **Step 9: User Management**

**Clerk Dashboard Features**:
- **User Analytics**: Track sign-ups, active users
- **User Management**: View, edit, delete users
- **Security**: Monitor suspicious activity
- **Customization**: Modify auth flows and appearance

## 🔧 **Troubleshooting**

**Common Issues**:
1. **"Invalid API Key"**: Check environment variables
2. **"Redirect Error"**: Verify URL configuration
3. **"CORS Error"**: Check domain settings in Clerk

**Debug Steps**:
1. Check browser console for errors
2. Verify environment variables are loaded
3. Check Clerk dashboard for configuration issues

## 🎯 **Next Steps**

After Clerk setup:
1. **Backend Integration**: Connect Clerk to backend API
2. **User Profiles**: Create user profile management
3. **Subscription Management**: Integrate with Stripe
4. **VPN Configuration**: Generate user-specific VPN configs

---

**🎉 Your ConSERVERtive VPN now has enterprise-grade authentication powered by Clerk!**


