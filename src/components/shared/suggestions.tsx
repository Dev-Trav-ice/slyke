import { getSuggestedUsers } from "@/actions/post.actions";
import { UserAvatar } from "./avatar";
import Link from "next/link";
import FormStatus from "./FormStatus";
import { followUnfollow } from "@/actions/user.actions";

export default async function Suggestions() {
  const suggestedUsers = await getSuggestedUsers();

  if (!suggestedUsers) return null;

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-accent">
      <h1 className="text-center text-lg font-bold">Who To Follow</h1>

      <div>
        {suggestedUsers.map((user) => (
          <form
            action={followUnfollow}
            className="p-4 flex items-center justify-between"
            key={user.id}
          >
            <input type="hidden" name="targetUserId" value={user.id} />
            <Link
              href={`/profile/${user.username}`}
              className="flex items-center gap-2"
            >
              <UserAvatar
                src={user.image || ""}
                className="w-6 h-6"
                Fallback={user.username.charAt(0)}
              />
              <span className="text-sm">@{user.username}</span>
            </Link>
            <FormStatus btnLabel="Follow" />
          </form>
        ))}
      </div>
    </div>
  );
}
