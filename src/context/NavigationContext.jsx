import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const [screenStack, setScreenStack] = useState(['Dashboard']);
  const [screenParams, setScreenParams] = useState({});

  const navigate = (screenName, params = {}) => {
    setCurrentScreen(screenName);
    setScreenStack(prev => [...prev, screenName]);
    setScreenParams(prev => ({ ...prev, [screenName]: params }));
  };

  const goBack = () => {
    if (screenStack.length > 1) {
      const newStack = screenStack.slice(0, -1);
      setScreenStack(newStack);
      setCurrentScreen(newStack[newStack.length - 1]);
    }
  };

  const reset = (screenName = 'Dashboard') => {
    setCurrentScreen(screenName);
    setScreenStack([screenName]);
    setScreenParams({});
  };

  const getParams = (screenName) => {
    return screenParams[screenName] || {};
  };

  return (
    <NavigationContext.Provider value={{
      currentScreen,
      navigate,
      goBack,
      reset,
      getParams,
      canGoBack: screenStack.length > 1
    }}>
      {children}
    </NavigationContext.Provider>
  );
};