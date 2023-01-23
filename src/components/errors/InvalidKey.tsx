import React from 'react';
import { useToggleContext } from '../../hooks/context/toggleContext';

const InvalidKey = () => {
  const toggleContext = useToggleContext();
   return (
    <div className={`transition-all duration-200 px-2 transform origin-top ${toggleContext?.isOpen.isInvalidKeyOpen ? "scale-y-100" : "scale-y-0 h-0"} flex my-1 bg-red-600/90 w-full`}>
      <p className="text-white font-semibold">Invalid API key</p>
    </div>
   ); 
};

export default InvalidKey;
