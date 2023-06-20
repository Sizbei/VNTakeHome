# Movie Management API

The Movie Management API is a GraphQL-based server that allows you to manage movies. You can perform various operations such as retrieving movies, adding new movies, updating existing movies, and deleting movies. The API is built using Apollo Server and Prisma, providing a robust and scalable solution for movie management.
Features

    - Fetch a list of movies based on filters and sorting options
    - Retrieve detailed information about a specific movie by its ID
    - Create a new movie with a title, description, director, and release date
    - Update an existing movie's details
    - Delete a movie by its ID
    - User Authentication: Users can sign up and sign in to access protected operations such as creating, updating, and deleting movies.
    - change password on users

## Getting Started

To get started using the Movie Management API, follow these steps:

    Clone the repository: git clone <repository-url>
    Install dependencies: npm install
    Set up the database connection by configuring the Prisma client 
    Start the servers: npm run dev
    The GraphQL playground will be available at http://localhost:4000/graphql.
    You can now perform GraphQL queries and mutations using the following examples.

# Example Queries and Mutations for graphql


## Sign up a new user
```
mutation {
  signUp(userName: "JohnDoe", email: "john.doe@example.com", password: "password123") {
    token
    user {
      id
      userName
      email
    }
  }
}
```
## Login with user credentials
mutation {
  login(email: "john.doe@example.com", password: "password123") {
    token
    user {
      id
      userName
      email
    }
  }
}

## Change user password
```
mutation {
  changePassword(email: "john.doe@example.com", currentPassword: "password123", newPassword: "newpassword123") {
    id
    userName
    email
  }
}
```


## Fetching a list of movies
```
query GetMovies {
  movies {
    movies {
      id
      movieName
      director
      releaseDate
    }
    totalCount
    totalPages
    currentPage
  }
}
```

## Retrieving multiple movies with filters
```
query GetMovies($page: Int, $pageSize: Int, $filters: MovieFilters, $sortBy: SortOptions) {
  movies(page: 1, pageSize: $pageSize, filters: {
      description: "Two imprisoned men bond over several years, finding solace and eventual redemption through acts of common decency."
    }, sortBy: {field: "id", 
      order: "desc"}) {
    movies {
      id
      movieName
      description
      director
      releaseDate
    }
    totalCount
    totalPages
    currentPage
  }
}
```

## Retrieving a movie by ID
```
query GetMovie {
  movie(id: 1) {
    id
    movieName
    description
    director
    releaseDate
  }
}
```

## Creating a new movie
```
mutation CreateMovie {
  createMovie(
    movieName: "The Shawshank Redemption"
    description: "Two imprisoned men bond over several years, finding solace and eventual redemption through acts of common decency."
    director: "Frank Darabont"
    releaseDate: "1994-10-14"
  ) {
    id
    movieName
    description
    director
    releaseDate
  }
}
```
## Updating a movie
```
mutation UpdateMovie {
  updateMovie(
    id: 1
    description: "A new description for the movie"
    director: "New Director"
  ) {
    id
    movieName
    description
    director
    releaseDate
  }
}
```
## Deleting a movie
```
mutation DeleteMovie {
  deleteMovie(id: 1) {
    id
    movieName
    director
    releaseDate
  }
}
```
