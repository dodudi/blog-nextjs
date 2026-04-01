export class NotFoundError extends Error {
    name = 'NotFoundError' as const;
    constructor(message = 'Not found') {
        super(message);
    }
}

export class ConflictError extends Error {
    name = 'ConflictError' as const;
    constructor(message = 'Conflict') {
        super(message);
    }
}

export class ValidationError extends Error {
    name = 'ValidationError' as const;
    constructor(message = 'Validation failed') {
        super(message);
    }
}
