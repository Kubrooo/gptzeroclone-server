export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Mongoose validation error
    if (err.name === 'Validation') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            error: 'Validation Error',
            details: messages
        });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            error: `Duplicate ${field}`,
            details: `${field} already exists`
        });
    }

    // JWT error
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token'
        });
    }

    // Default error
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
};