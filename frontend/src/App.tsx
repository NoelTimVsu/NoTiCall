import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation, Outlet,
} from 'react-router-dom';
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/Landing";
import Navbar from "./components/Navbar.tsx";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from '@/store/useAuthStore.ts';

function App() {
  const location = useLocation();
  const { authUser, verifyAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  if(isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Routes location={location} key={location.pathname}>
        <Route element={<PublicRoutes />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>

      <Toaster />
    </motion.div>
  );
}

function Root() {
  return (
    <Router>
      <Navbar />
      <AnimatePresence>
        <App />
      </AnimatePresence>
    </Router>
  );
}

function PublicRoutes() {
  const { isLoggedIn } = useAuthStore();
  useEffect(() => {
  }, [isLoggedIn]);
  return isLoggedIn ? <Navigate to="/chat" replace /> : <Outlet />;
}

function ProtectedRoute() {
  const { isLoggedIn } = useAuthStore();
  useEffect(() => {
  }, [isLoggedIn]);
  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
}

export default Root;
