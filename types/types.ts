import { Comment, Follow, Like, Post, User } from "@prisma/client";

export type PostWithUser = Post & {
  user?: User;
  isLiked: boolean;
  like?: Like[];
  likeCount: number;
  comments?: Comment[];
};

export type Profile = User & {
  post: Post[];
  followers: Follow[];
  following: Follow[];
};

export type ParamsProps = {
  params: Promise<{ id?: string; username?: string }>;
};
