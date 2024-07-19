import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class UsersController {
  static async postUser(req: Request, res: Response): Promise<void> {
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
      res.status(500).json({ message: 'Unable to create user' });
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
  }

  static async getUsers(req: Request, res: Response): Promise<void> {
    const users = await prisma.user.findMany();
    res.json(users);
    res.end();
  }

  static async putUser(req: Request, res: Response): Promise<void> {
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
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
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
    res.status(204).json({ message: 'User deleted successfully' });
    res.end();
  }
}

export default UsersController;
