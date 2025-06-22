import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const skeletons = [1, 2, 3];
  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-4">
        {skeletons.map((i) => (
          <div
            className="bg-white dark:bg-accent p-4 rounded-lg flex flex-col gap-4"
            key={i}
          >
            <div className="flex w-full items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-24 h-4" />
            </div>
            <div className="w-full flex flex-col gap-4 px-4 md:px-8">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
