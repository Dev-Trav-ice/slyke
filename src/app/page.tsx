import { getPosts } from "@/actions/post.actions";
import CreatePost from "@/components/shared/CreatePost";
import Post from "@/components/shared/post";
import PostTabs from "@/components/shared/postTabs";

export default async function page() {
  const posts = await getPosts();

  return (
    <main>
      <CreatePost />

      <section className="flex flex-col gap-4 pb-8">
        <PostTabs />
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </section>
    </main>
  );
}
