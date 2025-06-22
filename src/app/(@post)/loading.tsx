import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="absolute top-0 right-0 z-50 left-0 bottom-0 bg-black/40 backdrop-blur-sm supports-[backdrop-filter]: flex items-center justify-center">
      <LoaderCircle size={24} className="animate-spin text-primary" />
    </div>
  );
}
