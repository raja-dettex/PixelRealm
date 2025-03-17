export class SignInError extends Error {
    constructor(message:string) { 
        super(message)
    }
}

export class SignUpError extends Error {
    constructor(message: string) { 
        super(message)
    }
}


export class ErrorUserNotFound extends Error {
    constructor(message: string) { 
        super(message)
    }
}


export class ErrorInvalidUser extends Error {
    constructor(message: string) { 
        super(message)
    }
}