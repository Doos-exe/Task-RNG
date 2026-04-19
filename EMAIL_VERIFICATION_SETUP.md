# Email Verification Setup Guide

This document explains how to set up email verification for TaskRoulette with Supabase.

## Current Implementation

The app now includes:
- ✅ Email verification on signup (automatic email sent)
- ✅ Resend verification email option
- ✅ Proper redirect URLs in verification emails
- ✅ Email verification endpoints

## Supabase Configuration

Follow these steps to enable email verification:

### Step 1: Configure Email Provider in Supabase

1. Go to your **Supabase Dashboard** → https://app.supabase.com
2. Select your **TaskRoulette** project
3. Navigate to **Authentication** → **Providers**
4. Ensure **Email** is enabled (toggle should be on)

### Step 2: Enable Email Verification

1. Go to **Authentication** → **Policies**
2. Under "Sign up", check the following:
   - ✅ Enable sign ups (should be checked)
   - ✅ Confirm email (should be checked for email verification to work)

### Step 3: Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. You should see several templates:
   - **Confirm sign up** - This is the verification email template
   - **Invite user** - Invitation emails
   - **Magic Link** - Password reset emails
   - **Change Email** - Email change confirmation

3. For the **Confirm sign up** template:
   - Click **Edit**
   - Ensure the template includes the `{{ .ConfirmationURL }}` variable (it should by default)
   - This URL should look like: `http://localhost:3000/auth?verified=true&code=...`
   - Save the template

### Step 4: Set Email Redirect URLs (Important!)

1. Go to **Authentication** → **URL Configuration**
2. Under **Redirect URLs**:
   - Add: `http://localhost:3000/auth` (for development)
   - Add: `http://localhost:3000/auth?verified=true` (for email verification callback)
   - Add: `https://yourdomain.com/auth` (for production)
   - Add: `https://yourdomain.com/auth?verified=true` (for production email verification)

### Step 5: SMTP Configuration (Optional but Recommended)

For production, configure a proper email provider:

1. Go to **Authentication** → **SMTP Settings**
2. Choose one of:
   - **SendGrid** (recommended for production)
   - **AWS SES**
   - **Postmark**
   - **Custom SMTP**

3. Follow the provider's setup instructions
4. Once configured, Supabase will use your provider instead of the default rate-limited service

## Testing Email Verification

### Test 1: Verify Email Sending (Development)

1. Go to `http://localhost:3000/auth`
2. Click **Sign Up**
3. Enter:
   - Name: Test User
   - Email: your-email@example.com
   - Password: testpass123
4. Click **Sign Up**
5. You should see: "Sign up successful! Please check your email to verify your account."
6. Check your email inbox for the verification email
7. The email should contain a verification link like:
   ```
   http://localhost:3000/auth?verified=true&token=...&type=signup
   ```

### Test 2: Verify Email Link Works

1. Click the verification link in the email
2. You should be redirected to the auth page
3. Try signing in with the same email and password
4. You should be able to log in successfully

### Test 3: Resend Verification Email

1. If you didn't receive the email, click **Resend Verification Email** on the auth page
2. Enter your email address
3. A new verification email should be sent

## Troubleshooting

### "No email received" - Checklist

- [ ] Supabase project has Email provider enabled
- [ ] Email verification setting is enabled in Authentication → Policies
- [ ] Redirect URLs are configured in Authentication → URL Configuration
- [ ] Check spam/junk folder
- [ ] Check Supabase logs for errors (Authentication → Logs tab)
- [ ] Try with a different email address
- [ ] Wait 1-2 minutes for email delivery

### Common Issues

**Issue: Email templates show incorrect URL**
- Solution: Go to Email Templates → Confirm sign up → Edit and ensure `{{ .ConfirmationURL }}` is present

**Issue: Redirect URL not working**
- Solution: Add the exact URL to Authentication → URL Configuration → Redirect URLs

**Issue: Getting "error_code": "bad_jwt" when verifying**
- Solution: The token might have expired. Ask user to request a new verification email using the resend option.

**Issue: Production emails not sending**
- Solution: Configure a proper SMTP provider (SendGrid, AWS SES, etc.) in Authentication → SMTP Settings

## Code Changes Made

1. **`app/api/auth/signup/route.ts`**
   - Added `emailRedirectTo` option to direct users to the correct page after email verification
   - Added better error logging

2. **`app/api/auth/resend-verification/route.ts`**
   - Added `emailRedirectTo` option
   - Added better error logging

3. **`app/api/auth/verify/route.ts`** (NEW)
   - Handles email verification callbacks
   - Verifies the token sent by Supabase

## Next Steps for User

1. Update your Supabase configuration following the steps above
2. Test the email verification flow locally
3. Check the Supabase logs if emails still aren't sending
4. Configure an email provider (SendGrid, etc.) for production use

## Email Verification Flow

```
User Signs Up → Supabase generates verification token → 
Email sent with verification link → 
User clicks link in email → 
User redirected to /auth?verified=true → 
User can log in → 
Verification confirmed in Supabase
```

## Production Checklist

- [ ] SMTP provider configured (SendGrid, AWS SES, Postmark, etc.)
- [ ] Production domain added to Redirect URLs
- [ ] Email templates customized (optional)
- [ ] Test with production email address
- [ ] Monitor authentication logs
