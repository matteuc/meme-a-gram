import * as React from "react";
type StatusContextData = {};

const StatusContext = React.createContext<StatusContextData>({});

const StatusProvider: React.FC = ({ children }) => {
  return <StatusContext.Provider value={{}}>{children}</StatusContext.Provider>;
};

export const useStatusProvider = () => {
  const context = React.useContext(StatusContext);

  if (!context) {
    throw new Error(
      '"useStatusProvider" can only be used in the "StatusProvider" component.'
    );
  }

  return context;
};

export default StatusProvider;
