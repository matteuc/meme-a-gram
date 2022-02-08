import * as React from "react";
type AuthContextData = {
  user: User | null
};

const AuthContext = React.createContext<AuthContextData>({
  user: null
});

const AuthProvider: React.FC = ({ children }) => {

  const [user, setUser] = React.useState<AuthContextData['user']>(null);

  return <AuthContext.Provider value={{
    user
  }}>{children}</AuthContext.Provider>;
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
