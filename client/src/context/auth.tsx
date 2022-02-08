import * as React from "react";
import { authService } from "../services";
import { getCurrentUser } from "../services/api/queries";
type AuthContextData = {
  user: User | null;
  logout: () => Promise<void>;
  login: (
    ...params: Parameters<typeof authService.loginUsingCredentials>
  ) => Promise<void>;
};

const AuthContext = React.createContext<AuthContextData>({
  user: null,
  logout: async () => {},
  login: async () => {},
});

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState<AuthContextData["user"]>(null);

  const logout: AuthContextData["logout"] = async () => {
    setUser(null);
    await authService.logout();
  };

  const retrieveUser = async () => {
    const fetchedUser = await getCurrentUser();

    setUser(fetchedUser);
  };

  const login: AuthContextData["login"] = async (...params) => {
    await authService.loginUsingCredentials(...params);

    await retrieveUser();
  };

  React.useEffect(() => {
    try {
      if (!user) retrieveUser();
    } catch {
      console.debug('User not currently authenticated - Updating auth state.')
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
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
