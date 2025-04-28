import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/landing";
import Navbar from "./pages/navbar";
import State from "./pages/signup";
import Login from "./pages/login";
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
