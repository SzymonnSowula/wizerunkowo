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

app.get("/", async (req, res) => {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return res.status(500).json({ error: "Stripe secret key not found" });
    }

    // Get all prices from Stripe
    const response = await fetch('https://api.stripe.com/v1/prices?active=true&expand[]=data.product', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error: `Stripe API error: ${error}` });
    }

    const data = await response.json();
    const prices = data.data;

    // Map prices to our plan structure
    const pricingPlans = prices.map((price: any) => {
      const product = price.product;
      const amount = price.unit_amount / 100; // Convert from cents
      const currency = price.currency.toUpperCase();
      
      // Determine plan type based on product name or metadata
      let planType = 'one-time';
      let credits = 1;
      
      if (product.name.includes('5') || product.metadata?.credits === '5') {
        credits = 5;
      } else if (product.name.includes('10') || product.metadata?.credits === '10') {
        credits = 10;
      } else if (product.name.includes('25') || product.metadata?.credits === '25') {
        credits = 25;
      } else if (product.name.includes('50') || product.metadata?.credits === '50') {
        credits = 50;
      } else if (product.name.includes('600') || product.metadata?.credits === '600') {
        credits = 600;
      }

      if (price.recurring) {
        planType = price.recurring.interval === 'year' ? 'yearly' : 'monthly';
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: {
          oneTime: planType === 'one-time' ? amount : undefined,
          monthly: planType === 'monthly' ? amount : undefined,
          yearly: planType === 'yearly' ? amount : undefined,
        },
        credits: credits,
        period: planType,
        priceId: price.id,
        mode: price.recurring ? 'subscription' : 'payment',
        currency: currency,
        // Marketing prices (hardcoded for visual effect)
        originalPrice: planType === 'one-time' ? Math.round(amount * 1.2) : undefined,
        savings: planType === 'one-time' ? `Oszczędzasz ${Math.round(amount * 0.2)} zł` : undefined,
      };
    });

    res.set(corsHeaders).json({ plans: pricingPlans });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    
    res.status(400).json({
      error: error.message || 'Failed to fetch pricing'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
