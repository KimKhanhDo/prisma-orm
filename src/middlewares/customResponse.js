const { HTTP_STATUS, ERROR_MESSAGES } = require('@/config/constant');

const response = (_, res, next) => {
    // Thêm method success & error vào res
    res.success = (data, status = HTTP_STATUS.OK, passProps = {}) => {
        res.status(status).json({
            status: 'success',
            data,
            ...passProps,
        });
    };

    // Pagination
    res.paginate = ({ rows, pagination }) => {
        res.success(rows, HTTP_STATUS.OK, { pagination });
    };

    // Error
    res.error = (
        status = HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message,
        error = null,
    ) => {
        res.status(status).json({
            status: 'error',
            message,
            error,
        });
    };

    // Not found
    res.notFound = () => {
        return res.error(
            res.error(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND),
        );
    };

    // Unauthorized
    res.unauthorized = () => {
        return res.error(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    };

    next(); // ← Cho phép request đi tiếp
};

module.exports = response;
