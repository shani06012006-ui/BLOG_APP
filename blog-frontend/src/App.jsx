import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { BlogProvider } from './context/BlogContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import Login from './pages/Login';
import ApiTester from './pages/ApiTester';

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useContext(AuthContext);
  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/blogs" /> : <Login />} />
        <Route path="/" element={<Navigate to="/blogs" />} />
        <Route path="/blogs" element={<ProtectedRoute><BlogList /></ProtectedRoute>} />
        <Route path="/blogs/:id" element={<ProtectedRoute><BlogDetail /></ProtectedRoute>} />
        <Route path="/createblog" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
        <Route path="/api-tester" element={<ProtectedRoute><ApiTester /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BlogProvider>
          <AppRoutes />
        </BlogProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;