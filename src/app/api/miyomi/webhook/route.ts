/**
 * MIYOMI Coinbase Commerce Webhook Handler
 * Processes payment confirmations and activates subscriptions
 */
import { NextRequest, NextResponse } from 'next/server';
import { coinbaseCommerce } from '@/lib/coinbase-commerce';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-cc-webhook-signature');
    const webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      console.error('Missing webhook signature or secret');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate webhook signature
    const isValid = coinbaseCommerce.validateWebhook(body, signature, webhookSecret);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log(`Processing Coinbase webhook: ${event.type}`);

    // Handle payment events
    if (event.type === 'charge:confirmed' || event.type === 'charge:resolved') {
      await handleSuccessfulPayment(event.data);
    } else if (event.type === 'charge:failed') {
      await handleFailedPayment(event.data);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(charge: any) {
  try {
    console.log(`Payment confirmed for charge: ${charge.id}`);
    
    const metadata = charge.metadata;
    const userEmail = metadata.user_email;
    const tierCode = metadata.tier_id;

    if (!userEmail || !tierCode) {
      console.error('Missing user email or tier in charge metadata');
      return;
    }

    // TODO: Update user subscription in database
    // This would typically:
    // 1. Create or update user record
    // 2. Set subscription tier and expiry date
    // 3. Generate access token for premium features
    // 4. Send confirmation email

    console.log(`Activated ${tierCode} subscription for ${userEmail}`);

    // For now, log the activation
    const activationRecord = {
      user_email: userEmail,
      tier: tierCode,
      charge_id: charge.id,
      activated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      payment_amount: charge.pricing.local.amount,
      currency: charge.pricing.local.currency
    };

    console.log('Subscription activated:', activationRecord);

  } catch (error) {
    console.error('Error processing successful payment:', error);
  }
}

async function handleFailedPayment(charge: any) {
  try {
    console.log(`Payment failed for charge: ${charge.id}`);
    
    // TODO: Handle failed payments
    // - Send notification to user
    // - Log failure reason
    // - Potentially retry or offer alternative payment

  } catch (error) {
    console.error('Error processing failed payment:', error);
  }
}