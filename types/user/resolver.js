import { combineResolvers } from "graphql-resolvers";
import AuthMiddleWare from "../../middleware/index";
import AuthHelper from '../../helper/Auth';
import User from "../../models/user";


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
  Query: {
    me: () => 'Hello',
  },
  Mutation: {
    // createUser: combineResolvers(
    //   AuthMiddleWare.userExist,
    //   // AuthMiddleWare.validateSignUp,
    //   // create,
    // ),
    login,
  },
};
