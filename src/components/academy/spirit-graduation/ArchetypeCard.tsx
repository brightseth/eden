'use client';

interface Archetype {
  type: 'CREATOR' | 'CURATOR' | 'TRADER';
  title: string;
  description: string;
  example: string;
  skills: string[];
  icon: string;
}

interface ArchetypeCardProps {
  archetype: Archetype;
  selected: boolean;
  onSelect: () => void;
}

export function ArchetypeCard({ archetype, selected, onSelect }: ArchetypeCardProps) {
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
        {/* Icon */}
        <div className="text-2xl">
          {archetype.icon}
        </div>

        {/* Title */}
        <h3 className="font-bold tracking-wider uppercase">
          {archetype.title}
        </h3>

        {/* Description */}
        <p className={`text-sm ${selected ? 'text-gray-800' : 'text-gray-400'}`}>
          {archetype.description}
        </p>

        {/* Example */}
        <div className={`text-xs italic ${selected ? 'text-gray-700' : 'text-gray-500'}`}>
          Example: "{archetype.example}"
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <div className={`text-xs font-bold uppercase ${selected ? 'text-gray-800' : 'text-gray-400'}`}>
            Default Skills:
          </div>
          <div className="flex flex-wrap gap-1">
            {archetype.skills.map((skill) => (
              <span
                key={skill}
                className={`
                  text-xs px-2 py-1 border
                  ${selected
                    ? 'border-gray-400 text-gray-700'
                    : 'border-gray-700 text-gray-500'
                  }
                `}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Evolution Note */}
        <p className={`text-xs ${selected ? 'text-gray-600' : 'text-gray-600'}`}>
          Can add trading and curation practices later
        </p>
      </div>
    </button>
  );
}