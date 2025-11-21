import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class ValidationError extends Error {
  constructor(public errors: { username?: string; email?: string }) {
    super("Validation failed");
    this.name = "ValidationError";
  }
}
