const {
    PrismaClientValidationError,
} = require('../../generated/prisma/runtime/client');
const {
    HTTP_STATUS,
    ERROR_MESSAGES,
    PRISMA_CODES,
} = require('@/config/constant');
const isProduction = require('@/utils/isProduction');

const exceptionHandler = (error, req, res, next) => {
    console.error('🔴 Error:', error);

    const status = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = ERROR_MESSAGES.INTERNAL_ERROR;

    if (error instanceof PrismaClientValidationError) {
        return res.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
    }

    if (error?.code === PRISMA_CODES.DUPLICATE) {
        return res.error(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.DUPLICATE);
    }

    // 🛠️ Development: show details
    const errorDetail = !isProduction() ? error : null;

    res.error(status, message, errorDetail);
};

module.exports = exceptionHandler;
