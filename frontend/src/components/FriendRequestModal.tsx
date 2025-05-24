import { X } from 'lucide-react';
import { ChangeEvent, useMemo, useState } from 'react';
import { useUserStore } from '@/store/useUserStore.ts';
import { debouncedRequest } from '@/lib/utils.ts';

function FriendRequestModal({ onClose }: { onClose: () => void; }) {
  const { fetchUsersByCriteria, partialUsers, sendFriendRequest } = useUserStore();
  const [friendName, setFriendName] = useState('');
  const buttonClass = friendName === '' || friendName === undefined
    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
    : 'bg-blue-600 text-white hover:bg-blue-700';

  const debouncedSearch = useMemo(() =>
      debouncedRequest(fetchUsersByCriteria, 700),
    [fetchUsersByCriteria]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFriendName(event.target.value);
    if(event.target.value.length > 0) {
      debouncedSearch(event.target.value);
    }
  }

  const handleSendFriendRequest = (friendId: number) => {
    sendFriendRequest(friendId)
    setFriendName('');
    onClose();
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
          Send Friend Request
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Friend Email or Username</label>
          <input
            type="text"
            value={friendName}
            onChange={handleChange}
            placeholder="Enter friend's email or username"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {partialUsers.map((user) => (
          <button
            onClick={() => handleSendFriendRequest(user.id)}
            className={`mt-4 w-full py-2 rounded text-sm sm:text-base transition-colors duration-200 ${buttonClass}`}
          >
            <span>{user.full_name} @{user.username}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FriendRequestModal;
