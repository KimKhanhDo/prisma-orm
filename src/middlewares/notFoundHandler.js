const { HTTP_STATUS, ERROR_MESSAGES } = require('@/config/constant');

const notFoundHandler = (_, res) => {
    res.error(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND);
};

module.exports = notFoundHandler;
