import { z } from "zod";

export const moduleSchema = z.object({
  title: z.string().min(1, "Module title is required"),
  description: z.string().min(1, "Module description is required"),
  videoUrl: z.string().url("Must be a valid URL").optional(),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  order: z.number().min(1, "Order must be at least 1"),
});

export const batchSchema = z.object({
  batchId: z.string().min(1, "Batch ID is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  maxStudents: z.number().min(1, "Must be at least 1").optional(),
});

export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  instructor: z.string().min(2, "Instructor name is required"),
  price: z.number().nonnegative("Price must be non-negative"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string().url("Must be a valid URL").optional(),
  modules: z.array(moduleSchema).optional(),
  batches: z.array(batchSchema).min(1, "At least one batch is required"),
});

export const updateCourseSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  instructor: z.string().min(2).optional(),
  price: z.number().nonnegative().optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string().url().optional(),
  modules: z.array(moduleSchema).optional(),
  batches: z.array(batchSchema).optional(),
});
