# Contact Modal Issue - Diagnosis and Fix

## Problem
The contact modal is not sending messages through EmailJS.

## Root Cause Analysis

The contact modal uses **EmailJS** (emailjs.com) to send form submissions. Based on the code analysis, there are several potential issues:

### 1. **EmailJS Configuration Issues** (Most Likely)
The script is configured with:
- **Public Key:** `oZfpOAxc3EJRG_Vjb`
- **Service ID:** `dappmctest`
- **Template ID:** `template_khde6m6`

**These IDs must be configured in your EmailJS account.**

### 2. **EmailJS Template Parameters**
The template expects these parameters:
- `name` - Sender's name
- `email` - Sender's email or phone
- `message` - Message content

## How to Fix

### Step 1: Verify EmailJS Account Setup

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/) and log in
2. Check your **Public Key** in Settings → API Keys
3. Verify the **Service ID** `dappmctest` exists in Email Services
4. Verify the **Template ID** `template_khde6m6` exists in Email Templates

### Step 2: Configure EmailJS Template

In your EmailJS dashboard:

1. Go to **Email Templates**
2. Find or create template with ID `template_khde6m6`
3. Ensure the template has these variables:
   - `{{name}}` - for the sender's name
   - `{{email}}` - for the sender's email/phone
   - `{{message}}` - for the message content
4. Set the **To email** to your destination email address
5. **Save and test** the template in EmailJS dashboard

### Step 3: Configure EmailJS Service

1. Go to **Email Services**
2. Find or create service with ID `dappmctest`
3. Connect it to your email provider (Gmail, Outlook, etc.)
4. Test the service connection

### Step 4: Update Public Key (if needed)

If the public key has changed, update it in `assets/js/script.js` line 1:
```javascript
emailjs.init("YOUR_NEW_PUBLIC_KEY");
```

## Debugging Steps

### Open Browser Console
1. Open your website in a browser
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Click "Send message" in the contact modal
5. Look for console logs that show:
   - Form submission data
   - Validation results
   - EmailJS errors

### Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| `EmailJS library not loaded!` | CDN failed to load | Check internet connection or CDN URL |
| `Email service not configured` | Service ID doesn't exist | Create service in EmailJS dashboard |
| `Authentication Error` | Invalid public key | Update public key in script.js |
| `Validation Error` | Missing required fields | Check template parameters |
| `Failed to send email` | Generic error | Check console for details |

## Recent Changes Made

I've added comprehensive debugging to `assets/js/script.js`:

### ✅ Added Debug Logging
- Form submission data logging
- Email/phone validation logging
- EmailJS send attempt logging
- Success/error response logging

### ✅ Improved Error Handling
- Specific error messages for different failure types
- EmailJS library availability check
- Better validation messages with examples

### ✅ Fixed Potential Issues
- Added `event.preventDefault()` to prevent form double-submission
- Increased phone number length limit from 15 to 20 characters
- Added console logs to track the entire flow

## Testing the Fix

1. **Open browser console** (F12)
2. **Fill out the contact form:**
   - Name: "Test User"
   - Email/Phone: "test@example.com" (or "+639123456789")
   - Message: "Test message"
3. **Click "Send message"**
4. **Check console for:**
   ```
   Form submitted with: {name: "Test User", contact: "test@example.com", message: "Test message"}
   Validation - Contact: test@example.com IsEmail: true IsPhone: false
   Attempting to send email with params: {...}
   EmailJS Service: dappmctest
   EmailJS Template: template_khde6m6
   ```

5. **Expected outcomes:**
   - Success: See "Your message has been sent!" toast and modal closes
   - Failure: See error toast with specific error message in console

## Alternative Solution: Direct Email Link

If EmailJS continues to have issues, you can replace it with a mailto link as a fallback:

```html
<a href="mailto:info@dappmc.com?subject=Contact Form Message&body=Name: {name}%0AEmail: {email}%0AMessage: {message}">Send Email</a>
```

## Need Help?

If the issue persists:
1. Check the browser console for specific error messages
2. Verify all EmailJS IDs are correct in the dashboard
3. Test the EmailJS template directly in the dashboard
4. Check if your email service (Gmail, etc.) has sending restrictions

## Files Modified

- `assets/js/script.js` - Added debugging, error handling, and improved validation
