import { createContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser, removeUser] = useLocalStorage('blogUser', null);

  const login = (username, password) => {
    if (!username || !password) return { error: 'All fields are required.' };
    if (password.length < 4) return { error: 'Password must be at least 4 characters.' };
    setUser(username);
    return { success: true };
  };

  const logout = () => {
    removeUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}