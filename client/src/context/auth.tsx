import * as React from "react";
import { useDispatch } from "react-redux";
import { authService } from "../services";
import { AppThunks } from "../store";
type AuthContextData = {
  user: User | null;
  logout: () => Promise<void>;
  login: (
    ...params: Parameters<typeof authService.loginUsingCredentials>
  ) => Promise<void>;
  signUp: (
    ...params: Parameters<typeof authService.signUp>
  ) => Promise<(code: string, name: string) => Promise<any>>;
};

const AuthContext = React.createContext<AuthContextData>({
  user: null,
  logout: async () => {},
  login: async () => {},
  signUp: async () => async () => {},
});

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState<AuthContextData["user"]>(null);

  const dispatch = useDispatch();

  const createUser = AppThunks.users.createUser(dispatch);

  const getCurrentUser = AppThunks.users.getCurrentUser(dispatch);

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

  const signUp: AuthContextData["signUp"] = async (...params) => {
    const cogUser = await authService.signUp(...params);

    const confirmRegistration = async (code: string, username: string) => {
      await authService.confirmAccountUsingCode(cogUser, code);

      await authService.loginUsingCredentials(...params);

      const newUser = await createUser({ username });

      setUser(newUser);
    };

    return confirmRegistration;
  };

  React.useEffect(() => {
    try {
      if (!user) retrieveUser();
    } catch {
      console.debug("User not currently authenticated - Ignoring.");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        login,
        signUp,
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
