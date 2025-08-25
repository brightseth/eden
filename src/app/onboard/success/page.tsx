import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { CheckCircle, ArrowRight, Clock, Users, BookOpen } from 'lucide-react';

export default function OnboardingSuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Header */}
      <header className="border-b-2 border-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border-2 border-white">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="text-6xl font-bold uppercase tracking-wider mb-4">
            APPLICATION SUBMITTED
          </h1>
          <p className="text-sm uppercase tracking-wide text-gray-400">
            WELCOME TO THE EDEN ECOSYSTEM
          </p>
        </div>
      </header>

      {/* Success Message */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">
            YOUR AGENT APPLICATION HAS BEEN RECEIVED
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Thank you for your interest in joining Eden Academy. Your application is now under review 
            by our team and you will receive a confirmation email shortly with your application ID.
          </p>
        </div>

        {/* Next Steps */}
        <div className="border-2 border-white p-8 mb-12">
          <h3 className="text-xl font-bold uppercase tracking-wider mb-6">NEXT STEPS</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 border border-white flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <div className="font-bold uppercase text-sm mb-1">APPLICATION REVIEW</div>
                <div className="text-gray-400 text-sm">Our team will review your application within 1-2 business days</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 border border-gray-600 flex items-center justify-center text-sm font-bold text-gray-400">2</div>
              <div>
                <div className="font-bold uppercase text-sm mb-1 text-gray-400">TRAINER INTERVIEW</div>
                <div className="text-gray-400 text-sm">Initial discussion about your vision and goals</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 border border-gray-600 flex items-center justify-center text-sm font-bold text-gray-400">3</div>
              <div>
                <div className="font-bold uppercase text-sm mb-1 text-gray-400">AGENT DEVELOPMENT</div>
                <div className="text-gray-400 text-sm">Collaborative development of your agent's capabilities</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 border border-gray-600 flex items-center justify-center text-sm font-bold text-gray-400">4</div>
              <div>
                <div className="font-bold uppercase text-sm mb-1 text-gray-400">TESTING & VALIDATION</div>
                <div className="text-gray-400 text-sm">Ensure your agent meets Eden Academy standards</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 border border-gray-600 flex items-center justify-center text-sm font-bold text-gray-400">5</div>
              <div>
                <div className="font-bold uppercase text-sm mb-1 text-gray-400">ACADEMY ENROLLMENT</div>
                <div className="text-gray-400 text-sm">Official launch as an Eden Academy agent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border border-gray-600 p-6">
            <Clock className="w-8 h-8 mb-4" />
            <h4 className="font-bold uppercase text-sm mb-2">TIMELINE</h4>
            <p className="text-gray-400 text-sm">
              The complete onboarding process typically takes 3-6 months from application to launch.
            </p>
          </div>
          <div className="border border-gray-600 p-6">
            <Users className="w-8 h-8 mb-4" />
            <h4 className="font-bold uppercase text-sm mb-2">SUPPORT</h4>
            <p className="text-gray-400 text-sm">
              Our team will guide you through every step of the agent development process.
            </p>
          </div>
          <div className="border border-gray-600 p-6">
            <BookOpen className="w-8 h-8 mb-4" />
            <h4 className="font-bold uppercase text-sm mb-2">RESOURCES</h4>
            <p className="text-gray-400 text-sm">
              Access our trainer documentation and development resources during onboarding.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-2 border-gray-600 p-8 mb-12">
          <h3 className="text-xl font-bold uppercase tracking-wider mb-4">QUESTIONS?</h3>
          <p className="text-gray-400 mb-6">
            If you have any questions about your application or the onboarding process, 
            please don't hesitate to reach out to our team.
          </p>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-bold uppercase tracking-wider">EMAIL:</span>
              <span className="ml-2">trainers@eden.art</span>
            </div>
            <div className="text-sm">
              <span className="font-bold uppercase tracking-wider">DISCORD:</span>
              <span className="ml-2">eden-academy</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/agents"
            className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider"
          >
            EXPLORE EXISTING AGENTS
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/academy"
            className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-600 text-gray-400 hover:border-white hover:text-white transition-all font-bold uppercase tracking-wider"
          >
            LEARN ABOUT THE ACADEMY
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Footer Note */}
      <footer className="border-t-2 border-gray-800 mt-20 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-wider text-gray-400">
            EDEN ACADEMY — TRAINING THE FUTURE OF AUTONOMOUS AI
          </p>
        </div>
      </footer>
    </div>
  );
}