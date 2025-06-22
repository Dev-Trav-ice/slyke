import { Comment } from "@prisma/client";
import { MessageCircle } from "lucide-react";

export default function PostComments({ comment }: { comment: Comment[] }) {
  return (
    <div className="flex items-center gap-1">
      <MessageCircle size={16} />
      <span className="text-xs">
        {comment?.length < 1 ? "" : comment?.length}
      </span>
    </div>
  );
}
