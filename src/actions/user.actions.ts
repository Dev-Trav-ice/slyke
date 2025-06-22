"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const syncUser = async () => {
  try {
    const user = await currentUser();
    const { userId } = await auth();

    if (!user || !userId) return;

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (existingUser) {
      return existingUser;
    }

    const newUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        image: user.imageUrl,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.log("Error syncing user", error);
  }
};

export const getProfile = async (username: string) => {
  try {
    const currentUser = await dbUser();

    if (!currentUser) return;

    const profile = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        posts: {
          include: { user: true, likes: true, comments: true },
        },
        followers: true,
        following: true,
      },
    });

    if (!profile) return;

    const postsLiked = await profile.posts.map((post) => ({
      ...post,
      likeCount: post.likes.length,
      isLiked: post.likes.some((like) => like.userId === currentUser.id),
    }));

    return {
      ...profile,
      posts: postsLiked,
    };
  } catch (error) {
    console.log("error fetching user profile", error);
  }
};

export const dbUser = async () => {
  const user = await currentUser();
  const userId = await auth();

  if (!user || !userId) return;

  const loggedInUser = await prisma.user.findUnique({
    where: { clerkId: user?.id },
  });

  return loggedInUser;
};

export const followUnfollow = async (formData: FormData): Promise<void> => {
  try {
    const targetUserId = formData.get("targetUserId")?.toString();

    if (!targetUserId) return;

    const currentUser = await dbUser();

    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: currentUser?.id,
        followingId: targetUserId,
      },
    });

    if (existingFollow) {
      await prisma.follow.deleteMany({
        where: {
          followerId: currentUser?.id as string,
          followingId: targetUserId as string,
        },
      });
    } else {
      await prisma.follow.create({
        data: {
          followerId: currentUser?.id as string,
          followingId: targetUserId as string,
        },
      });
    }

    revalidatePath("/");
    revalidatePath(`/profile/${targetUserId}`);
  } catch (error) {
    console.log("error trying to follow or unfollow", error);
  }
};

export const editProfile = async (formData: FormData): Promise<void> => {
  try {
    const bio = formData.get("bio")?.toString();
    const website = formData.get("website")?.toString();
    const location = formData.get("location")?.toString();
    const currentUser = await dbUser();

    if (!bio || !website || !location || !currentUser) return;

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        bio,
        location,
        website,
      },
    });

    revalidatePath(`/profile/${currentUser.username}`);
  } catch (error) {
    console.log("error editing profile", error);
  }
};
