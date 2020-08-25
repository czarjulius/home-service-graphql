import express from "express";
import { graphqlHTTP } from "express-graphql";
import bodyParser from "body-parser";
import "dotenv/config";
const cors = require("cors");

import { connect } from "./models/db";
import graphqlSchema from "./graphql/schema";
import graphqlResolver from "./graphql/resolvers";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.statusCode(200);
  }
  next();
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occurred.";

      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

const { PORT } = process.env;

connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => console.log("Error connecting to Mongo: ", err));

export default app;
