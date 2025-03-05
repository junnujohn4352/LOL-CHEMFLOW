import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProcessCanvas from './components/ProcessCanvas/ProcessCanvas';
import BackgroundAnimation from './components/BackgroundAnimation';
import HomePage from './components/HomePage';
import ChemicalSelectionPage from './components/ChemicalSelection/ChemicalSelectionPage';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';

type WorkflowStep = 'landing' | 'home' | 'chemical-selection' | 'simulation' | 'about';

function App() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('landing');
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    if (currentStep === 'landing') {
      const timer = setTimeout(() => {
        setCurrentStep('home');
        setShowLanding(false);
      }, 3500); // Increased animation duration to ensure logo is visible
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 'landing':
        return <LandingPage />;
      case 'home':
        return <HomePage onStart={() => setCurrentStep('chemical-selection')} onAbout={() => setCurrentStep('about')} />;
      case 'about':
        return <AboutPage onBack={() => setCurrentStep('home')} />;
      case 'chemical-selection':
        return <ChemicalSelectionPage onNext={() => setCurrentStep('simulation')} onBack={() => setCurrentStep('home')} />;
      case 'simulation':
        return (
          <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
            <BackgroundAnimation />
            <div className="relative z-10">
              <Navbar onBack={() => setCurrentStep('chemical-selection')} />
              <ProcessCanvas />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return renderStep();
}

export default App;