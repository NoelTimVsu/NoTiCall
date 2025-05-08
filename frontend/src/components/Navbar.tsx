import { Bell, MessageCircle, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '@/store/useAuthStore.ts';

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logOut } = useAuthStore();

  return (
    <nav className="top-0 sticky z-20 w-full flex items-center justify-between p-4 shadow-lg bg-gray/90 px-20">
      <div className="text-3xl font-bold text-blue">
        <button onClick={() => navigate("/home")} className="cursor-pointer">
          <span className="flex items-center">
            <MessageCircle className="w-8 h-8"/>
            NoTiCall
          </span>
        </button>
      </div>
      <div className="flex items-center gap-4">
        {
          isLoggedIn &&
          <>
            <Bell className="w-6 h-6 text-white hover:text-blue cursor-pointer" />
            <MessageCircle
              onClick={() => navigate("/chat")}
              className="w-6 h-6 text-white hover:text-blue cursor-pointer" />
            <User
              onClick={() => navigate("/profile")}
              className="w-6 h-6 text-white hover:text-blue cursor-pointer"
            />
            <LogOut
              onClick={() => logOut()}
              className="w-6 h-6 text-white hover:text-blue cursor-pointer" />
          </>
        }
      </div>
    </nav>
  );
};

export default Navbar;
