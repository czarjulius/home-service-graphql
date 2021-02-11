import jwt from "jsonwebtoken";
import { skip } from "graphql-resolvers";
import { ForbiddenError } from "apollo-server";

class AuthMiddleware {
  static async verifyToken(req) {
    try {
      const token = req.headers.authorization;
      const decoded = await jwt.verify(token, "secretkey");
      return {
        user: { ...decoded },
      };
    } catch (error) {
      return { error };
    }
  }

  static isAuthenticated(parent, args, { user }) {
    return user ? skip : new ForbiddenError("Not authenticated as user.");
  }

  static async userExist(_, { input: { email } }) {
    const user = await User.findOne({ where: { email } });
    return !user
      ? skip
      : {
          user: null,
          token: null,
          errors: [
            {
              field: "email",
              message: "User with this email already exists",
            },
          ],
        };
  }
}

export default AuthMiddleware;
