import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Front from '@frontapp/plugin-sdk';

type FrontContextType = ReturnType<typeof Front.contextUpdates.subscribe> extends { unsubscribe: () => void } 
  ? Parameters<Parameters<typeof Front.contextUpdates.subscribe>[0]>[0] | undefined
  : undefined;

const FrontContext = createContext<FrontContextType>(undefined);

export function useFrontContext() {
  return useContext(FrontContext);
}

interface FrontContextProviderProps {
  children: ReactNode;
}

export const FrontContextProvider: React.FC<FrontContextProviderProps> = ({ children }) => {
  const [context, setContext] = useState<FrontContextType>(undefined);

  useEffect(() => {
    const subscription = Front.contextUpdates.subscribe((frontContext) => {
      setContext(frontContext);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <FrontContext.Provider value={context}>
      {children}
    </FrontContext.Provider>
  );
};
