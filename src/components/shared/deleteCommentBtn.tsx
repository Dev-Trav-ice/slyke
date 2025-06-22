"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle, Trash2 } from "lucide-react";

export default function DeleteCommentBtn() {
  const { pending } = useFormStatus();
  return (
    <button className="cursor-pointer" disabled={pending} type="submit">
      {pending ? (
        <LoaderCircle size={12} className="animate-spin text-red-500" />
      ) : (
        <Trash2 size={12} className="text-red-500" />
      )}
    </button>
  );
}
