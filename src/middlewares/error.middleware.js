const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`, err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
    });
};

module.exports = errorHandler;
