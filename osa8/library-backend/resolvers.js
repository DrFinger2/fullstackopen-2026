const Book = require("./models/BookModel.js");
const Author = require("./models/AuthorModel.js");

const resolvers = {
  Query: {
    bookCount: async () => {
      return Book.collection.countDocuments();
    },
    authorCount: async () => {
      return Author.collection.countDocuments();
    },
    allBooks: async (parent, args) => {
      return Book.find({ ...args });
    },
    allAuthors: async () => {
      const books = await Book.find({});
      const authorToCount = {};

      books.forEach((book) => {
        authorToCount[book.author] = authorToCount[book.author]
          ? authorToCount[book.author] + 1
          : 1;
      });

      const authors = await Author.find({});
      return authors.map((author) => ({
        name: author.name,
        born: author.born,
        bookCount: authorToCount[author.name] || 0,
      }));
    },
  },

  Mutation: {
    addBook: async (parent, args) => {
      const author = await Author.findOne({ name: args.author });
      if (!author) {
        const newAuthor = new Author({ name: args.author });
        await newAuthor.save();
      }
      const book = new Book({ ...args, author: author._id });
      await book.save();
      await book.populate("author");
      return book;
    },

    editAuthor: async (parent, args) => {
      const author = Author.find({ name: args.name });
      if (!author) {
        return null;
      }

      author.born = args.setBornTo; // object - so modifying it is by reference
      return author.save();
    },
  },
};

module.exports = resolvers;
