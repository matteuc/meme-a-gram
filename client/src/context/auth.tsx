import * as React from "react";
type AuthContextData = {};

const AuthContext = React.createContext<AuthContextData>({});

const AuthProvider: React.FC = ({ children }) => {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export const useAuthProvider = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error(
      '"useAuthProvider" can only be used in the "AuthProvider" component.'
    );
  }

  return context;
};

export default AuthProvider;
