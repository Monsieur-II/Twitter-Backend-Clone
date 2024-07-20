import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class UsersController {
  static async postUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, username, email, hashedPassword } = req.body;
      const result = await prisma.user.create({
        data: {
          name,
          userName: username,
          email,
          password: hashedPassword,
        },
      });
      if (!result) {
        res.status(424).json({ message: 'Failed to create user' });
        res.end();
        return;
      }
      res.status(201).json({
        id: result.id,
        name: result.name,
        username: result.userName,
        email: result.email,
      });

      res.end();
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
      res.end();
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        res.end();
        return;
      }
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
      res.end();
    } catch (error) {
      next(error);
    }
  }

  static async putUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { name, username, imageUrl, bio, location, website } = req.body;
      const result = await prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          userName: username,
          imageUrl,
          bio,
          location,
          website,
        },
      });
      if (!result) {
        res.status(500).json({ message: 'Unable to update user' });
        res.end();
        return;
      }
      res.status(200).json({ result });
      res.end();
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (req.body.userId !== id) {
        res.status(403).json({ message: 'Unauthorized' });
        res.end();
        return;
      }
      const userExists = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!userExists) {
        res.status(404).json({ message: 'User not found' });
        res.end();
        return;
      }

      await prisma.user.delete({
        where: {
          id,
        },
      });
      res.status(200).json({ message: 'User deleted successfully' });
      res.end();
    } catch (error) {
      next(error);
    }
  }
}

export default UsersController;
