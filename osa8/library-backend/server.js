const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const getUserFromAuthHeader = require("./utils/getUserFromAuthHeader");
const resolvers = require("./resolvers");
const typeDefs = require("./schema");

const startServer = (port) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }) => {
      const authorization = req.headers.authorization;
      const secret = process.env.JWT_SECRET;
      const user = await getUserFromAuthHeader(authorization, secret);
      return { currentUser: user };
    },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
};

module.exports = startServer;
