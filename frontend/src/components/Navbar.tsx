import { Bell, MessageCircle, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '@/store/useAuthStore.ts';
import { useNotificationStore, Notification } from '@/store/useNotificationStore.ts';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore.ts';
import CustomAvatar from '@/components/CustomAvatar.tsx';

const Navbar = () => {
  const { friendRequestNotifications, getNotifications } = useNotificationStore();
  const navigate = useNavigate();
  const { isLoggedIn, logOut } = useAuthStore();

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    getNotifications();
  }, [getNotifications, isLoggedIn]);

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
            <div className="relative">
              <Bell
                className="w-6 h-6 text-white hover:text-blue cursor-pointer"
                onClick={() => setShowNotifications((prev) => !prev)}
              />
              {friendRequestNotifications.length > 0 && (
                <span className="absolute flex justify-center items-center w-4 h-4 right-[-5px] bottom-[-5px] text-white text-sm bg-red-600 rounded">
                  {friendRequestNotifications.length}
                </span>
              )}
              {showNotifications && (
                <div className="absolute right-0 top-10">
                  {friendRequestNotifications.map((notification) => (
                    <FriendRequestNotification key={notification.id} notification={notification} />
                  ))}
                </div>
              )}
            </div>
            <MessageCircle
              onClick={() => navigate('/chat')}
              className="w-6 h-6 text-white hover:text-blue cursor-pointer" />
            <User
              onClick={() => navigate('/profile')}
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

function FriendRequestNotification({ notification }: { notification: Notification }) {
  const { responseFriendRequest } = useUserStore();

  return <div className="bg-white shadow-md p-4 flex flex-col border-b-1">
    <div className="flex items-center gap-4 mx-auto md:mx-0">
      <CustomAvatar
        profile_pic={notification.actor.profile_pic}
        fallback={notification.actor.username.slice(0, 2).toUpperCase()}
      />
      <p className="text-lg">{notification.message}</p>
    </div>

    <div className="mt-4 flex gap-2">
      <button className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
              onClick={() => responseFriendRequest(notification.actor.id, 'accept')}
      >
        Accept
      </button>
      <button
        className="px-4 py-2 bg-white text-black border border-zinc-300 rounded-full hover:bg-zinc-100 transition"
        onClick={() => responseFriendRequest(notification.actor.id, 'block')}
      >
        Deny
      </button>
    </div>
  </div>
}

export default Navbar;
