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
type Service{
    _id:ID!
    title:String!
    imageUrl:String!
    description:String!
    createdAt:String!
    updatedAt:String!
    vendors: [Vendor!]!

}
type Vendor{
    _id:ID!
    name:String!
    imageUrl:String!
    description:String!
    isAvalaible:Boolean!
    service: Service!
    createdAt:String!
    updatedAt:String!
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
input VendorInputData{
      
     name:String!
     imageUrl:String!
     description:String!
     isAvalaible:Boolean!
}
type AuthData {
    token: String!
    userId: String!
}
type ServiceData{
     services:[Service!]!
}

type RootQuery {
    services:ServiceData!
    service(id:ID!):Service!
    vendor(id:ID!):Vendor!

}
type RootMutation {
    createUser(userInput: UserInputData): User!
    login(email: String!, password: String!): AuthData!
    createService(serviceInput:ServiceInputData):Service!
    createVendor(vendorInput:VendorInputData):Vendor!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
