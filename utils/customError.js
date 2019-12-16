class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.name = this.constructor.name;
        this.message = message || 'Something went wrong. Please try again.';
        this.status = status || 500;
    }
}



class ValidationError extends CustomError {
    constructor(message, status) {
        super(message || 'Invalid inputs.', status || 422);
    }
}



class PropertyRequiredError extends CustomError {
    constructor(message, status) {
        super(message || 'Mandatory inputs.', status || 422);
    }
}

class InternalError extends CustomError {
    constructor(message, status) {
        super(message || 'Invalid inputs.', status || 500);
    }
}

module.exports = { InternalError, PropertyRequiredError, ValidationError, CustomError };