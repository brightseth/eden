import { NextRequest, NextResponse } from 'next/server';
import { startWalletAuth } from '@/lib/registry/auth';
import { isFeatureEnabled, FLAGS } from '@/config/flags';
import { z } from 'zod';

// Validation schema
const walletConnectSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  signature: z.string().min(1, 'Signature is required'),
  message: z.string().min(1, 'Message is required'),
});

export async function POST(request: NextRequest) {
  // Check if wallet auth is enabled
  if (!isFeatureEnabled(FLAGS.ENABLE_PRIVY_WALLET_AUTH)) {
    return NextResponse.json(
      { error: 'Wallet authentication is not enabled' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { walletAddress, signature, message } = walletConnectSchema.parse(body);

    // Authenticate wallet with Registry
    const result = await startWalletAuth(walletAddress, signature, message);

    if (result.success) {
      // Set secure cookie with auth token
      const response = NextResponse.json({
        success: true,
        user: result.user,
        message: 'Wallet authentication successful'
      });

      response.cookies.set('eden-auth-token', result.token!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/'
      });

      return response;
    } else if (result.requiresOnboarding) {
      return NextResponse.json({
        success: false,
        requiresOnboarding: true,
        walletAddress,
        message: 'Wallet requires account creation or linking'
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Wallet authentication failed'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('[API] Wallet connect error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    walletAuthEnabled: isFeatureEnabled(FLAGS.ENABLE_PRIVY_WALLET_AUTH),
    timestamp: new Date().toISOString()
  });
}