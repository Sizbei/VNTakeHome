import { ApolloServer, gql } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
import { resolvers as userResolvers } from './resolvers/user.resolver';
import { resolvers as movieResolvers } from './resolvers/movie.resolver';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const typeDefs = gql`
  type User {
    id: Int
    userName: String
    email: String
    password: String
  }

  type Movie {
    id: Int
    movieName: String
    description: String
    director: String
    releaseDate: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type MovieConnection {
    movies: [Movie]
    totalCount: Int!
    totalPages: Int!
    currentPage: Int!
  }

  input MovieFilters {
    movieName: String
    director: String
    description: String
  }

  input SortOptions {
    field: String!
    order: String!
  }

  type Query {
    users: [User]
    movies(
      page: Int
      pageSize: Int
      filters: MovieFilters
      sortBy: SortOptions
    ): MovieConnection
    movie(id: Int!): Movie
  }

  type Mutation {
    signUp(userName: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    changePassword(
      email: String!
      currentPassword: String!
      newPassword: String!
    ): User
    createMovie(
      movieName: String!
      description: String!
      director: String!
      releaseDate: String!
    ): Movie
    updateMovie(
      id: Int!
      movieName: String
      description: String
      director: String
      releaseDate: String
    ): Movie
    deleteMovie(id: Int!): Movie
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers: [userResolvers, movieResolvers],
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    try {
      const decoded = jwt.verify(token, 'secretKey');
      const userId = (decoded as { userId: number }).userId;
      const user = prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      return { user };
    } catch (error) {
      return {};
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});
