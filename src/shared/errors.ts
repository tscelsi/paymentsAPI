import HttpStatusCodes from 'http-status-codes';


export abstract class CustomError extends Error {

    public readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

    constructor(msg: string, httpStatus: number) {
        super(msg);
        this.HttpStatus = httpStatus;
    }
}

export class UnauthorisedError extends CustomError {
    public static readonly Msg = 'Unauthorised request.';
    public static readonly HttpStatus = HttpStatusCodes.UNAUTHORIZED;

    constructor() {
        super(UnauthorisedError.Msg, UnauthorisedError.HttpStatus);
    }
}


export class ParamMissingError extends CustomError {

    public static readonly Msg = 'One or more of the required parameters was missing.';
    public static readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

    constructor() {
        super(ParamMissingError.Msg, ParamMissingError.HttpStatus);
    }
}


export class PaymentNotFoundError extends CustomError {

    public static readonly Msg = 'A payment with the given id does not exist in the database.';
    public static readonly HttpStatus = HttpStatusCodes.NOT_FOUND;

    constructor() {
        super(PaymentNotFoundError.Msg, PaymentNotFoundError.HttpStatus);
    }
}

export class IncorrectPaymentFields extends CustomError {
    public static readonly Msg = 'Payment fields are incorrectly assigned or required fields are missing.';
    public static readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

    constructor() {
        super(IncorrectPaymentFields.Msg, IncorrectPaymentFields.HttpStatus);
    }
}

export class InvalidAmountError extends CustomError {
    public static readonly Msg = 'Cannot supply a negative amount.';
    public static readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

    constructor() {
        super(InvalidAmountError.Msg, InvalidAmountError.HttpStatus);
    }
}

export class BeneficiaryNotFoundError extends CustomError {
    public static readonly Msg = 'The user receiving payment does not exist.';
    public static readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

    constructor() {
        super(BeneficiaryNotFoundError.Msg, BeneficiaryNotFoundError.HttpStatus);
    }
}