import React from 'react';
import { Beaker, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  onBack?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onBack }) => {
  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {onBack && (
              <button 
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-1 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <div className="flex items-center gap-3 ml-4">
              <Beaker className="w-6 h-6 text-cyan-400" />
              <span className="font-semibold text-xl">ChemFlow</span>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            by LOL Groups
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;