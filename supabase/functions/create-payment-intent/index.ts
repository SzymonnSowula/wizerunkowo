import "dotenv/config";
import express from "express";
import { createClient } from '@supabase/supabase-js'

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
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: "Missing required environment variables" });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { amount, currency = 'pln', metadata = {} } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    // Create payment intent with Stripe
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: amount.toString(),
        currency: currency,
        metadata: JSON.stringify(metadata),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error: `Stripe API error: ${error}` });
    }

    const paymentIntent = await response.json();

    // Store payment intent in database
    const { data, error: dbError } = await supabase
      .from('payment_intents')
      .insert({
        stripe_payment_intent_id: paymentIntent.id,
        amount: amount,
        currency: currency,
        status: 'created',
        metadata: metadata,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error storing payment intent:', dbError);
      return res.status(500).json({ error: "Failed to store payment intent" });
    }

    res.set(corsHeaders).json({ 
      client_secret: paymentIntent.client_secret,
      id: data.id 
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    res.status(400).json({ 
      error: error.message || 'Failed to create payment intent' 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});