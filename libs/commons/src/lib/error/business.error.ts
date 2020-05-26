export class BusinessError extends Error {
  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BusinessError.prototype);
  }
}
