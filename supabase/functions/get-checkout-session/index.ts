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
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    // Get checkout session from Stripe
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error: `Stripe API error: ${error}` });
    }

    const session = await response.json();

    res.set(corsHeaders).json(session);
  } catch (error) {
    console.error('Error getting checkout session:', error);
    
    res.status(400).json({ 
      error: error.message || 'Failed to get checkout session' 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});