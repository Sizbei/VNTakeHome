import { PrismaClient } from "@prisma/client";
import { release } from "os";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    movies: async () => {
      return prisma.movie.findMany();
    },
    movie: async (_: any, args: { id: number }) => {
      const { id } = args;
      return prisma.movie.findUnique({
        where: {
          id,
        },
      });
    },
  },
  Mutation: {
    createMovie: async (_: any, args: { movieName: string; description: string; director: string; releaseDate: Date }, context: any) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      const { movieName, description, director, releaseDate } = args;
      const parsedReleaseDate = new Date(releaseDate);
      return prisma.movie.create({
        data: {
          movieName,
          description,
          director,
          releaseDate: parsedReleaseDate,
        },
      });
    },
    updateMovie: async (_: any, args: { id: number; movieName?: string; description?: string; director?: string; releaseDate?: Date }, context: any) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      const { id, movieName, description, director, releaseDate } = args;
      let parsedReleaseDate: Date | undefined;
      if (releaseDate){
        parsedReleaseDate = new Date(releaseDate);
      }else {
        parsedReleaseDate = undefined;
      }
      return prisma.movie.update({
        where: {
          id,
        },
        data: {
          movieName,
          description,
          director,
          releaseDate: parsedReleaseDate,
        },
      });
    },
    deleteMovie: async (_: any, args: { id: number }, context: any) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      const { id } = args;
      return prisma.movie.delete({
        where: {
          id,
        },
      });
    },
  },
};
