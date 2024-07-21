import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const validateNewUserAsync = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, username, email, dateofbirth, password } = req.body;
    if (!name || !username || !email || !dateofbirth || !password) {
      res.status(400).json({ message: 'Invalid request' });
      res.end();
      return;
    }

    // verify age
    const dob = new Date(dateofbirth);
    const now = new Date();
    const diff = now.getTime() - dob.getTime();
    const age = Math.floor(diff / 31536000000);
    if (age < 13) {
      res.status(400).json({ message: 'User must be at least 13 years old' });
      res.end();
      return;
    }

    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingEmail) {
      res.status(400).json({ message: 'User with email already exists' });
      res.end();
      return;
    }

    const existingUsername = await prisma.user.findUnique({
      where: {
        userName: username,
      },
    });
    if (existingUsername) {
      res.status(400).json({ message: 'User with username already exists' });
      res.end();
      return;
    }
    var hashedPassword = await hashPassword(password);
    req.body.hashedPassword = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
};

const validateUpdateUserAsync = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { username, imageUrl, website } = req.body;

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
    const existingUser = await prisma.user.findUnique({
      where: {
        userName: username,
      },
    });
    if (existingUser && existingUser.id !== id) {
      res.status(400).json({ message: 'User with username already exists' });
      res.end();
      return;
    }

    if (imageUrl && !isValidHttpUrl(imageUrl)) {
      res.status(400).json({ message: 'Invalid image url' });
      res.end();
      return;
    }
    if (website && !isValidHttpUrl(website)) {
      res.status(400).json({ message: 'Invalid website url' });
      res.end();
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};

function isValidHttpUrl(uri: any) {
  try {
    const url = new URL(uri);
    const validProtocols = ['http:', 'https:'];

    if (!validProtocols.includes(url.protocol)) {
      return false;
    }

    const domainParts = url.hostname.split('.');
    const tld = domainParts[domainParts.length - 1];
    const validTLDs = ['com', 'net', 'org', 'io'];

    if (!validTLDs.includes(tld)) {
      return false;
    }

    return true;
  } catch (_) {
    return false;
  }
}

async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error occurred while saving user');
  }
}

module.exports = { validateNewUserAsync, validateUpdateUserAsync };
