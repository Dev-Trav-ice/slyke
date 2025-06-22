import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  src: string;
  Fallback: string;
  className?: string;
}
export async function UserAvatar({
  src,
  Fallback,
  className,
}: UserAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage
        src={
          src ||
          "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png"
        }
      />
      <AvatarFallback>{Fallback}</AvatarFallback>
    </Avatar>
  );
}
