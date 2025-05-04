import { Bell, MessageCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="top-0 sticky z-20 w-full flex items-center justify-between p-4 shadow-lg bg-gray/90 px-20">
      <div className="text-3xl font-bold text-blue">
        <button onClick={() => navigate("/home")} className="cursor-pointer">
          NoTiCall
        </button>
      </div>
      <div className="flex items-center gap-4">
        <Bell className="w-6 h-6 text-white hover:text-blue cursor-pointer" />
        <MessageCircle className="w-6 h-6 text-white hover:text-blue cursor-pointer" />
        <User
          onClick={() => navigate("/profile")}
          className="w-6 h-6 text-white hover:text-blue cursor-pointer"
        />
      </div>
    </nav>
  );
};

export default Navbar;
