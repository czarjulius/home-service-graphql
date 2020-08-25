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
input ServiceInputData{
      
     title:String!
     imageUrl:String!
     description:String!
}

type AuthData {
    token: String!
    userId: String!
}
type Service{
     _id:ID!
     title:String!
     imageUrl:String!
     description:String!
     createdAt:String!
     updatedAt:String!
}
type ServiceData{
     services:[Service!]!
}

type RootQuery {
    services:ServiceData!
    service(id:ID!):Service!

}
type RootMutation {
    createUser(userInput: UserInputData): User!
    login(email: String!, password: String!): AuthData!
    createService(serviceInput:ServiceInputData):Service!

}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
