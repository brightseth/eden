import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled, FLAGS } from '@/config/flags';

/**
 * Mock Registry API: Link Wallet to User
 * 
 * This endpoint simulates the Registry's wallet linking
 * Remove this when the actual Registry supports wallet auth
 */

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  // Check if wallet auth is enabled
  if (!isFeatureEnabled(FLAGS.ENABLE_PRIVY_WALLET_AUTH)) {
    return NextResponse.json(
      { error: 'Wallet authentication is disabled' },
      { status: 403 }
    );
  }

  try {
    const userId = params.userId;
    const { walletAddress, signature } = await request.json();

    // Validate input
    if (!walletAddress || !signature) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Missing required parameters: walletAddress, signature' 
        },
        { status: 400 }
      );
    }

    console.log('[Mock Registry] Link wallet to user:', {
      userId,
      walletAddress,
      hasSignature: !!signature
    });

    // Simulate validation
    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
    if (!isValidAddress) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid wallet address format' 
        },
        { status: 400 }
      );
    }

    // Simulate user lookup - accept any reasonable user ID
    if (!userId || userId.length < 3) {
      return NextResponse.json(
        { 
          success: false,
          message: 'User not found' 
        },
        { status: 404 }
      );
    }

    // Simulate successful linking
    return NextResponse.json({
      success: true,
      message: `Wallet ${walletAddress} successfully linked to user ${userId}`
    });

  } catch (error) {
    console.error('[Mock Registry] Link wallet error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}