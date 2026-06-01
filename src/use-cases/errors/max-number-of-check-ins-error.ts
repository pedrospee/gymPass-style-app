export class MaxNumberOfCheckInsError extends Error {
    constructor() {
        super("You have already checked in today.")
    }
}