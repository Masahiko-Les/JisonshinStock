import React, { createContext, useContext, useState } from 'react';

type WaterDropContextType = {
  shouldPlay: boolean;
  triggerWaterDrop: () => void;
  resetWaterDrop: () => void;
};

const WaterDropContext = createContext<WaterDropContextType>({
  shouldPlay: false,
  triggerWaterDrop: () => {},
  resetWaterDrop: () => {},
});

export const WaterDropProvider = ({ children }: { children: React.ReactNode }) => {
  const [shouldPlay, setShouldPlay] = useState(false);

  const triggerWaterDrop = () => setShouldPlay(true);
  const resetWaterDrop = () => setShouldPlay(false);

  return (
    <WaterDropContext.Provider value={{ shouldPlay, triggerWaterDrop, resetWaterDrop }}>
      {children}
    </WaterDropContext.Provider>
  );
};

export const useWaterDrop = () => useContext(WaterDropContext);
