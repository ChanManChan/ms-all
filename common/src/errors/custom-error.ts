//! Abstract classes
// abstract classes cannot be instantiated
// used to set up requirements for subclasses
// Do create a class when translated to JS, which means we can use it in 'instanceof' checks!!!

//! This is very similar to interfaces

export abstract class CustomError extends Error {
  // if going to extend CustomError it has to have a statusCode property and it must be a number
  //! A subclass must implement these properties and methods
  abstract statusCode: number;

  // throw new Error('this is the message that we are passing into the constructor below')
  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, CustomError.prototype)
  }
  abstract serializeErrors(): { message: string; field?: string }[]
}
