import React from "react";
import {System} from "@/types/System";

export const DisplayContext = React.createContext<{
  system: System | null,
  setSystem: (system: System) => void
}>({
  system: null,
  setSystem: () => {
  }
})

export const DisplayProvider = ({children}: { children: React.ReactNode }) => {
  const [system, setSystem] = React.useState<System | null>(null);

  return (
    <DisplayContext.Provider value={{system, setSystem}}>
      {children}
    </DisplayContext.Provider>
  )
}