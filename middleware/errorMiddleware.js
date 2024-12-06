const {
    InvalidTokenError,
    UnauthorizedError,
} = require("express-oauth2-jwt-bearer");

const errorHandler = (error, request, response, next) => {

    if (error instanceof InvalidTokenError) {

        response.redirect('http://localhost:3000');

        return;
    }

    if (error instanceof UnauthorizedError) {

        response.redirect('http://localhost:3000');

        return;
    }

    const status = 500;
    const message = "Internal Server Error";

    response.status(status).json({ message });
};

module.exports = {
    errorHandler,
};