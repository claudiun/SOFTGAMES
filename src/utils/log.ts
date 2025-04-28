// Set this flag to true for production builds to disable debug logs
const IS_PROD = process.env.NODE_ENV === "production" || false;

export function log(...args: any[]): void {
  if (IS_PROD) return;
  console.log("[DEBUG]", ...args);
}
