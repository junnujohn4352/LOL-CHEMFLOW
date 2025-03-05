import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Beaker, FlaskRound as Flask, Atom, Gauge, Microscope, Droplets } from 'lucide-react';
import BackgroundAnimation from './BackgroundAnimation';
import BackButton from './BackButton';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <BackgroundAnimation />
      <BackButton onClick={onBack} />
      
      <div className="relative z-10 container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              About ChemFlow
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              An advanced chemical process simulation platform developed by LOL Groups
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              ChemFlow was created to revolutionize the way chemical engineers design, analyze, and optimize 
              chemical processes. Our platform combines intuitive design tools with powerful simulation capabilities 
              to provide a comprehensive solution for process engineering challenges.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-700/30 p-6 rounded-lg">
                <Beaker className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Intuitive Design</h3>
                <p className="text-gray-400">
                  Drag-and-drop interface for creating complex chemical processes with ease
                </p>
              </div>
              
              <div className="bg-gray-700/30 p-6 rounded-lg">
                <Gauge className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Real-time Analysis</h3>
                <p className="text-gray-400">
                  Instant feedback on process performance with detailed calculations
                </p>
              </div>
              
              <div className="bg-gray-700/30 p-6 rounded-lg">
                <Atom className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Advanced Thermodynamics</h3>
                <p className="text-gray-400">
                  Multiple thermodynamic models for accurate property prediction
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-cyan-400">The Team</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">P JANARDHAN REDDY</h3>
              <p className="text-gray-400 mb-2">Lead Developer & Chemical Engineer</p>
              <p className="text-gray-300">
                With expertise in both chemical engineering and software development, Janardhan created ChemFlow 
                to bridge the gap between theoretical process design and practical implementation. His vision 
                was to create a tool that would make advanced process simulation accessible to engineers at all levels.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gray-700/30 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">LOL Groups</h3>
                <p className="text-gray-400">
                  A pioneering technology company focused on creating innovative solutions for the chemical 
                  engineering industry. Founded in 2023, LOL Groups has quickly established itself as a leader 
                  in process simulation software.
                </p>
              </div>
              
              <div className="bg-gray-700/30 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Our Vision</h3>
                <p className="text-gray-400">
                  We believe that powerful engineering tools should be accessible, intuitive, and enjoyable to use. 
                  Our goal is to continue expanding ChemFlow's capabilities while maintaining its user-friendly interface.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Technical Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <Flask className="w-5 h-5 text-cyan-400" />
                    Interactive process flow diagrams
                  </li>
                  <li className="flex items-center gap-2">
                    <Microscope className="w-5 h-5 text-cyan-400" />
                    Comprehensive chemical database
                  </li>
                  <li className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-cyan-400" />
                    Multiple thermodynamic models
                  </li>
                  <li className="flex items-center gap-2">
                    <Atom className="w-5 h-5 text-cyan-400" />
                    Mass and energy balance calculations
                  </li>
                  <li className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-cyan-400" />
                    Equipment sizing and rating
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Technology Stack</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>React for the user interface</li>
                  <li>ReactFlow for interactive diagrams</li>
                  <li>Chart.js for data visualization</li>
                  <li>Framer Motion for animations</li>
                  <li>Tailwind CSS for styling</li>
                  <li>MathJS for engineering calculations</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                © 2025 LOL Groups. All rights reserved.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;