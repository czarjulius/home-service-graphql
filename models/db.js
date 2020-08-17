import mongoose from "mongoose";

const { DB_URI } = process.env;

export const connect = () => {
  return mongoose.connect(DB_URI);
};
