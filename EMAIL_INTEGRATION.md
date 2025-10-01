# Email Integration Guide

## Overview
This project includes a complete email capture and notification system. The current implementation uses Supabase for data storage and provides hooks for easy integration with external email services.

## Current Implementation

### Files Created:
- `src/services/emailService.ts` - Main email service
- `src/types/email.ts` - TypeScript types
- `src/hooks/useEmailCapture.ts` - React hook for email capture
- `src/components/EmailStats.tsx` - Admin component for email statistics
- `supabase/migrations/001_create_email_tables.sql` - Database schema

### Database Tables:
1. **email_captures** - Stores captured email addresses
2. **email_notifications** - Tracks email notifications sent
3. **email_analytics** - Analytics for email campaigns

## External Email Service Integration

### Option 1: Supabase Edge Functions (Recommended)

Create a Supabase Edge Function to handle email sending:

```typescript
// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, subject, template, data } = await req.json()
    
    // Use your preferred email service here
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@yourdomain.com',
        to: [email],
        subject: subject,
        html: generateEmailHTML(template, data),
      }),
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
```

### Option 2: Direct Integration with Email Services

Update `src/services/emailService.ts` to integrate directly with your preferred service:

#### Resend Integration:
```bash
npm install resend
```

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// In sendEmailNotification method:
const { data, error } = await resend.emails.send({
  from: 'noreply@yourdomain.com',
  to: [data.email],
  subject: data.subject,
  html: generateEmailHTML(data.template, data.data),
});
```

#### SendGrid Integration:
```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// In sendEmailNotification method:
const msg = {
  to: data.email,
  from: 'noreply@yourdomain.com',
  subject: data.subject,
  html: generateEmailHTML(data.template, data.data),
};

await sgMail.send(msg);
```

#### Mailgun Integration:
```bash
npm install mailgun-js
```

```typescript
import mailgun from 'mailgun-js';

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

// In sendEmailNotification method:
const emailData = {
  from: 'noreply@yourdomain.com',
  to: data.email,
  subject: data.subject,
  html: generateEmailHTML(data.template, data.data),
};

await mg.messages().send(emailData);
```

## Environment Variables

Add these to your `.env` file:

```env
# Email Service (choose one)
RESEND_API_KEY=your_resend_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain

# Supabase (already configured)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## Email Templates

Create email templates for different scenarios:

### Discount Email Template:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Twoja zniżka 50%</title>
</head>
<body>
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h1>🎉 Gratulacje!</h1>
        <p>Otrzymujesz specjalną zniżkę 50% na nasze usługi!</p>
        <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h2>Twój kod zniżki:</h2>
            <div style="font-size: 24px; font-weight: bold; color: #e74c3c;">DISCOUNT123</div>
        </div>
        <p>Użyj tego kodu podczas zakupu, aby otrzymać 50% zniżki!</p>
        <a href="https://yourdomain.com/pricing" style="background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Kup teraz</a>
    </div>
</body>
</html>
```

## Usage Examples

### Basic Email Capture:
```typescript
import { useEmailCapture } from '@/hooks/useEmailCapture';

function MyComponent() {
  const { captureEmail, isSubmitting, error } = useEmailCapture();

  const handleSubmit = async (email: string) => {
    const success = await captureEmail({
      email,
      source: 'contact_form',
      campaign: 'winter_sale_2024'
    });

    if (success) {
      console.log('Email captured successfully!');
    }
  };

  return (
    // Your component JSX
  );
}
```

### Display Email Stats:
```typescript
import EmailStats from '@/components/EmailStats';

function AdminDashboard() {
  return (
    <div>
      <h1>Email Analytics</h1>
      <EmailStats refreshInterval={30000} showRefreshButton={true} />
    </div>
  );
}
```

## Next Steps

1. **Choose an email service** (Resend, SendGrid, Mailgun, etc.)
2. **Set up API keys** in your environment variables
3. **Update the email service** to use your chosen provider
4. **Create email templates** for different scenarios
5. **Set up webhooks** for email delivery tracking (optional)
6. **Test the integration** with real email addresses

## Database Setup

Run the SQL migration to create the necessary tables:

```sql
-- Execute the contents of supabase/migrations/003_create_email_tables_simple.sql
-- in your Supabase SQL editor
```

**Important:** Use the `003_create_email_tables_simple.sql` file as it contains the simplest version that works reliably with Supabase without complex constraints.

### Alternative: Step by Step Setup

If you prefer to run commands one by one:

```sql
-- 1. Create the main table for email captures
CREATE TABLE IF NOT EXISTS public.email_captures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'upsell_banner',
    campaign VARCHAR(100),
    discount_code VARCHAR(20),
    user_agent TEXT,
    ip_address TEXT,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    capture_count INTEGER DEFAULT 1
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_email_captures_email ON public.email_captures (email);
CREATE INDEX IF NOT EXISTS idx_email_captures_source ON public.email_captures (source);

-- 3. Enable RLS
ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

-- 4. Create policy to allow public access
CREATE POLICY "Allow all operations on email_captures" ON public.email_captures
    FOR ALL USING (true) WITH CHECK (true);

-- 5. Grant permissions
GRANT ALL ON public.email_captures TO anon, authenticated;
```

## Security Considerations

1. **Rate limiting** - Implement rate limiting for email capture
2. **Email validation** - Always validate email addresses
3. **GDPR compliance** - Add unsubscribe functionality
4. **Spam protection** - Use reCAPTCHA or similar
5. **API key security** - Never expose API keys in client-side code

## Testing

Test your email integration with:

```typescript
// Test email capture
const result = await emailService.captureEmail({
  email: 'test@example.com',
  source: 'upsell_banner',
  campaign: 'test_campaign'
});

// Test email sending
const notification = await emailService.sendEmailNotification({
  email: 'test@example.com',
  subject: 'Test Email',
  template: 'welcome',
  data: { name: 'Test User' }
});
```
