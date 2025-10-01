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
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: "Missing required environment variables" });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the raw body
    const body = req.body;
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).json({ error: "No Stripe signature found" });
    }

    // Verify webhook signature (in production, you should verify this)
    // For now, we'll process the event directly
    const event = body;

    console.log('Received Stripe webhook:', event.type);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object, supabase);
        break;
      
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object, supabase);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object, supabase);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object, supabase);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object, supabase);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object, supabase);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.set(corsHeaders).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    
    res.status(400).json({ 
      error: error.message || 'Webhook processing failed' 
    });
  }
});

async function handlePaymentIntentSucceeded(paymentIntent: any, supabase: any) {
  try {
    console.log('Processing payment intent succeeded:', paymentIntent.id);
    
    // Get payment intent from database
    const { data: dbPaymentIntent } = await supabase
      .from('payment_intents')
      .select('*')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .single()

    if (!dbPaymentIntent) {
      console.error('Payment intent not found in database:', paymentIntent.id)
      return
    }

    // Extract user info from metadata
    const userId = paymentIntent.metadata?.user_id
    const credits = parseInt(paymentIntent.metadata?.credits || '0')
    const planName = paymentIntent.metadata?.plan_name

    if (!userId || credits <= 0) {
      console.error('Invalid payment intent metadata:', paymentIntent.metadata)
      return
    }

    // Add credits to user account
    const { error: addCreditsError } = await supabase
      .from('users')
      .update({
        credits_remaining: supabase.sql`credits_remaining + ${credits}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (addCreditsError) {
      console.error('Error adding credits:', addCreditsError)
      return
    }

    // Log the purchase
    await supabase
      .from('usage_logs')
      .insert({
        user_id: userId,
        action: 'generation',
        credits_used: 0,
        metadata: {
          action: 'credits_purchased',
          credits: credits,
          plan_name: planName,
          payment_intent_id: paymentIntent.id,
        },
      })

    // Update payment intent status
    await supabase
      .from('payment_intents')
      .update({
        status: 'succeeded',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    console.log(`Successfully added ${credits} credits to user ${userId}`)
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error)
  }
}

async function handleCheckoutSessionCompleted(session: any, supabase: any) {
  try {
    console.log('Processing checkout session completed:', session.id);
    
    // Extract user info from metadata
    const userId = session.metadata?.user_id
    const credits = parseInt(session.metadata?.credits || '0')
    const planName = session.metadata?.plan_name

    if (!userId || credits <= 0) {
      console.error('Invalid checkout session metadata:', session.metadata)
      return
    }

    // Add credits to user account
    const { error: addCreditsError } = await supabase
      .from('users')
      .update({
        credits_remaining: supabase.sql`credits_remaining + ${credits}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (addCreditsError) {
      console.error('Error adding credits:', addCreditsError)
      return
    }

    // Log the purchase
    await supabase
      .from('usage_logs')
      .insert({
        user_id: userId,
        action: 'generation',
        credits_used: 0,
        metadata: {
          action: 'credits_purchased',
          credits: credits,
          plan_name: planName,
          checkout_session_id: session.id,
        },
      })

    console.log(`Successfully added ${credits} credits to user ${userId} from checkout session ${session.id}`)
  } catch (error) {
    console.error('Error handling checkout session completed:', error)
  }
}

async function handleInvoicePaymentSucceeded(invoice: any, supabase: any) {
  console.log('Processing invoice payment succeeded:', invoice.id);
  // Handle subscription renewals here
}

async function handleSubscriptionCreated(subscription: any, supabase: any) {
  console.log('Processing subscription created:', subscription.id);
  // Handle new subscription creation here
}

async function handleSubscriptionUpdated(subscription: any, supabase: any) {
  console.log('Processing subscription updated:', subscription.id);
  // Handle subscription updates here
}

async function handleSubscriptionDeleted(subscription: any, supabase: any) {
  console.log('Processing subscription deleted:', subscription.id);
  // Handle subscription cancellation here
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});