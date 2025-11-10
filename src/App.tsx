import React, { useState } from 'react';
import MergedFlyout from './components/MergedFlyout';
import backgroundImage from './assets/image.png';

function App() {
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);

  return (
    <div 
      className="min-h-screen bg-gray-100 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="flex items-center justify-center min-h-screen relative z-10">
        <button
          onClick={() => setIsFlyoutOpen(true)}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-xl text-lg font-semibold backdrop-blur-sm bg-opacity-90"
        >
          Open Risk Assessment Flyout
        </button>
      </div>

      <MergedFlyout 
        isOpen={isFlyoutOpen} 
        onClose={() => setIsFlyoutOpen(false)} 
      />
    </div>
  );
}

export default App;