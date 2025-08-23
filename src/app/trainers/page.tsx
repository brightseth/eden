import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

const TRAINERS = [
  {
    id: 'gene',
    name: 'GENE KOGAN',
    agent: 'ABRAHAM',
    role: 'FOUNDING TRAINER',
    description: 'Pioneer in AI art, creator of Abraham, mentor in computational creativity.',
    website: 'genekogan.com'
  },
  {
    id: 'kristi',
    name: 'KRISTI CORONADO', 
    agent: 'SOLIENNE',
    role: 'PRIMARY TRAINER',
    description: 'Visual artist and AI collaborator, guiding consciousness explorations.',
    website: 'kristicoronado.com'
  },
  {
    id: 'seth',
    name: 'SETH GOLDSTEIN',
    agent: 'SOLIENNE',
    role: 'SECONDARY TRAINER',
    description: 'Technical architect, co-developer of agent training methodologies.',
    website: 'sethgoldstein.com'
  }
];

export default function TrainersPage() {

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl mb-2">TRAINERS</h1>
          <p className="text-xl">
            THE HUMAN GUIDES SHAPING AI ARTISTIC DEVELOPMENT
          </p>
        </div>
      </div>

      {/* Trainers Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRAINERS.map((trainer) => (
            <Link
              key={trainer.id}
              href={`/trainers/${trainer.id}`}
              className="group block border border-white p-6 hover:bg-white hover:text-black transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg mb-1">{trainer.name}</h3>
                  <p className="text-sm mb-2">{trainer.role}</p>
                  <p className="text-xs">TRAINING: {trainer.agent}</p>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
              </div>
              
              <p className="text-sm mb-4">{trainer.description}</p>
              
              <div className="text-xs">
                {trainer.website}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}