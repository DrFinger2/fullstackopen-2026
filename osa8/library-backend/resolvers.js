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
      const filter = {};
      if (args.genre) filter.genres = args.genre;

      let books = await Book.find(filter).populate("author");
      if (args.author) {
        books = books.filter((b) => b.author && b.author.name === args.author);
      }
      return books;
    },
    allAuthors: async () => {
      const books = await Book.find({}).populate("author");
      const authorToCount = {};

      books.forEach((book) => {
        authorToCount[book.author.name] = authorToCount[book.author.name]
          ? authorToCount[book.author.name] + 1
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
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        await author.save();
      }
      const book = new Book({ ...args, author: author._id });
      await book.save();
      await book.populate("author");
      return book;
    },

    editAuthor: async (parent, args) => {
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }

      author.born = args.setBornTo;
      return await author.save();
    },
  },

  Book: {
    author: (root) => (root.author ? root.author.name : null),
  },
};

module.exports = resolvers;
