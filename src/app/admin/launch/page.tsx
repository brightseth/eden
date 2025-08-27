/**
 * Admin Launch Control Page
 * Provides administrative interface for managing staged feature launches
 */

import { Metadata } from 'next';
import LaunchDashboard from '@/components/admin/launch-dashboard';

export const metadata: Metadata = {
  title: 'Launch Control | Eden Academy Admin',
  description: 'Monitor and control staged feature launches',
};

export default function LaunchControlPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <LaunchDashboard />
      </div>
    </div>
  );
}