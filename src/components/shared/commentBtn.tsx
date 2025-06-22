"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle, SendHorizonal } from "lucide-react";

export default function WriteCommentBtn() {
  const { pending } = useFormStatus();
  return (
    <button className="cursor-pointer" disabled={pending} type="submit">
      {pending ? (
        <LoaderCircle size={16} className="animate-spin" />
      ) : (
        <SendHorizonal size={16} />
      )}
    </button>
  );
}
