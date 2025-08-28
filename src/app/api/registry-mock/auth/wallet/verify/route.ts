import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled, FLAGS } from '@/config/flags';

/**
 * Mock Registry API: Wallet Authentication Verification
 * 
 * This endpoint simulates the Registry's wallet authentication
 * Remove this when the actual Registry supports wallet auth
 */

// Mock user database (in production this would be Registry database)
const mockUsers = new Map([
  ['0x742d35Cc6436Ae59C3B2EF8Da7e5F5C7eDeED9dB', {
    id: 'user_1',
    email: 'test@eden.art',
    walletAddress: '0x742d35Cc6436Ae59C3B2EF8Da7e5F5C7eDeED9dB',
    role: 'curator',
    authMethod: 'WALLET',
    displayName: 'Test User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }],
  ['0x8ba1f109551bd432803012645hf90bab', {
    id: 'user_2', 
    email: 'curator@eden.art',
    walletAddress: '0x8ba1f109551bd432803012645hf90bab',
    role: 'admin',
    authMethod: 'HYBRID',
    displayName: 'Eden Curator',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }]
]);

export async function POST(request: NextRequest) {
  // Check if wallet auth is enabled
  if (!isFeatureEnabled(FLAGS.ENABLE_PRIVY_WALLET_AUTH)) {
    return NextResponse.json(
      { error: 'Wallet authentication is disabled' },
      { status: 403 }
    );
  }

  try {
    const { walletAddress, signature, message } = await request.json();

    // Validate input
    if (!walletAddress || !signature || !message) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required parameters: walletAddress, signature, message' 
        },
        { status: 400 }
      );
    }

    console.log('[Mock Registry] Wallet auth request:', {
      walletAddress,
      hasSignature: !!signature,
      messageLength: message.length
    });

    // Simulate signature verification (in production, this would be done properly)
    const isValidFormat = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
    const hasValidSignature = signature.length > 10; // Basic check

    if (!isValidFormat) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid wallet address format' 
        },
        { status: 400 }
      );
    }

    if (!hasValidSignature) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid signature format' 
        },
        { status: 400 }
      );
    }

    // Check if wallet exists in mock database
    const mockUser = mockUsers.get(walletAddress);
    
    if (!mockUser) {
      // Wallet not found - requires onboarding
      return NextResponse.json({
        success: false,
        requiresOnboarding: true,
        error: 'Wallet not linked to any account'
      }, { status: 200 });
    }

    // Generate mock JWT token
    const token = `mock_jwt_${mockUser.id}_${Date.now()}`;

    // Successful authentication
    return NextResponse.json({
      success: true,
      token,
      user: mockUser
    });

  } catch (error) {
    console.error('[Mock Registry] Wallet auth error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Mock Registry - Wallet Auth',
    walletAuthEnabled: isFeatureEnabled(FLAGS.ENABLE_PRIVY_WALLET_AUTH),
    mockUsers: mockUsers.size
  });
}