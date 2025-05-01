import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/Landing";
import Navbar from "./pages/Navbar";
import State from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Routes location={location} key={location.pathname}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/signup" element={<State />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
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

export default Root;
