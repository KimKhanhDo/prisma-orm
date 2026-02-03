// use adapter mariadb
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { PrismaClient } = require('@root/generated/prisma');

// dùng cấu hình env
const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST, // your database host
    port: process.env.DB_PORT, // your database port
    user: process.env.DB_USER, // your database username
    password: process.env.DB_PASS, // your database password
    database: process.env.DB_NAME, // optional, your database name
});

// prisma chứa tất cả model
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
