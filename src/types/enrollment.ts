// types/enrollment.ts

import type { ICourse } from "./course";

// Base enrollment type (as returned by API without course populated)
export interface IEnrollment {
  _id: string;
  userId: string;
  courseId: string; // Usually a string ID in base response
  batchId: string;
  progress: number;
  completedModules: string[];
  enrolledAt: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// For API response where course is populated
export interface IPopulatedEnrollment extends Omit<IEnrollment, "courseId"> {
  courseId: ICourse; // Populated course object
}

// Unified enrollment type that can be either string or ICourse
export type Enrollment = IEnrollment | IPopulatedEnrollment;

// Type guard to check if courseId is populated
export function isCoursePopulated(
  enrollment: IEnrollment | IPopulatedEnrollment
): enrollment is IPopulatedEnrollment {
  if (!enrollment || !enrollment.courseId) return false;

  // Check if courseId is an object (populated course)
  return (
    typeof enrollment.courseId === "object" &&
    enrollment.courseId !== null &&
    "_id" in enrollment.courseId
  );
}

// API Response types - Separate from the actual data models
export interface IEnrollmentApiResponse {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: Enrollment | Enrollment[]; // Can be single or array
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// For the enrollment enrollment API response
export interface IEnrollmentResponse {
  success: boolean;
  message: string;
  enrollmentId?: string;
  isEnrolled?: boolean;
  data?: Enrollment;
}
