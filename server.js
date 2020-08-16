const express = require("express");
// const {graphqlHTTP} = require("express-graphql")
// const mongoConnect = require("./util/database");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/graphql', graphqlHTTP({
//   schema,
//   graphiql: true
// }));

// app.listen(4000, () => {
//   console.log("Listening");
// });

// mongoConnect(() => {
//   app.listen(4000);
// });

mongoose
  .connect(
    "mongodb+srv://julius:julius@cluster0.4pjb6.mongodb.net/home_service?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(4000);
  })
  .catch((err) => console.log(err));
