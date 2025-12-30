import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  price: z
    .number()
    .positive("Price must be greater than 0"),

  stock: z
    .number()
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative"),

  imageUrl: z
    .string()
    .url("Invalid image URL")
    .optional()
    .nullable(),

  category: z
    .string()
    .optional()
    .nullable(),
});
