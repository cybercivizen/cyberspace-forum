import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function getValidationError(error: unknown) {
  if (error instanceof Error) return error;
}

export class ValidationError extends Error {
  constructor(public errors: { username?: string; email?: string }) {
    super("Validation failed");
    this.name = "ValidationError";
  }
}
