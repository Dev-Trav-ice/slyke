"use client";

import { deletePost } from "@/actions/post.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

export default function PostActions({ postId }: { postId: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleDeletePost = async () => {
    const formData = new FormData();
    formData.append("postId", postId);
    try {
      setLoading(true);
      await deletePost(formData);
      closeRef.current?.click();
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button>
          {loading ? (
            <LoaderCircle size={12} className="animate-spin text-red-500" />
          ) : (
            <Trash2
              size={12}
              className="hover:text-red-500 transition-all cursor-pointer"
            />
          )}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your post
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 transition-all cursor-pointer text-white"
            onClick={handleDeletePost}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
