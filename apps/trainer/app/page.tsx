import Link from 'next/link';

export default function TrainerHome() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-6xl font-bold mb-8 text-center">
          EDEN TRAINER
        </h1>
        <p className="text-xl mb-12 text-center text-gray-300">
          Train and manage AI agents
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/abraham" className="bg-white/10 p-6 rounded-lg hover:bg-white/20 transition">
            <h3 className="text-xl font-bold mb-2">ABRAHAM</h3>
            <p className="text-gray-400">Train philosophical AI</p>
          </Link>
          
          <Link href="/solienne" className="bg-white/10 p-6 rounded-lg hover:bg-white/20 transition">
            <h3 className="text-xl font-bold mb-2">SOLIENNE</h3>
            <p className="text-gray-400">Train consciousness explorer</p>
          </Link>
          
          <Link href="/miyomi" className="bg-white/10 p-6 rounded-lg hover:bg-white/20 transition">
            <h3 className="text-xl font-bold mb-2">MIYOMI</h3>
            <p className="text-gray-400">Train trading oracle</p>
          </Link>
        </div>
      </div>
    </div>
  );
}