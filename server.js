import express from "express";
import { ApolloServer } from 'apollo-server-express';
import bodyParser from "body-parser";
import "dotenv/config";
import cors from 'cors';
import { connect } from "./models/db";
import { schemaObject, resolvers } from './types';
import AuthMiddleware from './middleware/index'

const app = express();
app.use(cors());
app.use('/graphql', bodyParser.json());

app.get('/', (req, res) => res.status(200).json({ message: 'Welcome ' }));

(async () => {
  const schemaTypes = await schemaObject();
  const server = new ApolloServer({
    resolvers,
    typeDefs: schemaTypes,
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
})();


