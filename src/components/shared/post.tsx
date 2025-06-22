import Link from "next/link";
import { PostWithUser } from "../../../types/types";
import { UserAvatar } from "./avatar";
import { formatDistanceToNow } from "date-fns";
import { currentUser } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import Like from "./like";
import Comment from "./comment";
import PostActions from "./postActions";
import Image from "next/image";

interface PostProps {
  post: PostWithUser;
  className?: string;
}

export default async function Post({ post, className }: PostProps) {
  const user = await currentUser();

  return (
    <div
      className={
        className +
        " flex flex-col gap-2 bg-white dark:bg-accent p-4 rounded-xl"
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {user ? (
            <Link href={`/profile/${post?.user?.username}`}>
              <UserAvatar
                src={post?.user?.image || ""}
                Fallback={post?.user?.username.charAt(0).toUpperCase() || ""}
              />
            </Link>
          ) : (
            <SignInButton mode="modal">
              <div>
                <UserAvatar
                  src={post?.user?.image || ""}
                  Fallback={post?.user?.username.charAt(0).toUpperCase() || ""}
                />
              </div>
            </SignInButton>
          )}
          <div className="flex flex-col gap-2">
            <Link className="text-sm" href={""}>
              @{post?.user?.username}
            </Link>
            <span className="text-xs text-gray-600">
              {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </span>
          </div>
        </div>
        {post.user?.clerkId === user?.id && (
          <div>
            <PostActions postId={post.id} />
          </div>
        )}
      </div>

      <div className="relative px-14 flex flex-col gap-4">
        <Link
          href={`/post/${post.id}`}
          className={`text-sm ${!user && "pointer-events-none"}`}
        >
          {post?.caption}
        </Link>
        {post.image && (
          <div className="flex items-center justify-center">
            <Image
              className="rounded-lg"
              src={post.image}
              width={200}
              height={200}
              alt="post-image"
            />
          </div>
        )}

        <div
          className={`flex items-center gap-4 ${
            !user && "pointer-events-none"
          }`}
        >
          <Like
            postId={post.id}
            isLiked={post.isLiked}
            likeCount={post.likeCount}
          />
          <Comment comment={post?.comments || []} />
        </div>
      </div>
    </div>
  );
}
