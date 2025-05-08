import {useEffect, useState} from "react";
import {Users} from "lucide-react";
import { useChatStore, User } from '../store/useChatStore.js';
import SidebarSkeleton from "./skeletons/SidebarSkeleton.tsx";
import { AvatarFallback, AvatarImage, Avatar } from '@radix-ui/react-avatar';
import { useSocketStore } from '@/store/useSocketStore.ts';

function Sidebar() {
  const { getFriends, setSelectedUser, selectedUser, friends, isUsersLoading } = useChatStore();
  const { onlineUsers } = useSocketStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  const filteredUsers = showOnlineOnly ? friends.filter(friend => onlineUsers.includes(String(friend.id))) : friends;

  if(isUsersLoading) return <SidebarSkeleton />

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={() => setShowOnlineOnly((prev) => !prev)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((friend: User) => (
          <button
            key={friend.id}
            onClick={() => setSelectedUser(friend)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-blue-50 transition-colors ${selectedUser?.id === friend.id ? "bg-base-300" : ""}`}
          >
            <div className="relative mx-auto lg:mx-0">
              <Avatar className="w-8 h-8 rounded-full border-2 p-2">
                <AvatarImage src={friend.profile_pic} />
                <AvatarFallback>{friend.username.slice(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {onlineUsers.includes(String(friend.id)) && (
                <span className="absolute bottom-[-8px] right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{friend.full_name}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(String(friend.id)) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar;