import { combineResolvers } from "graphql-resolvers";
import AuthMiddleWare from "../middleware/auth";
import AuthHelper from '../../helper/Auth';
import User from "../../models/user";

const createUser = async ({ userInput }, req) => {
  const errors = [];
  if (!validator.isEmail(userInput.email)) {
    errors.push({ message: "E-Mail is invalid." });
  }
  if (
    validator.isEmpty(userInput.password) ||
    !validator.isLength(userInput.password, { min: 5 })
  ) {
    errors.push({ message: "Password too short!" });
  }
  if (errors.length > 0) {
    const error = new Error("Invalid input.");
    error.data = errors;
    error.code = 422;
    throw error;
  }

  const existingUser = await User.findOne({ email: userInput.email });
  if (existingUser) {
    const error = new Error(`User with email ${userInput.email} exist already`);
    error.data = errors;
    error.code = 400;
    throw error;
  }
  const hashedPw = await AuthHelper.hashPassword(password),
  const user = new User({
    firstname: userInput.firstname,
    lastname: userInput.lastname,
    address: userInput.address,
    phone: userInput.phone,
    email: userInput.email,
    password: hashedPw,
  });

  const createdUser = await user.save();
  const token = AuthHelper.generateToken(createdUser._id.toString(), createdUser.email);

  return {
    ...createdUser._doc,
    _id: createdUser._id.toString(),
    token,
    createdAt: createdUser.createdAt.toISOString(),
    updatedAt: createdUser.updatedAt.toISOString(),
  };
};
const login = async (_, { email, password }) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    const error = new Error("User not found.");
    error.code = 401;
    throw error;
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    const error = new Error("Password is incorrect.");
    error.code = 401;
    throw error;
  }
  const token = AuthHelper.generateToken(user._id.toString(), user.email);

  return { token: token, userId: user._id.toString() };
};

export default {
  Mutation: {
    createUser: combineResolvers(
      AuthMiddleWare.userExist,
      // AuthMiddleWare.validateSignUp,
      create,
    ),
    login,
  },
};
