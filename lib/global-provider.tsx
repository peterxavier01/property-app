import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type Models } from "react-native-appwrite";

import { account, getCurrentUser, type UserWithAvatar } from "./appwrite";
import { useAppwrite } from "./use-appwrite";

interface GlobalContextType {
  isLoggedIn: boolean;
  user: UserWithAvatar | null;
  loading: boolean;
  refetch: (newParams: Record<string, string | number>) => Promise<void>;
  session: Models.Session | null;
  setSession: React.Dispatch<React.SetStateAction<Models.Session | null>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Models.Session | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const currentSession = await account.getSession("current");
        if (currentSession) {
          setSession(currentSession);
        }
      } catch (error) {
        console.log("No existing session found");
      } finally {
        setIsInitialized(true);
      }
    };

    checkExistingSession();
  }, []);

  const {
    data: userData,
    loading: userLoading,
    refetch,
  } = useAppwrite({
    fn: getCurrentUser,
    skip: !session || !isInitialized, // Only fetch user data when session exists and app is initialized
  });

  const user: UserWithAvatar | null = userData ?? null;
  const isLoggedIn = !!session; // User is logged in if session exists, regardless of user data
  const loading = !isInitialized || (!!session && userLoading && !userData); // Stop loading once we have user data OR no session

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      user,
      loading,
      refetch,
      session,
      setSession,
    }),
    [isLoggedIn, user, loading, refetch, session, setSession]
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }

  return context;
};
