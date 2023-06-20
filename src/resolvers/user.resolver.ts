import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const generateToken = (user: User) => {
  const token = jwt.sign({ userId: user.id }, "secretKey", {
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

      try {
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
          user: {
            id: user.id,
            userName: user.userName,
            email: user.email,
          },
        };
      } catch (error) {
        throw new Error("Failed to signup");
      }

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
    changePassword: async (_: any, args: { email: string; currentPassword: string; newPassword: string }, context: any) => {
      const { email, currentPassword, newPassword } = args;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        throw new Error("Invalid current password");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      try {
        return prisma.user.update({
          where: {
            email,
          },
          data: {
            password: hashedPassword,
          },
        });
      } catch (error) {
        throw new Error("Failed to change password");
      }
},
  },
};
