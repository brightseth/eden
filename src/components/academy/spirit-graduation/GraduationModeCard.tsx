'use client';

type GraduationMode = 'ID_ONLY' | 'ID_PLUS_TOKEN' | 'FULL_STACK';

interface GraduationOption {
  mode: GraduationMode;
  title: string;
  description: string;
  features: string[];
  complexity: 'Simple' | 'Advanced' | 'Expert';
}

interface GraduationModeCardProps {
  mode: GraduationOption;
  selected: boolean;
  onSelect: () => void;
}

const COMPLEXITY_COLORS = {
  Simple: 'text-green-400',
  Advanced: 'text-yellow-400',
  Expert: 'text-red-400'
};

export function GraduationModeCard({ mode, selected, onSelect }: GraduationModeCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        p-6 border text-left transition-all duration-150 h-full
        ${selected
          ? 'border-white bg-white text-black'
          : 'border-gray-800 text-white hover:bg-white hover:text-black'
        }
      `}
    >
      <div className="space-y-4">
        {/* Complexity Badge */}
        <div className="flex justify-between items-start">
          <span className={`text-xs font-bold uppercase ${
            selected ? 'text-gray-600' : COMPLEXITY_COLORS[mode.complexity]
          }`}>
            {mode.complexity}
          </span>
          {mode.mode === 'ID_ONLY' && (
            <span className={`text-xs px-2 py-1 border ${
              selected ? 'border-gray-400 text-gray-700' : 'border-green-600 text-green-400'
            }`}>
              RECOMMENDED
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold tracking-wider uppercase">
          {mode.title}
        </h3>

        {/* Description */}
        <p className={`text-sm ${selected ? 'text-gray-800' : 'text-gray-400'}`}>
          {mode.description}
        </p>

        {/* Features */}
        <div className="space-y-2">
          <div className={`text-xs font-bold uppercase ${selected ? 'text-gray-800' : 'text-gray-400'}`}>
            Includes:
          </div>
          <ul className={`space-y-1 text-xs ${selected ? 'text-gray-700' : 'text-gray-500'}`}>
            {mode.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upgrade Note */}
        {mode.mode === 'ID_ONLY' && (
          <p className={`text-xs italic ${selected ? 'text-gray-600' : 'text-gray-600'}`}>
            Can upgrade to token + integrations later
          </p>
        )}
      </div>
    </button>
  );
}