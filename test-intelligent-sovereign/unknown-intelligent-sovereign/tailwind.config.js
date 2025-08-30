/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Intelligent color scheme from AI recommendations
      colors: {
        primary: '#000000',
        accent: '#f59e0b',
        background: '#000000',
        text: '#ffffff',
        muted: '#666666',
      },
      // Intelligent typography from AI recommendations  
      fontFamily: {
        heading: ['Helvetica Neue Bold', 'sans-serif'],
        body: ['Helvetica Neue', 'sans-serif'],
        mono: ['SF Mono', 'monospace'],
      },
      // Intelligent spacing based on output patterns
      spacing: {
        'agent': '0.5rem',
      },
      // Animation settings based on technical sophistication
      animation: {
        
        'bounce-slow': 'bounce 3s infinite',
        'pulse-fast': 'pulse 1s infinite',
      },
    },
  },
  plugins: [
    // Add plugins based on agent type
    
    
  ],
}