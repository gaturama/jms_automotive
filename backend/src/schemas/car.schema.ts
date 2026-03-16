import { z } from "zod";

export const carSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    brand: z.string().min(1),
    carModel: z.string().min(1),
    year: z
      .number()
      .int()
      .min(1886)
      .max(new Date().getFullYear() + 1),
    engine: z.string().min(1),
    horsepower: z.number().positive(),
    torque: z.string().min(1),
    transmission: z.string().min(1),
    drivetrain: z.string().min(1),
    fuelType: z.string().min(1),
    maxSpeed: z.number().positive(),
    acceleration: z.string().min(1),
    weight: z.number().positive(),
    price: z.number().positive(),
    description: z.string().min(1),
  }),
});
