import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

interface Member {
  id: number;
  full_name: string;
  username: string;
  profile_pic: string;
}

interface GroupAvatarProps {
  members: Member[];
}

const GroupAvatar = ({ members }: GroupAvatarProps) => {
  const displayedMembers = members.slice(0, 4);
  const extraCount = members.length - displayedMembers.length;

  return (
    <div className="flex items-center">
      <div className="flex">
        {displayedMembers.map((member, index) => (
          <div
            key={member.id}
            className={`relative w-6 lg:w-10 h-6 lg:h-10 rounded-full ring-2 ring-white shadow-md bg-gray-100
              ${index !== 0 ? '-ml-3' : ''}`}
            style={{ zIndex: 10 - index }}
          >
            <Avatar className="w-full h-full">
              <AvatarImage
                src={member.profile_pic || '/default-avatar.png'}
                className="object-cover rounded-full"
              />
              <AvatarFallback className="flex items-center justify-center w-full h-full text-xs font-medium text-gray-700 bg-gray-200 rounded-full">
                {member.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        ))}

        {extraCount > 0 && (
          <div className="-ml-3 w-6 lg:w-10 h-6 lg:h-10 rounded-full bg-gray-300 text-sm font-semibold flex items-center justify-center ring-2 ring-white shadow-md">
            +{extraCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupAvatar;
