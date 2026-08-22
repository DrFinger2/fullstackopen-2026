import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";

export const GET_BOOK_COUNT = gql`
  query {
    bookCount
  }
`;

export const GET_AUTHOR_COUNT = gql`
  query {
    authorCount
  }
`;

export const GET_ALL_BOOKS = gql`
  query GetAllBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      title
      published
      author {
        name
        born
      }
      genres
    }
  }
`;

export const GET_ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
        born
      }
      published
      genres
    }
  }
`;

export const EDIT_AUTHOR = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;
