# Stripe Payment Integration Setup

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# App Configuration
VITE_APP_URL=http://localhost:5173
```

## Stripe Account Setup

1. **Create a Stripe Account**: Go to [stripe.com](https://stripe.com) and create an account
2. **Get API Keys**: 
   - Go to Developers → API Keys
   - Copy your Publishable key (starts with `pk_test_`)
   - Copy your Secret key (starts with `sk_test_`)
3. **Add Keys to Environment**: Add the keys to your `.env` file

## Backend API Endpoint

You need to create a backend endpoint to handle payment intents. Create this endpoint at `/api/create-payment-intent`:

```javascript
// Example Node.js/Express endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, currency, metadata } = req.body;
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      metadata: metadata,
    });
    
    res.json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Testing

1. **Test Cards**: Use Stripe's test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Requires 3D Secure: `4000 0025 0000 3155`

2. **Test the Integration**: 
   - Start your development server
   - Open the payment modal
   - Select "Karta płatnicza"
   - Use test card numbers
   - Complete the payment flow

## Production Setup

1. **Switch to Live Keys**: Replace test keys with live keys
2. **Webhook Setup**: Configure webhooks for payment events
3. **Domain Verification**: Add your domain to Stripe dashboard
4. **SSL Certificate**: Ensure your site has SSL in production

## Features Implemented

- ✅ Stripe Elements integration
- ✅ Payment form with validation
- ✅ Error handling
- ✅ Success/failure callbacks
- ✅ Responsive design
- ✅ Polish language support
- ✅ TypeScript support
