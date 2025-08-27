// Training Status Widget Component - Placeholder
// Implements ADR-025: Agent Profile Widget System

import { BaseWidgetProps } from '@/lib/profile/types';

export function TrainingStatusWidget({ widget, agent, className }: BaseWidgetProps) {
  return (
    <section className={`py-16 px-6 border-b border-white ${className || ''}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">TRAINING PROGRESS</h2>
        <p className="text-lg">Training status widget - Coming soon</p>
      </div>
    </section>
  );
}