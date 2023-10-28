const userTypeDefs = `#graphql
  type User {
    id: ID!
    walletId: String!
    fullName: String!
    email: String!
    businessName: String!
    profilePic: String
    businessLogo: String
  }

  input UserInput {
    id: ID!
    walletId: String!
    fullName: String!
    email: String!
    businessName: String!
    profilePic: String
    businessLogo: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User!
  }

  type Mutation {
    createUser(input: UserInput!): User!
    loginUser(walletId: String!): User!
    updateUser(_id: ID!, input: UserInput!): User!
    deleteUser(_id: ID!): User!
  }
`;

export default userTypeDefs;
