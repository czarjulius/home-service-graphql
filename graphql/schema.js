const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type User{
    _id:ID!
    firstname: String!
      lastname: String!
      address: String!
      phone: String!
      email: String!
      password: String!
}
input UserInputData{
    firstname: String!
      lastname: String!
      address: String!
      phone: String!
      email: String!
      password: String!
}

type AuthData {
    token: String!
    userId: String!
}
type RootQuery {
    login(email: String!, password: String!): AuthData!
}
type RootMutation {
    createUser(userInput: UserInputData): User!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
