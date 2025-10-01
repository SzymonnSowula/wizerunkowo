import "dotenv/config";
import express from "express";

const app = express();
app.use(express.json());

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

app.options("/", (_, res) => {
  res.set(corsHeaders).sendStatus(200);
});

app.post("/", async (req, res) => {
  try {
    // Get Stripe secret key from environment
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return res.status(500).json({ error: "Stripe secret key not found" });
    }

    // Parse request body
    const { 
      priceId, 
      mode = 'payment', 
      successUrl, 
      cancelUrl, 
      userId,
      metadata = {} 
    } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: "Price ID is required" });
    }

    // Create checkout session with Stripe
    const params = new URLSearchParams();
    params.append('mode', mode);
    params.append('line_items', JSON.stringify([{
      price: priceId,
      quantity: 1,
    }]));
    params.append('success_url', successUrl || `${process.env.VITE_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`);
    params.append('cancel_url', cancelUrl || `${process.env.VITE_APP_URL}/pricing`);
    params.append('metadata', JSON.stringify({
      user_id: userId,
      ...metadata,
    }));
    params.append('allow_promotion_codes', 'true');
    params.append('billing_address_collection', 'auto');
    params.append('customer_creation', 'if_required');

    if (mode === 'payment') {
      params.append('payment_intent_data', JSON.stringify({
        metadata: {
          user_id: userId,
          ...metadata,
        }
      }));
    } else if (mode === 'subscription') {
      params.append('subscription_data', JSON.stringify({
        metadata: {
          user_id: userId,
          ...metadata,
        }
      }));
    }

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error: `Stripe API error: ${error}` });
    }

    const session = await response.json();

    res.set(corsHeaders).json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    res.status(400).json({ 
      error: error.message || 'Failed to create checkout session' 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});