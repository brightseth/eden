import { NextRequest, NextResponse } from 'next/server';
import { createWalletAccount } from '@/lib/registry/auth';
import { isFeatureEnabled, FLAGS } from '@/config/flags';
import { z } from 'zod';

// Validation schema
const createAccountSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  signature: z.string().min(1, 'Signature is required'),
  displayName: z.string().min(1, 'Display name is required').max(100, 'Display name too long'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
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
    const { walletAddress, signature, displayName, email } = createAccountSchema.parse(body);

    // Create wallet account with Registry
    const result = await createWalletAccount(walletAddress, signature, {
      displayName,
      email: email || undefined
    });

    if (result.success) {
      // Set secure cookie with auth token
      const response = NextResponse.json({
        success: true,
        user: result.user,
        message: 'Wallet account created successfully'
      });

      response.cookies.set('eden-auth-token', result.token!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/'
      });

      return response;
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to create wallet account'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('[API] Wallet create account error:', error);
    
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