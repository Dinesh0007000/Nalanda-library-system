const { gql } = require('graphql-tag');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    isbn: String!
    publicationDate: String
    genre: String
    copies: Int!
  }

  type Borrow {
    id: ID!
    user: User!
    book: Book!
    borrowDate: String!
    returnDate: String
  }

  type MostBorrowedBook {
    book: Book!
    count: Int!
  }

  type ActiveMember {
    user: User!
    count: Int!
  }

  type BookAvailability {
    totalBooks: Int!
    borrowed: Int!
    available: Int!
  }

  type Query {
    listBooks(page: Int, limit: Int, genre: String, author: String): [Book!]!
    borrowHistory: [Borrow!]!
    mostBorrowedBooks: [MostBorrowedBook!]!
    activeMembers: [ActiveMember!]!
    bookAvailability: BookAvailability!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, role: String): String!
    login(email: String!, password: String!): String!
    addBook(title: String!, author: String!, isbn: String!, publicationDate: String, genre: String, copies: Int): Book!
    updateBook(id: ID!, title: String, author: String, isbn: String, publicationDate: String, genre: String, copies: Int): Book!
    deleteBook(id: ID!): String!
    borrowBook(bookId: ID!): Borrow!
    returnBook(id: ID!): Borrow!
  }
`;

module.exports = typeDefs;