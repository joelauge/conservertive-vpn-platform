# 🌐 **Vercel Environment Variables Setup**

## 📋 **Required Environment Variables**

Add these environment variables to your Vercel project:

### **🔐 Clerk Authentication**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key_here
CLERK_SECRET_KEY=sk_live_your_secret_key_here
```

### **🌐 Clerk URLs**
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## 🚀 **How to Add Environment Variables in Vercel**

### **Method 1: Vercel Dashboard**
1. **Go to**: [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Select**: Your `conservertive-frontend` project
3. **Click**: "Settings" tab
4. **Click**: "Environment Variables" in the sidebar
5. **Add each variable**:
   - **Name**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Value**: `pk_live_your_key_here`
   - **Environment**: Production, Preview, Development
6. **Repeat** for all variables
7. **Click**: "Save"

### **Method 2: Vercel CLI**
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_URL
vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_URL
vercel env add NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
vercel env add NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
```

## 🔄 **After Adding Environment Variables**

### **1. Redeploy Your Project**
```bash
# Trigger a new deployment
vercel --prod
```

### **2. Verify Environment Variables**
- Check that the new deployment uses the production keys
- Test authentication on the live site
- Verify redirects work correctly

## 🧪 **Testing Production Setup**

### **1. Test Sign-Up Flow**
1. Visit `https://conservertive.co`
2. Click "Start Free Trial"
3. Complete sign-up process
4. Verify redirect to dashboard

### **2. Test Sign-In Flow**
1. Sign out from dashboard
2. Click "Get Started"
3. Sign in with existing credentials
4. Verify redirect to dashboard

### **3. Check Clerk Dashboard**
1. Go to your Clerk dashboard
2. Switch to "Production" environment
3. Check "Users" section for new sign-ups
4. Monitor "Analytics" for authentication events

## 🚨 **Important Notes**

### **Security**
- ✅ **Never commit** production keys to git
- ✅ **Use environment variables** for all sensitive data
- ✅ **Rotate keys** if compromised
- ✅ **Monitor** authentication logs

### **Performance**
- ✅ **Production keys** are optimized for performance
- ✅ **CDN caching** is enabled for production
- ✅ **Rate limiting** is more aggressive in production

### **Monitoring**
- ✅ **Set up alerts** for authentication failures
- ✅ **Monitor** user sign-up rates
- ✅ **Track** conversion metrics

---

**🎉 Your ConSERVERtive VPN is now ready for production authentication!**


