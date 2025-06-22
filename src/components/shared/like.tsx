"use client";

import { likeUnlikePost } from "@/actions/post.actions";
import { Heart } from "lucide-react";
import { useTransition } from "react";

interface LikeButtonProps {
  postId: string;
  isLiked: boolean;
  likeCount: number;
}
export default function Like({ postId, isLiked, likeCount }: LikeButtonProps) {
  const [pending, startTransition] = useTransition();

  const handleLike = () => {
    const formData = new FormData();
    formData.append("postId", postId);
    startTransition(() => {
      likeUnlikePost(formData);
    });
  };

  return (
    <div className="flex items-center gap-1">
      <button
        className={`cursor-pointer ${pending && "pointer-events-none"}`}
        onClick={handleLike}
        disabled={pending}
      >
        {pending ? (
          "..."
        ) : isLiked ? (
          <Heart className="fill-red-500 outline-none" size={16} />
        ) : (
          <Heart size={16} />
        )}
      </button>
      {!pending && (
        <span className="text-xs">{likeCount < 1 ? "" : likeCount}</span>
      )}
    </div>
  );
}
