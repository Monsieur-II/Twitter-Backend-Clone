import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const validateNewUserAsync = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, username, email, dateOfBirth } = req.body;
    if (!name || !username || !email || !dateOfBirth) {
      res.status(400).json({ message: 'Invalid request' });
      res.end();
      return;
    }

    // verify age
    const dob = new Date(dateOfBirth);
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
    next();
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' });
    res.end();
  }
};

const validateUpdateUserAsync = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, username, imageUrl, bio, location, website } = req.body;

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
    const existingUsername = await prisma.user.findUnique({
      where: {
        userName: username,
      },
    });
    if (existingUsername && existingUsername.id !== id) {
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
    res.status(500).json({ message: 'Something went wrong, please try again' });
    res.end();
  }
};

function isValidHttpUrl(string: any) {
  try {
    const url = new URL(string);
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

module.exports = { validateNewUserAsync, validateUpdateUserAsync };
