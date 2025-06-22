import { createPost } from "@/actions/post.actions";
import Uploader from "./uploader";
import { Textarea } from "../ui/textarea";
import { dbUser } from "@/actions/user.actions";
import { UserAvatar } from "./avatar";

export default async function CreatePost() {
  const user = await dbUser();
  return (
    <>
      {user && (
        <form
          action={createPost}
          className="p-4 bg-white dark:bg-accent rounded-lg flex flex-col gap-4 mb-4"
        >
          <div className="flex items-start gap-2">
            <UserAvatar
              src={user.image || ""}
              Fallback={user?.username.charAt(0)}
            />
            <Textarea name="caption" placeholder="What’s crack-a-lacking?" />
          </div>
          <Uploader />
        </form>
      )}
    </>
  );
}
