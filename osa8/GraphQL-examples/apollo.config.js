module.exports = {
  client: {
    service: {
      name: "my-app",
      url: process.env.GRAPHQL_ENDPOINT || "http://localhost:4000/graphql",
    },
    // Add this section:
    includes: [
      "./src/**/*.js", // JavaScript files in src
      "./src/**/*.ts", // TypeScript files
      "./src/**/*.tsx", // React TypeScript files
      "./**/*.graphql", // Standalone .graphql files
      "./**/*.gql", // Standalone .gql files
    ],
    excludes: [
      "**/node_modules/**",
      "**/__tests__/**",
      "**/*.test.*",
      "**/*.spec.*",
    ],
  },
};
