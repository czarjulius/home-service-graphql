const graphql = require("graphql");
const axios = require("axios");

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

const ServiceType = new GraphQLObjectType({
  name: "Service",
  fields: {
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    imageUrl: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    service: {
      type: ServiceType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/services/${args.id}`)
        .then(resp => resp.data)
      },
    },
  },
});

module.exports = new GraphQLSchema({
    query:RootQuery 
})