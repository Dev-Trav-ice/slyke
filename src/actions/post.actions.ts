"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { dbUser } from "./user.actions";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { console } from "inspector";

cloudinary.config({
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
  cloud_name: process.env.cloudinary_cloud_name,
});

export const createPost = async (formData: FormData): Promise<void> => {
  try {
    const caption = formData.get("caption")?.toString();
    const image = formData.get("image") as File;
    const user = await dbUser();

    if (!caption || !user) return;

    let imageUrl: string | null = null;
    let publicId: string | null = null;

    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "image", folder: "posts" },
            (err, res) => {
              if (err || !res)
                return reject(err || new Error("No Cloudinary response"));
              resolve(res);
            }
          )
          .end(buffer);
      });

      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    await prisma.post.create({
      data: {
        caption,
        userId: user.id,
        image: imageUrl,
        publicId,
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("❌ Error creating post:", error);
  }
};

export const getPosts = async () => {
  try {
    const postsWithLikes = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        likes: true,
        comments: true,
      },
    });

    const currentUser = await dbUser();

    const posts = postsWithLikes.map((post) => ({
      ...post,
      isLiked: post.likes.some((like) => like.userId === currentUser?.id),
      likeCount: post.likes.length,
      comments: post.comments,
    }));

    return posts;
  } catch (error) {
    console.log("error fetching posts", error);
    return [];
  }
};

export const getPostById = async (postId: string) => {
  try {
    const currentUser = await dbUser();

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true,
        likes: true,
        comments: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!post) return null;

    return {
      ...post,
      isLiked: post.likes.some((like) => like.userId === currentUser?.id),
      likeCount: post.likes.length,
      comments: post.comments,
    };
  } catch (error) {
    console.log("error fetching post by id", error);
    return null;
  }
};

export const getSuggestedUsers = async () => {
  try {
    const user = await currentUser();
    const { userId } = await auth();

    if (!user || !userId) return [];

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!existingUser) return [];

    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: existingUser.id } },
          {
            NOT: {
              followers: {
                some: { followerId: existingUser.id },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        image: true,
      },
      take: 5,
    });

    return randomUsers || [];
  } catch (error) {
    console.log("error getting suggestions", error);
    return [];
  }
};

export const likeUnlikePost = async (formData: FormData) => {
  const postId = formData.get("postId")?.toString();
  const user = await dbUser();

  if (!postId || !user) return;

  const existingLike = await prisma.like.findFirst({
    where: {
      userId: user.id,
      postId,
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    await prisma.like.create({
      data: {
        postId,
        userId: user.id,
      },
    });
  }
  revalidatePath("/");
};

export const createComment = async (formData: FormData) => {
  try {
    const currentUser = await dbUser();
    const comment = formData.get("comment")?.toString();
    const postId = formData.get("postId")?.toString();

    if (!comment || !currentUser || !postId) return;

    await prisma.comment.create({
      data: {
        text: comment,
        postId,
        userId: currentUser.id,
      },
    });

    revalidatePath("/");
    revalidatePath(`/post/${postId}`);
    revalidatePath(`/profile/${currentUser.username}`);
  } catch (error) {
    console.log("error writing comment", error);
    return;
  }
};

export const getComments = async (formData: FormData) => {
  try {
    const postId = formData.get("postId")?.toString();

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments;
  } catch (error) {
    console.log("error fetching comments", error);
    return [];
  }
};

export const deleteComment = async (formData: FormData) => {
  try {
    const postId = formData.get("postId")?.toString();
    const commentId = formData.get("commentId")?.toString();
    const currentUser = await dbUser();

    if (!postId || !commentId || !currentUser) return;

    await prisma.comment.delete({
      where: {
        id: commentId,
        postId,
        userId: currentUser.id,
      },
    });
    revalidatePath("/");
    revalidatePath(`/post/${postId}`);
  } catch (error) {
    console.log("error deleting comment", error);
  }
};

export const deletePost = async (formData: FormData) => {
  try {
    const postId = formData.get("postId")?.toString();
    const currentUser = await dbUser();

    if (!postId || !currentUser) return;

    const existingImage = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (existingImage?.image && existingImage.publicId) {
      await cloudinary.uploader.destroy(existingImage.publicId);
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.log("errro deleting post", error);
  }
};
