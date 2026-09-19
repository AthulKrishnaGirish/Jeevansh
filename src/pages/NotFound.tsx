import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 mb-6 red-glow">
        <Droplets className="w-10 h-10" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-xl font-bold text-zinc-300 mb-4">
        Page Not Found
      </h2>
      <p className="text-sm text-zinc-400 max-w-md mb-8">
        The page you are looking for does not exist or has been moved. Return to the Jeevansh donor network.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/40 flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        Return to Home
      </Link>
    </div>
  );
};
