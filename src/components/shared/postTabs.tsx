import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PostTabs() {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="w-full h-12 dark:border dark:bg-accent">
        <TabsTrigger className="font-semibold cursor-pointer" value="account">
          For You
        </TabsTrigger>
        <TabsTrigger className="font-semibold cursor-pointer" value="password">
          Following
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
