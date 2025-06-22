import React from "react";
import { ParamsProps } from "../../../../types/types";
import { dbUser, followUnfollow, getProfile } from "@/actions/user.actions";
import { UserAvatar } from "@/components/shared/avatar";
import { Calendar1, Globe, Grid2X2, MapPin, Notebook } from "lucide-react";

import EditProfile from "@/components/shared/editProfile";
import Post from "@/components/shared/post";
import FormStatus from "@/components/shared/FormStatus";

export default async function ProfilePage({ params }: ParamsProps) {
  const userName = (await params).username;
  const currentUser = await dbUser();

  const userProfile = await getProfile(userName as string);

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-accent">
      <div className="flex items-start gap-6">
        <UserAvatar
          src={userProfile?.image || ""}
          Fallback={userProfile?.username.charAt(0) || ""}
          className="w-16 h-16"
        />

        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-lg font-bold">@{userProfile?.username}</h1>

          {/* profile details */}
          <div className="flex items-center gap-8">
            <div className="profileDetails">
              <h1>Posts</h1>
              <span>{userProfile?.posts.length || 0}</span>
            </div>

            <div className="profileDetails">
              <h1>Followers</h1>
              <span>{userProfile?.followers.length}</span>
            </div>

            <div className="profileDetails">
              <h1>Following</h1>
              <span>{userProfile?.following.length}</span>
            </div>
          </div>

          {/* Bio, website etc */}

          <div className="flex flex-col gap-4">
            {userProfile?.bio && (
              <div className="flex items-center gap-4">
                <Notebook size={16} />
                <h1 className="text-sm text-gray-500">{userProfile?.bio}</h1>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Calendar1 size={16} />
              <h1 className="text-sm text-gray-500">
                Member since:{" "}
                {userProfile?.createdAt.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h1>
            </div>

            {userProfile?.website && (
              <div className="flex items-center gap-4">
                <Globe size={16} />
                <a target="_blank" className="text-sm text-gray-500">
                  {userProfile.website}
                </a>
              </div>
            )}

            {userProfile?.location && (
              <div className="flex items-center gap-4">
                <MapPin size={16} />
                <h1 className="text-sm text-gray-500">
                  {userProfile?.location}
                </h1>
              </div>
            )}

            {userProfile?.clerkId === currentUser?.clerkId ? (
              <div>
                <EditProfile
                  defaultBio={userProfile?.bio as string}
                  defaultLocation={userProfile?.location as string}
                  defaultWebsite={userProfile?.website as string}
                />
              </div>
            ) : (
              <form action={followUnfollow}>
                <input
                  type="hidden"
                  name="targetUserId"
                  value={userProfile?.id}
                />
                <FormStatus
                  btnLabel={
                    userProfile?.followers.some(
                      (follower) => follower.followerId === currentUser?.id
                    )
                      ? "Following"
                      : "Follow"
                  }
                />
              </form>
            )}

            <div className="flex flex-col gap-3">
              <div className="border-2 w-full p-2 flex items-center justify-center gap-2 rounded-lg">
                <Grid2X2 size={16} />
                <span className="font-bold text-lg">Posts</span>
              </div>
              <div className="flex flex-col gap-4">
                {userProfile?.posts.map((post) => (
                  <Post
                    className="border-2 dark:border-none"
                    key={post.id}
                    post={post}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
