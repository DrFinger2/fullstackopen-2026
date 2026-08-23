const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const Book = require("./models/BookModel.js");
const Author = require("./models/AuthorModel.js");
const User = require("./models/UserModel.js");

class UserInputError extends GraphQLError {
  constructor(message, invalidArgs, error) {
    super(message, {
      extensions: {
        code: "BAD_USER_INPUT",
        invalidArgs: invalidArgs,
        error: error,
      },
    });
    this.name = "UserInputError";
  }
}

class UserAuthError extends GraphQLError {
  constructor() {
    super("Not authenticated", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }
}

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser;
    },
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
        id: author.id,
        name: author.name,
        born: author.born,
        bookCount: authorToCount[author._id.toString()] || 0,
      }));
    },
  },

  Mutation: {
    addBook: async (parent, args, context) => {
      if (!context.currentUser) {
        throw new UserAuthError();
      }

      let authorInDb = await Author.findOne({ name: args.author });
      if (!authorInDb) {
        authorInDb = new Author({ name: args.author });
        try {
          await authorInDb.save();
        } catch (error) {
          throw new UserInputError("Saving author failed", args.author, error);
        }
      }

      const book = new Book({ ...args, author: authorInDb._id });

      try {
        await book.save();
        await book.populate("author");
      } catch (error) {
        throw new UserInputError("Saving book failed", args, error);
      }

      return book;
    },

    editAuthor: async (parent, args, context) => {
      if (!context.currentUser) {
        throw new UserAuthError();
      }

      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }

      author.born = args.setBornTo;
      try {
        await author.save();
      } catch (error) {
        throw new UserInputError("Editing book failed", args, error);
      }
      return author;
    },

    createUser: async (parent, args) => {
      const { username, favoriteGenre } = args;
      const user = new User({ username, favoriteGenre });
      try {
        await user.save();
      } catch (error) {
        throw new UserInputError("Creating user failed", args, error);
      }

      return user;
    },

    login: async (parent, args) => {
      const { username, password } = args;
      const user = await User.findOne({ username: username });

      if (!user || password !== "secret") {
        throw new UserInputError("Wrong credentials", args);
      }

      const tokenDetails = { username: user.username, id: user._id };
      const secret = process.env.JWT_SECRET;

      return { value: jwt.sign(tokenDetails, secret) };
    },

    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError("_resetDatabase is only available in test mode");
      }
      await Author.deleteMany({});
      await Book.deleteMany({});
      await User.deleteMany({});
      return true;
    },
  },
};

module.exports = resolvers;
