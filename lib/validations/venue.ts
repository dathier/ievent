import * as z from "zod";

export const venueSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location must be 200 characters or less"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
});
