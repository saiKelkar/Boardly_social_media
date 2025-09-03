import { createContext, useState, useContext } from "react";

const PinContext = createContext();

export function PinProvider({ children }) {
  const [pins, setPins] = useState([]);

  const addPin = (newPin) => {
    setPins((prev) => [newPin, ...prev]);
  };

  return (
    <PinContext.Provider value={{ pins, addPin }}>
      {children}
    </PinContext.Provider>
  );
}

export function usePins() {
  return useContext(PinContext);
}
