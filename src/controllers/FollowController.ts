import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class FollowController {
  static async followUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user, followingId } = req.body;
      const followerId = user.id;

      if (followerId === followingId) {
        res.status(400).json({ message: 'Cannot follow yourself' });
        res.end();
        return;
      }

      const existingFollow = await prisma.userFollows.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });

      if (existingFollow) {
        res.status(400).json({ message: 'Already following' });
        res.end();
        return;
      }

      const followResult = await followUser(followerId, followingId);

      if (!followResult) {
        res.status(424).json({ message: 'Failed to follow user' });
        res.end();
        return;
      }

      res.status(200).json({ message: 'User followed' });
      res.end();
    } catch (error) {
      next(error);
    }
  }

  static async unfollowUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user, followingId } = req.body;
      const followerId = user.id;

      const existingFollow = await prisma.userFollows.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });

      if (!existingFollow) {
        res.status(400).json({ message: 'Not following' });
        res.end();
        return;
      }

      const unfollowResult = await unfollowUser(followerId, followingId);

      if (!unfollowResult) {
        res.status(424).json({ message: 'Failed to unfollow user' });
        res.end();
        return;
      }

      res.status(200).json({ message: 'User unfollowed' });
      res.end();
    } catch (error) {
      next(error);
    }
  }
}

const followUser = async (
  followerId: string,
  followingId: string
): Promise<boolean> => {
  try {
    const follow = await prisma.userFollows.create({
      data: {
        followerId,
        followingId,
      },
    });
    if (!follow) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

const unfollowUser = async (
  followerId: string,
  followingId: string
): Promise<boolean> => {
  try {
    const isDeleted = await prisma.userFollows.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    if (!isDeleted) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export default FollowController;
