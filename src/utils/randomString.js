const crypto = require('node:crypto');

const randomString = (size = 32) => {
    return crypto.randomBytes(size).toString('hex');
};

module.exports = randomString;
