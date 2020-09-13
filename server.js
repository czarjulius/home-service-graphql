import express from "express";
import { ApolloServer } from 'apollo-server-express';

import bodyParser from "body-parser";
import "dotenv/config";
const cors = require("cors");

import { connect } from "./models/db";
import graphqlSchema from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import AuthMiddleware from './middleware/index'

const app = express();
app.use(cors());
app.use('/graphql', bodyParser.json());

app.get('/', (req, res) => res.status(200).json({ message: 'Welcome ' }));

const server = new ApolloServer({
  typeDefs: graphqlSchema,
  resolvers,
  graphiql: true,
  context: async ({ req }) => {
    const { user, error } = await AuthMiddleware.verifyToken(req);
    
    return {
      user,
      error,
    };
  },
});

server.applyMiddleware({ app, path: '/graphql' });


const { PORT } = process.env;

connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => console.log("Error connecting to Mongo: ", err));

export default app;
