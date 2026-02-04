const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = require('@/libs/prisma');
const { BCRYPT_SALT_ROUNDS } = require('@/config/constant');
const authConfig = require('@/config/auth');

class AuthService {
    async register(email, password) {
        // Hash password with bcrypt
        const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                email,
                password: hash,
            },
        });
        return user;
    }

    generateAccessToken(user) {
        const expiredAt =
            Math.floor(Date.now() / 1000) + authConfig.accessTokenTTL;

        const accessToken = jwt.sign(
            {
                sub: user.id,
                exp: expiredAt,
            },
            authConfig.jwtSecret,
        );

        return accessToken;
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
}

module.exports = new AuthService();
