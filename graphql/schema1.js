import { gql } from "apollo-server";

module.exports = gql`
type User{
      _id:ID!
      firstname: String!
      lastname: String!
      address: String!
      phone: String!
      email: String!
      token: String!
      password: String!
      createdAt:String!
      updatedAt:String!
      orders: [Order!]!

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
type Order{
    _id:ID!
    address:String!
    description:String!
    status:String!
    date:String!
    vendor: Vendor!
    user: User!
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
input OrderInputData{
     address:String!
     description:String!
     vendorId:String!
     date:String!
    }
type AuthData {
    token: String!
    userId: String!
}
type ServiceData{
     services:[Service!]!
}
type OrderData{
     orders:[Order!]!
}

type RootQuery {
    services:ServiceData!
    service(id:ID!):Service!
    userOrder(id:ID!):OrderData!
    vendor(id:ID!):Vendor!

}
type RootMutation {
    createUser(userInput: UserInputData): User!
    login(email: String!, password: String!): AuthData!
    createService(serviceInput:ServiceInputData):Service!
    createVendor(vendorInput:VendorInputData):Vendor!
    createOrder(orderInput:OrderInputData):Order!
}

query: RootQuery
mutation: RootMutation

`;
