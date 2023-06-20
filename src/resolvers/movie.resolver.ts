import { PrismaClient } from '@prisma/client';
import { release } from 'os';

const prisma = new PrismaClient();

const DEFAULT_PAGE_SIZE = 10;

interface MovieFilters {
  movieName?: string;
  director?: string;
  description?: string;
}

interface SortOptions {
  field?: string;
  order?: string;
}

export const resolvers = {
  Query: {
    movies: async (
      _: any,
      args: {
        page?: number;
        pageSize?: number;
        filters?: MovieFilters;
        sortBy?: SortOptions;
      }
    ) => {
      const { page = 1, pageSize = DEFAULT_PAGE_SIZE, filters, sortBy } = args;

      const skip = (page - 1) * pageSize;

      const prismaFilters: any = {};

      if (filters) {
        if (filters.movieName) {
          prismaFilters.movieName = {
            contains: filters.movieName,
          };
        }
        if (filters.director) {
          prismaFilters.director = {
            contains: filters.director,
          };
        }
        if (filters.description) {
          prismaFilters.description = {
            contains: filters.description,
          };
        }
      }

      const prismaSort: any = {};

      if (sortBy && sortBy.field && sortBy.order) {
        prismaSort[sortBy.field] = sortBy.order.toLowerCase();
      }

      try {
        const movies = await prisma.movie.findMany({
          skip,
          take: pageSize,
          where: prismaFilters,
          orderBy: prismaSort,
        });

        const totalMovies = await prisma.movie.count({ where: prismaFilters });

        return {
          movies,
          totalCount: totalMovies,
          totalPages: Math.ceil(totalMovies / pageSize),
          currentPage: page,
        };
      } catch (error) {
        throw new Error('Failed to fetch movies');
      }
    },
    movie: async (_: any, args: { id: number }) => {
      const { id } = args;

      try {
        const movie = await prisma.movie.findUnique({
          where: {
            id,
          },
        });

        if (!movie) {
          throw new Error('Movie not found');
        }

        return movie;
      } catch (error) {
        throw new Error('Failed to fetch movie');
      }
    },
  },
  Mutation: {
    createMovie: async (
      _: any,
      args: {
        movieName: string;
        description: string;
        director: string;
        releaseDate: Date;
      },
      context: any
    ) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }

      const { movieName, description, director, releaseDate } = args;
      const parsedReleaseDate = new Date(releaseDate);

      try {
        return prisma.movie.create({
          data: {
            movieName,
            description,
            director,
            releaseDate: parsedReleaseDate,
          },
        });
      } catch (error) {
        throw new Error('Failed to create movie');
      }
    },
    updateMovie: async (
      _: any,
      args: {
        id: number;
        movieName?: string;
        description?: string;
        director?: string;
        releaseDate?: Date;
      },
      context: any
    ) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }

      const { id, movieName, description, director, releaseDate } = args;
      const movie = await prisma.movie.findUnique({
        where: {
          id,
        },
      });

      if (!movie) {
        throw new Error('Movie not found');
      }

      let parsedReleaseDate: Date | undefined;

      if (releaseDate) {
        parsedReleaseDate = new Date(releaseDate);
      } else {
        parsedReleaseDate = undefined;
      }

      try {
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
      } catch (error) {
        throw new Error('Failed to update movie');
      }
    },
    deleteMovie: async (_: any, args: { id: number }, context: any) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }
      const { id } = args;
      const movie = await prisma.movie.findUnique({
        where: {
          id,
        },
      });

      if (!movie) {
        throw new Error('Movie not found');
      }
      try {
        return prisma.movie.delete({
          where: {
            id,
          },
        });
      } catch (error) {
        throw new Error('Failed to delete movie');
      }
    },
  },
};
