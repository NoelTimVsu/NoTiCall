import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

function CustomAvatar({profile_pic, fallback, size = 48}: {profile_pic: string | undefined; fallback: string | undefined, size?: number}) {
  return (
    <Avatar
      className={`flex justify-center items-center rounded-full border-2 overflow-hidden`}
      style={{width: `${size}px`, height: `${size}px`}}
    >
      <AvatarImage
        src={profile_pic || '/default-avatar.png'}
        alt="avatar"
        className="w-full h-full object-cover"
      />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
export default CustomAvatar;