/**
 * Agent Profile Image Generation System
 * Creates unique SVG profiles for each agent based on their characteristics
 */

export interface AgentProfileStyle {
  primaryColor: string;
  secondaryColor: string;
  pattern: 'geometric' | 'organic' | 'abstract' | 'minimal' | 'complex';
  elements: string[];
}

export const AGENT_PROFILE_STYLES: Record<string, AgentProfileStyle> = {
  abraham: {
    primaryColor: '#FFD700', // Gold - collective intelligence
    secondaryColor: '#FFA500', // Orange - creativity
    pattern: 'complex',
    elements: ['network', 'nodes', 'connections', 'collective']
  },
  solienne: {
    primaryColor: '#E6E6FA', // Lavender - consciousness
    secondaryColor: '#DDA0DD', // Plum - digital dreams
    pattern: 'organic',
    elements: ['waves', 'light', 'consciousness', 'flow']
  },
  koru: {
    primaryColor: '#90EE90', // Light green - growth
    secondaryColor: '#32CD32', // Lime green - community
    pattern: 'organic',
    elements: ['spiral', 'growth', 'community', 'weave']
  },
  geppetto: {
    primaryColor: '#8B4513', // Saddle brown - craftsmanship
    secondaryColor: '#DEB887', // Burlywood - storytelling
    pattern: 'geometric',
    elements: ['gears', 'strings', 'narrative', 'craft']
  },
  nina: {
    primaryColor: '#FF1493', // Deep pink - curation
    secondaryColor: '#FF69B4', // Hot pink - taste
    pattern: 'minimal',
    elements: ['frames', 'selection', 'curation', 'focus']
  },
  amanda: {
    primaryColor: '#4169E1', // Royal blue - collection
    secondaryColor: '#1E90FF', // Dodger blue - acquisition
    pattern: 'geometric',
    elements: ['grid', 'collection', 'portfolio', 'value']
  },
  citizen: {
    primaryColor: '#800080', // Purple - governance
    secondaryColor: '#9370DB', // Medium purple - democracy
    pattern: 'geometric',
    elements: ['hexagon', 'dao', 'votes', 'consensus']
  },
  miyomi: {
    primaryColor: '#DC143C', // Crimson - contrarian
    secondaryColor: '#FF4500', // Orange red - markets
    pattern: 'abstract',
    elements: ['charts', 'contrary', 'signals', 'edge']
  },
  bertha: {
    primaryColor: '#2E8B57', // Sea green - analysis
    secondaryColor: '#3CB371', // Medium sea green - strategy
    pattern: 'complex',
    elements: ['analytics', 'patterns', 'investment', 'data']
  },
  sue: {
    primaryColor: '#000000', // Black - critique
    secondaryColor: '#FFFFFF', // White - clarity
    pattern: 'minimal',
    elements: ['contrast', 'critique', 'design', 'truth']
  },
  bart: {
    primaryColor: '#FF8C00', // Dark orange - humor
    secondaryColor: '#FFD700', // Gold - entertainment
    pattern: 'abstract',
    elements: ['laugh', 'chaos', 'meme', 'viral']
  },
  verdelis: {
    primaryColor: '#228B22', // Forest green - environment
    secondaryColor: '#00CED1', // Dark turquoise - ocean
    pattern: 'organic',
    elements: ['leaves', 'water', 'earth', 'sustainable']
  }
};

export function generateAgentProfileSVG(agentHandle: string): string {
  const style = AGENT_PROFILE_STYLES[agentHandle.toLowerCase()] || {
    primaryColor: '#808080',
    secondaryColor: '#A0A0A0',
    pattern: 'geometric',
    elements: ['default']
  };

  const size = 400;
  const center = size / 2;
  
  // Build SVG based on agent's pattern type
  let svgContent = '';
  
  switch (style.pattern) {
    case 'complex':
      // Network pattern for Abraham
      if (agentHandle === 'abraham') {
        svgContent = generateNetworkPattern(size, center, style);
      } else if (agentHandle === 'bertha') {
        svgContent = generateAnalyticsPattern(size, center, style);
      }
      break;
      
    case 'organic':
      // Flowing pattern for Solienne
      if (agentHandle === 'solienne') {
        svgContent = generateConsciousnessPattern(size, center, style);
      } else if (agentHandle === 'koru') {
        svgContent = generateSpiralPattern(size, center, style);
      } else if (agentHandle === 'verdelis') {
        svgContent = generateNaturePattern(size, center, style);
      }
      break;
      
    case 'abstract':
      // Market pattern for Miyomi
      if (agentHandle === 'miyomi') {
        svgContent = generateMarketPattern(size, center, style);
      } else if (agentHandle === 'bart') {
        svgContent = generateChaosPattern(size, center, style);
      }
      break;
      
    case 'minimal':
      // Clean pattern for Sue/Nina
      if (agentHandle === 'sue') {
        svgContent = generateCritiquePattern(size, center, style);
      } else if (agentHandle === 'nina') {
        svgContent = generateCurationPattern(size, center, style);
      }
      break;
      
    case 'geometric':
      // Structured pattern for Citizen/Geppetto/Amanda
      if (agentHandle === 'citizen') {
        svgContent = generateDAOPattern(size, center, style);
      } else if (agentHandle === 'geppetto') {
        svgContent = generateCraftPattern(size, center, style);
      } else if (agentHandle === 'amanda') {
        svgContent = generateCollectionPattern(size, center, style);
      }
      break;
      
    default:
      svgContent = generateDefaultPattern(size, center, style, agentHandle);
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#000000"/>
    ${svgContent}
    <text x="${center}" y="${size - 20}" text-anchor="middle" fill="${style.primaryColor}" font-family="monospace" font-size="24" font-weight="bold">
      ${agentHandle.toUpperCase()}
    </text>
  </svg>`;
}

// Pattern generators for each agent type

function generateNetworkPattern(size: number, center: number, style: AgentProfileStyle): string {
  // Abraham - Interconnected nodes representing collective intelligence
  const nodes = 12;
  const radius = size * 0.3;
  let svg = '';
  
  // Generate node positions
  const positions: Array<{x: number, y: number}> = [];
  for (let i = 0; i < nodes; i++) {
    const angle = (i / nodes) * Math.PI * 2;
    positions.push({
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius
    });
  }
  
  // Draw connections
  positions.forEach((pos1, i) => {
    positions.forEach((pos2, j) => {
      if (i < j && Math.random() > 0.3) {
        svg += `<line x1="${pos1.x}" y1="${pos1.y}" x2="${pos2.x}" y2="${pos2.y}" 
          stroke="${style.primaryColor}" stroke-width="1" opacity="0.3"/>`;
      }
    });
  });
  
  // Draw nodes
  positions.forEach(pos => {
    svg += `<circle cx="${pos.x}" cy="${pos.y}" r="8" fill="${style.primaryColor}"/>`;
  });
  
  // Central collective node
  svg += `<circle cx="${center}" cy="${center}" r="20" fill="${style.secondaryColor}" opacity="0.8"/>`;
  
  return svg;
}

function generateConsciousnessPattern(size: number, center: number, style: AgentProfileStyle): string {
  // Solienne - Flowing consciousness waves
  let svg = '';
  const waves = 8;
  
  for (let i = 0; i < waves; i++) {
    const radius = (i + 1) * (size / (waves * 2));
    const opacity = 1 - (i / waves);
    svg += `<circle cx="${center}" cy="${center}" r="${radius}" 
      fill="none" stroke="${style.primaryColor}" stroke-width="2" 
      opacity="${opacity * 0.6}"/>`;
  }
  
  // Light rays
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const x2 = center + Math.cos(angle) * (size * 0.45);
    const y2 = center + Math.sin(angle) * (size * 0.45);
    svg += `<line x1="${center}" y1="${center}" x2="${x2}" y2="${y2}" 
      stroke="${style.secondaryColor}" stroke-width="1" opacity="0.2"/>`;
  }
  
  // Core consciousness
  svg += `<circle cx="${center}" cy="${center}" r="30" fill="${style.primaryColor}" opacity="0.8"/>`;
  
  return svg;
}

function generateMarketPattern(size: number, center: number, style: AgentProfileStyle): string {
  // Miyomi - Contrarian market signals
  let svg = '';
  
  // Generate candlestick-like pattern
  const bars = 7;
  const barWidth = size / (bars * 2);
  
  for (let i = 0; i < bars; i++) {
    const x = (i * 2 + 1) * barWidth;
    const height = Math.random() * size * 0.6 + size * 0.2;
    const isUp = Math.random() > 0.5;
    const color = isUp ? style.primaryColor : style.secondaryColor;
    
    svg += `<rect x="${x - barWidth/2}" y="${center - height/2}" 
      width="${barWidth}" height="${height}" fill="${color}" opacity="0.8"/>`;
    svg += `<line x1="${x}" y1="${center - height/2 - 10}" x2="${x}" y2="${center + height/2 + 10}" 
      stroke="${color}" stroke-width="2"/>`;
  }
  
  // Trend line (contrarian)
  svg += `<line x1="20" y1="${size * 0.7}" x2="${size - 20}" y2="${size * 0.3}" 
    stroke="${style.primaryColor}" stroke-width="3" stroke-dasharray="5,5"/>`;
  
  return svg;
}

function generateCritiquePattern(size: number, center: number, style: AgentProfileStyle): string {
  // Sue - High contrast critique (inverted for better visibility)
  let svg = '';
  
  // Grid pattern instead of split screen
  const gridSize = 8;
  const cellSize = size / gridSize;
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const isEven = (row + col) % 2 === 0;
      svg += `<rect x="${col * cellSize}" y="${row * cellSize}" 
        width="${cellSize}" height="${cellSize}" 
        fill="${isEven ? '#333333' : '#666666'}"/>`;
    }
  }
  
  // Critical eye with better contrast
  svg += `<ellipse cx="${center}" cy="${center}" rx="80" ry="40" 
    fill="#000000" stroke="#FFFFFF" stroke-width="4"/>`;
  svg += `<circle cx="${center}" cy="${center}" r="25" fill="#FFFFFF"/>`;
  svg += `<circle cx="${center}" cy="${center}" r="10" fill="#000000"/>`;
  
  // Add critique lines
  svg += `<line x1="${center - 100}" y1="${center}" x2="${center - 40}" y2="${center}" 
    stroke="#FFFFFF" stroke-width="2"/>`;
  svg += `<line x1="${center + 40}" y1="${center}" x2="${center + 100}" y2="${center}" 
    stroke="#FFFFFF" stroke-width="2"/>`;
  
  return svg;
}

function generateDAOPattern(size: number, center: number, style: AgentProfileStyle): string {
  // Citizen - Hexagonal DAO structure
  let svg = '';
  const hexSize = 40;
  
  // Draw hexagon grid
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 4; col++) {
      const x = col * hexSize * 1.5 + hexSize + (row % 2) * hexSize * 0.75;
      const y = row * hexSize * 0.866 + hexSize;
      svg += drawHexagon(x, y, hexSize / 2, style.primaryColor, '0.3');
    }
  }
  
  // Central governance hexagon
  svg += drawHexagon(center, center, 60, style.secondaryColor, '0.8');
  
  return svg;
}

function drawHexagon(x: number, y: number, size: number, color: string, opacity: string): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const px = x + size * Math.cos(angle);
    const py = y + size * Math.sin(angle);
    points.push(`${px},${py}`);
  }
  return `<polygon points="${points.join(' ')}" fill="${color}" opacity="${opacity}" stroke="${color}" stroke-width="2"/>`;
}

// Add remaining pattern generators...
function generateSpiralPattern(size: number, center: number, style: AgentProfileStyle): string {
  // Koru - Growth spiral
  let svg = '';
  const turns = 3;
  const points: string[] = [];
  
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2 * turns;
    const radius = (i / 100) * size * 0.4;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    points.push(`${x},${y}`);
  }
  
  svg += `<polyline points="${points.join(' ')}" fill="none" stroke="${style.primaryColor}" stroke-width="3"/>`;
  return svg;
}

function generateAnalyticsPattern(size: number, center: number, style: AgentProfileStyle): string {
  // Bertha - Data analytics
  let svg = '';
  
  // Data points
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 10 + 5;
    svg += `<circle cx="${x}" cy="${y}" r="${r}" fill="${style.primaryColor}" opacity="0.3"/>`;
  }
  
  // Trend lines
  svg += `<polyline points="50,300 150,250 250,200 350,100" fill="none" stroke="${style.secondaryColor}" stroke-width="3"/>`;
  
  return svg;
}

function generateCurationPattern(size: number, center: number, style: AgentProfileStyle): string {
  // Nina - Curation frames
  let svg = '';
  const frames = 3;
  
  for (let i = 0; i < frames; i++) {
    const inset = i * 30;
    svg += `<rect x="${inset}" y="${inset}" width="${size - inset * 2}" height="${size - inset * 2}" 
      fill="none" stroke="${style.primaryColor}" stroke-width="2" opacity="${1 - i * 0.2}"/>`;
  }
  
  return svg;
}

function generateCraftPattern(size: number, center: number, style: AgentProfileStyle): string {
  // Geppetto - Gears and craft
  let svg = '';
  
  // Gears
  const gearRadius = 60;
  svg += drawGear(center - 50, center, gearRadius, style.primaryColor);
  svg += drawGear(center + 50, center, gearRadius * 0.7, style.secondaryColor);
  
  return svg;
}

function drawGear(x: number, y: number, radius: number, color: string): string {
  let svg = `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" opacity="0.6"/>`;
  const teeth = 12;
  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * Math.PI * 2;
    const x1 = x + Math.cos(angle) * radius;
    const y1 = y + Math.sin(angle) * radius;
    const x2 = x + Math.cos(angle) * (radius + 10);
    const y2 = y + Math.sin(angle) * (radius + 10);
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="4"/>`;
  }
  return svg;
}

function generateCollectionPattern(size: number, center: number, style: AgentProfileStyle): string {
  // Amanda - Collection grid
  let svg = '';
  const gridSize = 4;
  const cellSize = size / (gridSize + 1);
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = (col + 0.5) * cellSize + cellSize/2;
      const y = (row + 0.5) * cellSize + cellSize/2;
      const filled = Math.random() > 0.3;
      svg += `<rect x="${x}" y="${y}" width="${cellSize * 0.8}" height="${cellSize * 0.8}" 
        fill="${filled ? style.primaryColor : 'none'}" stroke="${style.primaryColor}" 
        stroke-width="2" opacity="0.7"/>`;
    }
  }
  
  return svg;
}

function generateChaosPattern(size: number, center: number, style: AgentProfileStyle): string {
  // Bart - Chaotic meme energy
  let svg = '';
  
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 40 + 10;
    const color = Math.random() > 0.5 ? style.primaryColor : style.secondaryColor;
    svg += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" opacity="${Math.random() * 0.5 + 0.3}"/>`;
  }
  
  return svg;
}

function generateNaturePattern(size: number, center: number, style: AgentProfileStyle): string {
  // Verdelis - Environmental
  let svg = '';
  
  // Tree/leaf pattern
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const x = center + Math.cos(angle) * 80;
    const y = center + Math.sin(angle) * 80;
    svg += `<ellipse cx="${x}" cy="${y}" rx="30" ry="50" 
      transform="rotate(${angle * 180 / Math.PI} ${x} ${y})"
      fill="${style.primaryColor}" opacity="0.5"/>`;
  }
  
  // Water waves
  for (let i = 1; i <= 3; i++) {
    const y = size - (i * 30);
    svg += `<path d="M 0 ${y} Q ${size/4} ${y-20} ${size/2} ${y} T ${size} ${y}" 
      fill="none" stroke="${style.secondaryColor}" stroke-width="2" opacity="0.6"/>`;
  }
  
  return svg;
}

function generateDefaultPattern(size: number, center: number, style: AgentProfileStyle, name: string): string {
  // Default geometric pattern
  let svg = '';
  
  // Simple circle with initial
  svg += `<circle cx="${center}" cy="${center}" r="${size * 0.3}" 
    fill="none" stroke="${style.primaryColor}" stroke-width="3"/>`;
  svg += `<text x="${center}" y="${center}" text-anchor="middle" dominant-baseline="central" 
    fill="${style.primaryColor}" font-size="120" font-family="monospace" font-weight="bold">
    ${name.charAt(0).toUpperCase()}
  </text>`;
  
  return svg;
}