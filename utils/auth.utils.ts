import validator from "validator";
import { z } from "zod";

export const passwordValidation = (fieldName: string) =>
  z
    .string({ required_error: `${fieldName} is required` })
    .min(8, `${fieldName} must contain atleast 8 characters`)
    .max(64, `${fieldName} should not contain more than 64 characters`)
    .refine(
      (value) =>
        validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 1,
          minNumbers: 1,
        }),
      `${fieldName} must be strong, should contain 1 lowercase letter, 1 uppercase letter, 1 special character, 1 number atleast`,
    );
