import bycrpt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthHelper {
  static hashPassword(password) {
    return bycrpt.hashSync(password, 10);
  }

  static passwordMatch(password, hashPassword) {
    return bycrpt.compareSync(password, hashPassword);
  }

  static generateToken(userId, email) {
    return jwt.sign({
      userId,
      email,
    }, process.env.JWT_SECRET, {
      expiresIn: '48h',
    });
  }
}

export default AuthHelper;