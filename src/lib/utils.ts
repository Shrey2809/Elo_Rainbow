import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function promisify<T>(
  fn: (callback: (err: any, result: T) => void) => void,
): (...args: any[]) => Promise<T> {
  return (...args: any[]) =>
    new Promise<T>((resolve, reject) => {
      fn((err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
}
