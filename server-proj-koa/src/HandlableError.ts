
export class HandlableError extends Error {
    constructor(public message: string) {
        super(message);
        this.name = "HandlableError";
    }
};
