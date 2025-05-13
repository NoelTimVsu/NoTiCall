import { useUserStore } from '@/store/useUserStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CreateGroupModalProps } from '@/types/GroupModalPopUp.types';
import { Loader2, X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useChatRoomStore } from '@/store/useChatRoomStore';
import toast from 'react-hot-toast';

function CreateGroupModal({ onClose, onGroupCreate, typeOfModal, group }: CreateGroupModalProps) {
  const { allUsers, fetchAllUsers } = useUserStore();
  const { authUser } = useAuthStore();
  const { createGroupChat, updateGroupChat } = useChatRoomStore();

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [groupName, setGroupName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [initialMemberIds, setInitialMemberIds] = useState<number[]>([]);
  const [groupNameChange, setGroupNameChange] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      await fetchAllUsers();

      if (typeOfModal === 'edit' && group) {
        const memberIds = group.members.map(m => m.user.id);
        setGroupName(group.name);
        setSelectedUsers(memberIds);
        setInitialMemberIds(memberIds);
      }

      setLoading(false);
    };
    init();
  }, [fetchAllUsers, typeOfModal, group]);

  const nameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGroupName(value);
    if (group) {
      setGroupNameChange(group.name.trim() !== value.trim());
    } else {
      setGroupNameChange(value.trim().length > 0);
    }
  };

  const disableUpdate = useMemo(() => {
    if (typeOfModal !== 'edit') return false;
    const sameLength = selectedUsers.length === initialMemberIds.length;
    const sameMembers = selectedUsers.every(id => initialMemberIds.includes(id));
    return sameLength && sameMembers;
  }, [selectedUsers, initialMemberIds, typeOfModal]);

  const handleToggle = (id: number) => {
    setSelectedUsers(prev => (prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]));
  };

  const handleCreateOrEditGroup = async () => {
    const selectedFromFiltered = allUsers.filter(user => selectedUsers.includes(user.id));
    const currentUser = useAuthStore.getState().authUser;

    if (!currentUser?.id) {
      toast.error('User not authenticated.');
      return;
    }

    if (typeOfModal === 'edit' && group) {
      const updatePayload = {
        name: groupName || `Group with ${selectedFromFiltered.length} members`,
        id: group.id,
        members: selectedFromFiltered.map(user => ({
          chat_room_id: group.id,
          user_id: user.id,
          role: 'USER',
        })),
      };

      try {
        await updateGroupChat(updatePayload);
        toast.success('Group updated!');
        onGroupCreate?.(selectedFromFiltered);
        onClose();
      } catch {
        toast.error('Group update failed!');
      }

      return;
    }

    // Create group
    selectedFromFiltered.push({
      ...currentUser,
      created_at: new Date().toISOString(),
    });

    const createPayload = {
      name: groupName || `Group with ${selectedFromFiltered.length} members`,
      created_by: currentUser.id,
      members: selectedFromFiltered.map(user => ({
        user_id: user.id,
        role: 'USER',
      })),
    };

    try {
      await createGroupChat(createPayload);
      toast.success('Group created!');
      onGroupCreate?.(selectedFromFiltered);
      onClose();
    } catch {
      toast.error('Group creation failed!');
    }
  };

  const isEdit = typeOfModal === 'edit';
  const isDisabled = isEdit
    ? selectedUsers.length === 1 || (disableUpdate && !groupNameChange)
    : selectedUsers.length === 0 || (disableUpdate && !groupNameChange);

  const buttonClass = isDisabled
    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
    : 'bg-blue-600 text-white hover:bg-blue-700';

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 relative flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-blue-500 w-12 h-12 mb-4" />
          <p className="text-gray-700 font-semibold">Fetching Users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 sm:p-6">
      <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl rounded-lg shadow-xl p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <h2 className="text-lg sm:text-xl font-bold mb-4">
          {typeOfModal === 'edit' ? 'Edit Group Chat' : 'Create Group Chat'}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={nameOnChange}
            placeholder="Enter group name"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2 max-h-52 sm:max-h-64 overflow-y-auto pr-1">
          {allUsers.length > 0 ? (
            allUsers
              .filter(user => user.id !== authUser?.id)
              .map(user => (
                <label key={user.id} className="flex items-center gap-3 text-sm sm:text-base">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleToggle(user.id)}
                  />
                  <span>{user.full_name}</span>
                </label>
              ))
          ) : (
            <p className="text-sm text-gray-500">No other users available</p>
          )}
        </div>
        <button
          onClick={handleCreateOrEditGroup}
          disabled={isDisabled}
          className={`mt-4 w-full py-2 rounded text-sm sm:text-base transition-colors duration-200 ${buttonClass}`}
        >
          {isEdit ? 'Update Group' : 'Create Group'}
        </button>
      </div>
    </div>
  );
}

export default CreateGroupModal;
