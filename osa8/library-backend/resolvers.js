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

      if (args.genre) {
        filter.genres = args.genre;
      }
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) return [];
        filter.author = author._id;
      }
      return Book.find(filter).populate("author");
    },

    allAuthors: async () => {
      const counts = await Book.aggregate([
        { $group: { _id: "$author", count: { $sum: 1 } } },
      ]);

      const authorToCount = {};
      counts.forEach((entry) => {
        const id = entry._id;
        if (id) {
          authorToCount[id.toString()] = entry.count;
        }
      });

      const authors = await Author.find({});
      return authors.map((author) => ({
        name: author.name,
        born: author.born,
        bookCount: authorToCount[author._id.toString()] || 0,
      }));
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
