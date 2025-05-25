import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useEffect, useState } from 'react';
import { MoreHorizontal, Plus, Users } from 'lucide-react';
import { useChatStore, User } from '../store/useChatStore.js';
import SidebarSkeleton from './skeletons/SidebarSkeleton.tsx';
import { AvatarFallback, AvatarImage, Avatar } from '@radix-ui/react-avatar';
import { useSocketStore } from '@/store/useSocketStore.ts';
import CreateGroupModal from './GroupModalPopUp.tsx';
import GroupAvatar from './GroupAvatar.tsx';
import { useChatRoomStore, Group } from '@/store/useChatRoomStore.ts';
import { useAuthStore } from '@/store/useAuthStore.ts';
import toast from 'react-hot-toast';
import FriendRequestModal from '@/components/FriendRequestModal.tsx';

function Sidebar() {
  const { getFriends, setSelectedUser, selectedUser, friends, isUsersLoading } = useChatStore();
  const { onlineUsers } = useSocketStore();
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showFriendRequestModal, setShowFriendRequestModal] = useState(false);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const {
    groups,
    getGroups,
    isLoading: isGroupsLoading,
    deleteGroupChat,
    subcribeToGroupChange,
    unsubcribeToGroupChange,
  } = useChatRoomStore();
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [showActions, setShowActions] = useState(false);
  const { groups, getGroups, isLoading: isGroupsLoading, deleteGroupChat } = useChatRoomStore();
  const authUser = useAuthStore.getState().authUser;

  useEffect(() => {
    getFriends();
    getGroups();
    subcribeToGroupChange();
    return () => {
      unsubcribeToGroupChange();
    };
  }, [getFriends, getGroups, subcribeToGroupChange, unsubcribeToGroupChange]);

  const deleteGroup = (group: Group) => {
    if (!authUser) {
      toast.error('You must be logged in to delete a group.');
      return;
    }
    deleteGroupChat({
      chat_room_id: group.id,
      user_id: authUser.id,
    });
    setSelectedUser(undefined); // not working at this moment, will research more
  };
  const checkAnyOnlineUser = (group: Group) => {
    if (!group?.members || !Array.isArray(group.members)) return false;
    return group.members.some(
      member => member?.user?.id !== authUser?.id && onlineUsers.includes(String(member?.user?.id)),
    );
  };

  const filteredUsers = showOnlineOnly
    ? friends.filter(friend => onlineUsers.includes(String(friend.id)))
    : friends;

  if (isUsersLoading || isGroupsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-36 md:w-60 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
          {/* The button to create a group or add a friend */}
          {/* show two options */}
          {/* 1. add a friend */}
          {/* 2. create group chat */}
          <div className="relative">


            <button
              onClick={() => setShowActions((prev) => !prev)}
              title="More Options"
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <Plus className="w-5 h-5 text-blue-500" />
            </button>

            {showActions && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    setShowFriendRequestModal(true);
                    setShowActions(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Add a Friend
                </button>
                <button
                  onClick={() => {
                    setShowGroupModal(true);
                    setShowActions(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Create Group Chat
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 hidden md:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={() => setShowOnlineOnly(prev => !prev)}
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
            className={`w-full p-3 flex items-center gap-3 hover:bg-blue-50 transition-colors ${selectedUser?.id === friend.id ? 'bg-base-300' : ''}`}
          >
            <div className="relative mx-auto md:mx-0">
              <Avatar className="w-8 h-8 rounded-full border-2 p-2">
                <AvatarImage src={friend.profile_pic || '/default-avatar.png'} />
                <AvatarFallback>{friend.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {onlineUsers.includes(String(friend.id)) && (
                <span className="absolute bottom-[-8px] right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="hidden md:block text-left min-w-0">
              <div className="font-medium truncate">{friend.full_name}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(String(friend.id)) ? 'Online' : 'Offline'}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}

        {/* dislay group */}
        {groups.map(group => (
          <div
            key={group.id}
            className={`relative group w-full py-4 px-2 lg:p-0 flex flex-col gap-2 hover:bg-blue-50 transition-colors text-left ${
              selectedUser?.id === group.id ? 'bg-base-300' : ''
            }`}
          >
            <div
              onClick={() =>
                setSelectedUser({
                  id: group.id,
                  name: group.name,
                  update_by: group.update_by,
                  created_by: group.created_by,
                  members: group.members,
                })
              }
              className="relative w-full text-left lg:px-3 lg:py-2 hover:bg-zinc-100 rounded-lg transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xs lg:text-sm font-medium text-gray-700">{group.name}</h3>

                {/* Ellipsis Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="text-gray-500 hover:text-black p-2 sm:p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                      aria-label="Open group options"
                    >
                      <MoreHorizontal className=" w-4 h-4 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-40 sm:w-48">
                    <DropdownMenuItem
                      onSelect={() => setEditingGroup(group)}
                      className="cursor-pointer text-sm sm:text-base"
                    >
                      Edit Group
                    </DropdownMenuItem>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={e => e.preventDefault()}
                          className="text-red-600 cursor-pointer text-sm sm:text-base"
                        >
                          Delete Group
                        </DropdownMenuItem>
                      </AlertDialogTrigger>

                      <AlertDialogContent className="max-w-sm sm:max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-lg sm:text-xl">
                            Delete Group?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-sm sm:text-base">
                            Are you sure you want to delete <strong>{group.name}</strong>? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-4">
                          <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="w-full mt-2 sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => deleteGroup(group)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Avatar */}
              <GroupAvatar members={group.members.map(m => m.user)} />

              {/* Status Pill */}
              <div className="flex mt-2">
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${checkAnyOnlineUser(group) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                >
                  {checkAnyOnlineUser(group) ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* When group is created in modal: */}
        {showGroupModal && (
          <CreateGroupModal
            onClose={() => setShowGroupModal(false)}
            onGroupCreate={() => {
              setShowGroupModal(false);
            }}
            typeOfModal="create"
          />
        )}

        {editingGroup && (
          <CreateGroupModal
            group={editingGroup}
            onClose={() => setEditingGroup(null)}
            onGroupCreate={() => {
              setEditingGroup(null);
            }}
            typeOfModal="edit"
          />
        )}

        {/* Modal for sending new friend requests */}
        {showFriendRequestModal && (
          <FriendRequestModal onClose={() => setShowFriendRequestModal(false)} />
        )}

      </div>
    </aside>
  );
}

export default Sidebar;
