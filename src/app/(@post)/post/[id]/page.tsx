import { Input } from "@/components/ui/input";
import React from "react";
import { ParamsProps } from "../../../../../types/types";
import { UserAvatar } from "@/components/shared/avatar";
import Link from "next/link";
import Like from "@/components/shared/like";
import {
  createComment,
  deleteComment,
  getPostById,
} from "@/actions/post.actions";
import PostComments from "@/components/shared/comment";
import { currentUser } from "@clerk/nextjs/server";
import DeleteCommentBtn from "@/components/shared/deleteCommentBtn";
import WriteCommentBtn from "@/components/shared/commentBtn";
import Image from "next/image";

export default async function PostPage({ params }: ParamsProps) {
  const postId = (await params).id;

  const post = await getPostById(postId as string);
  const user = await currentUser();

  return (
    <div className="absolute top-0 left-0 z-50 right-0 w-screen h-screen bg-black/20 backdrop-blur-sm supports-[backdrop-filter] flex items-center justify-center ">
      <div className="flex items-start w-[600px] h-[500px] rounded-lg bg-accent p-4">
        <div className="flex-1 px-2 py-4">
          <div className="flex items-start gap-2">
            <UserAvatar
              src={post?.user.image || ""}
              Fallback={post?.user.username.charAt(0) || ""}
            />
            <div className="flex flex-col gap-1">
              <Link
                className="text-sm"
                href={`/profile/${post?.user.username}`}
              >
                @{post?.user.username}
              </Link>
              <span className="text-xs text-gray-600">
                {post?.createdAt.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="py-4 flex flex-col gap-4 px-10">
            <div className="flex flex-col gap-2">
              <h1 className="text-sm">{post?.caption}</h1>
              {post?.image && (
                <div className="flex items-center justify-center">
                  <Image
                    src={post.image}
                    width={200}
                    height={200}
                    alt="post-image"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Like
                likeCount={post?.likes.length || 0}
                postId={post?.id as string}
                isLiked={post?.isLiked || false}
              />
              <PostComments comment={post?.comments ?? []} />
            </div>
          </div>
        </div>

        <div className="flex-1 px-2 border-l-2 h-full overflow-auto">
          <h1 className="text-center my-2 font-semibold">
            {post?.comments.length} Comments
          </h1>
          <form
            action={createComment}
            className="flex items-center gap-2 pb-4 border-b"
          >
            <input type="hidden" name="postId" value={post?.id} />
            <Input
              className="border-2 border-gray-400"
              id="comment"
              name="comment"
            />
            <WriteCommentBtn />
          </form>

          <div>
            {post?.comments.map((comment) => (
              <div className="py-3 border-b-2" key={comment.id}>
                <div className="flex items-start gap-2 p-2">
                  <UserAvatar
                    src={comment.user.image || ""}
                    Fallback={comment.user.username.charAt(0)}
                    className="w-6 h-6"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">
                      {comment.user.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {comment.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <form
                  action={deleteComment}
                  className="px-4 flex items-center justify-between"
                >
                  <span className="text-xs ">{comment.text}</span>
                  <input type="hidden" name="postId" value={post.id} />
                  <input type="hidden" name="commentId" value={comment.id} />
                  {user?.id === comment?.user.clerkId && <DeleteCommentBtn />}
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
