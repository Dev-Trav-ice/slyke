"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";

interface FormStatusProps {
  btnLabel: string;
}
export default function FormStatus({ btnLabel }: FormStatusProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending}
      type="submit"
      className="text-xs text-white cursor-pointer"
    >
      {pending ? <LoaderCircle className="animate-spin" /> : btnLabel}
    </Button>
  );
}
