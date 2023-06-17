import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const generateToken = (user: User) => {
  const token = jwt.sign({ userId: user.id }, "your-secret-key", {
    expiresIn: "1h",
  });
  return token;
};

export const resolvers = {
  Query: {
    users: async () => {
      return prisma.user.findMany();
    },
  },
  Mutation: {
    signUp: async (_: any, args: { userName: string; email: string; password: string }) => {
      const { userName, email, password } = args;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          userName,
          email,
          password: hashedPassword,
        },
      });
      const token = generateToken(user);
      return {
        token,
        user,
      };
    },
    login: async (_: any, args: { email: string; password: string }) => {
      const { email, password } = args;
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new Error("Invalid login credentials");
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error("Invalid login credentials");
      }
      const token = generateToken(user);
      return {
        token,
        user,
      };
    },
  },
};