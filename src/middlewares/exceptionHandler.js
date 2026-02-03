const { HTTP_STATUS } = require('@/constant');

const exceptionHandler = (error, req, res, next) => {
    let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = error.message || String(error);

    // 🔒 Chỉ expose error details trong development
    const errorDetail =
        process.env.NODE_ENV === 'development'
            ? {
                  stack: error.stack,
                  code: error.code,
                  name: error.name,
              }
            : null;

    res.error(status, message, errorDetail);
};

module.exports = exceptionHandler;
