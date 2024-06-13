import { useState, createContext } from "react";

export const EasyModeContext = createContext(false);

export function EasyModeProvider({ children }) {
  const [easyMode, setEasyMode] = useState(false);

  return <EasyModeContext.Provider value={{ easyMode, setEasyMode }}>{children}</EasyModeContext.Provider>;
}
