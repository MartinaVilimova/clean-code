// noinspection JSUnusedGlobalSymbols

const Decimal = require("decimal.js");
const ValidationResult = require("./validation-result");

/**
 * Matcher validates that string value represents a decimal number or null.
 * Decimal separator is always "."
 * In addition, it must comply to the rules described below.
 *
 * @param params - Matcher can take 0 to 2 parameters with following rules:
 * - no parameters: validates that number of digits does not exceed the maximum value of 11.
 * - one parameter: the parameter specifies maximum length of number for the above rule (parameter replaces the default value of 11)
 * - two parameters:
 *   -- first parameter represents the total maximum number of digits,
 *   -- the second parameter represents the maximum number of decimal places.
 *   -- both conditions must be met in this case.
 */
class DecimalNumberMatcher {
  constructor(...params) {
    this.params = params;
  }

  match(value) {
    if (value === null) return new ValidationResult();

    const { number, validationResult } = this.isValidDecimal(value, new ValidationResult());

    if (!number) return validationResult;

    if (this.params.length === 0 && this.isExceededMaximumNumberOfDigits(number, 11))
      validationResult.addInvalidTypeError("doubleNumber.e002", "The value exceeded maximum number of digits.");

    if (this.params.length === 1 && this.isExceededMaximumNumberOfDigits(number, this.params[0]))
      validationResult.addInvalidTypeError("doubleNumber.e002", "The value exceeded maximum number of digits.");

    if (this.params.length === 2 && this.isExceededMaximumNumberOfDigits(number, this.params[0]))
      validationResult.addInvalidTypeError("doubleNumber.e002", "The value exceeded maximum number of digits.");

    if (this.params.length === 2 && this.isDecimalPlaces(number))
      validationResult.addInvalidTypeError("doubleNumber.e003", "The value exceeded maximum number of decimal places.");

    return validationResult;
  }

  isExceededMaximumNumberOfDigits(number, maximumNumberDIgits) {
    return number.precision(true) > maximumNumberDIgits;
  }

  isDecimalPlaces(number) {
    return number.decimalPlaces() > this.params[1];
  }

  isValidDecimal(value, validationResult) {
    try {
      return { number: new Decimal(value), validationResult };
    } catch (e) {
      validationResult.addInvalidTypeError("doubleNumber.e001", "The value is not a valid decimal number.");

      return { number: null, validationResult };
    }
  }
}

module.exports = DecimalNumberMatcher;