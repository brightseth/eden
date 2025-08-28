import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled, FLAGS } from '@/config/flags';

/**
 * Mock Registry API: Create Wallet Account
 * 
 * This endpoint simulates the Registry's wallet account creation
 * Remove this when the actual Registry supports wallet auth
 */

export async function POST(request: NextRequest) {
  // Check if wallet auth is enabled
  if (!isFeatureEnabled(FLAGS.ENABLE_PRIVY_WALLET_AUTH)) {
    return NextResponse.json(
      { error: 'Wallet authentication is disabled' },
      { status: 403 }
    );
  }

  try {
    const { walletAddress, signature, displayName, email } = await request.json();

    // Validate input
    if (!walletAddress || !signature || !displayName) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required parameters: walletAddress, signature, displayName' 
        },
        { status: 400 }
      );
    }

    console.log('[Mock Registry] Create wallet account:', {
      walletAddress,
      displayName,
      email: email || 'none',
      hasSignature: !!signature
    });

    // Simulate validation
    const isValidFormat = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
    if (!isValidFormat) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid wallet address format' 
        },
        { status: 400 }
      );
    }

    if (displayName.length < 1 || displayName.length > 100) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Display name must be between 1 and 100 characters' 
        },
        { status: 400 }
      );
    }

    // Create mock user
    const newUser = {
      id: `user_${Date.now()}`,
      email: email || undefined,
      walletAddress,
      role: 'guest',
      authMethod: 'WALLET',
      displayName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Generate mock JWT token
    const token = `mock_jwt_${newUser.id}_${Date.now()}`;

    // Successful account creation
    return NextResponse.json({
      success: true,
      token,
      user: newUser
    });

  } catch (error) {
    console.error('[Mock Registry] Create wallet account error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}