import { Types } from "mongoose";

export function normalizeId(value: unknown): string {
  if (value instanceof Types.ObjectId) {
    return value.toString();
  }
  if (typeof value === "object" && value !== null && "_id" in value) {
    return (value as { _id: Types.ObjectId })._id.toString();
  }
  throw new Error("Invalid reference value");
}