import { NextRequest, NextResponse } from 'next/server';
import { linkWalletToUser } from '@/lib/registry/auth';
import { isFeatureEnabled, FLAGS } from '@/config/flags';
import { z } from 'zod';

// Validation schema
const linkWalletSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  signature: z.string().min(1, 'Signature is required'),
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
    const { userId, walletAddress, signature } = linkWalletSchema.parse(body);

    // Link wallet to user account with Registry
    const result = await linkWalletToUser(userId, walletAddress, signature);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.message
      }, { status: 400 });
    }
  } catch (error) {
    console.error('[API] Wallet link error:', error);
    
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