const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = require("@/libs/prisma");
const { BCRYPT_SALT_ROUNDS } = require("@/config/constant");
const authConfig = require("@/config/auth");
const randomString = require("@/utils/randomString");

class AuthService {
  async handleRegister(email, password, userAgent) {
    // Hash password with bcrypt
    const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
      },
    });

    const userTokens = await this.generateUserTokens(user, userAgent);

    return userTokens;
  }

  async handleLogin(email, password, userAgent) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return [true, null];

    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      const userTokens = await this.generateUserTokens(user, userAgent);
      return [null, userTokens];
    }

    return [true, null];
  }

  async handleRenewTokens(token, userAgent) {
    // đk để lấy ra refreshToken là chưa dc revoke
    const refreshToken = await prisma.refreshToken.findUnique({
      where: {
        token,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    console.log("🚀 ~ AuthService ~ renewTokens ~ refreshToken:", refreshToken);

    if (!refreshToken) {
      return [true, null];
    }

    const user = { id: refreshToken.userId };
    const userTokens = await this.generateUserTokens(user, userAgent);

    await prisma.refreshToken.update({
      where: {
        id: refreshToken.id,
      },
      data: {
        isRevoked: true,
      },
    });

    return [null, userTokens];
  }

  generateAccessToken(user) {
    const expiredAt = Math.floor(Date.now() / 1000) + authConfig.accessTokenTTL;

    const accessToken = jwt.sign(
      {
        sub: user.id,
        exp: expiredAt,
      },
      authConfig.jwtSecret,
    );

    return accessToken;
  }

  async generateRefreshToken(user, userAgent) {
    let token;
    let exists = false;

    do {
      token = randomString(32);
      const count = await prisma.refreshToken.count({
        where: {
          token,
        },
      });

      exists = count > 0;
    } while (exists);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + authConfig.refreshTokenTTL);

    const refreshToken = await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token,
        userAgent,
        expiresAt,
      },
    });

    return refreshToken.token;
  }

  async getUserById(id) {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        isVerified: true,
        emailVerifiedAt: true,
      },
      where: { id },
    });
    return user;
  }

  async generateUserTokens(user, userAgent) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user, userAgent);

    return {
      accessToken,
      accessTokenTTL: authConfig.accessTokenTTL,
      refreshToken,
    };
  }
}

module.exports = new AuthService();
