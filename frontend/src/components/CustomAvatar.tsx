import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

function CustomAvatar({profile_pic, fallback}: {profile_pic: string | undefined; fallback: string | undefined}) {
  return (
    <Avatar className="flex justify-center items-center w-8 h-8 rounded-full border-2 p-2">
      <AvatarImage src={profile_pic || '/default-avatar.png'} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
export default CustomAvatar;