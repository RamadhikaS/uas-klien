import React, { createContext, useContext, useState, useEffect } from "react"; 

const AuthStateContext = createContext({
  user: null,           
  isAuthenticated: false,
  setUser: () => {},   
  logout: () => {},     
});

export const AuthProvider = ({ children }) => {

  const [user, _setUserInternal] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    console.log("AuthProvider Mounted: Mencoba memuat user dari localStorage...");
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        _setUserInternal(parsedUser);
        setIsAuthenticated(true);
        console.log("AuthProvider: User dimuat dari localStorage:", parsedUser);
      } else {
        console.log("AuthProvider: Tidak ada user di localStorage.");
      }
    } catch (error) {
      console.error("AuthProvider: Error parsing user dari localStorage:", error);
      localStorage.removeItem("user");
    } finally {
        setIsLoadingAuth(false); 
    }
  }, []); 

  const setUser = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      _setUserInternal(userData);
      setIsAuthenticated(true);
      console.log("AuthProvider: User di-set dan disimpan ke localStorage:", userData);
    } else {
      localStorage.removeItem("user");
      _setUserInternal(null);
      setIsAuthenticated(false);
      console.log("AuthProvider: User di-remove dari localStorage dan context.");
    }
  };

  const logout = () => {
    setUser(null);
  };

  const contextValue = {
    user,
    isAuthenticated,
    setUser,
    logout,
    isLoadingAuth,
  };

  return (
    <AuthStateContext.Provider value={contextValue}>
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthStateContext = () => {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error("useAuthStateContext must be used within an AuthProvider");
  }
  return context;
};