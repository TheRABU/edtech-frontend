// types/enrollment.ts

import type { ICourse } from "./course";

export interface IEnrollment {
  _id: string; // Use string instead of Types.ObjectId
  userId: string;
  courseId: string | ICourse; // Can be string ID or populated Course object
  batchId: string;
  progress: number;
  completedModules: string[];
  enrolledAt: string; // Use string for ISO date
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// For API response where course might be populated
export interface IPopulatedEnrollment extends Omit<IEnrollment, "courseId"> {
  courseId: ICourse;
}

// For creating a new enrollment
export interface ICreateEnrollment {
  userId: string;
  courseId: string;
  batchId: string;
  progress?: number;
  completedModules?: string[];
}

// For updating an enrollment
export interface IUpdateEnrollment {
  progress?: number;
  completedModules?: string[];
  isDeleted?: boolean;
}

// API Response types
export interface IEnrollmentApiResponse {
  success: boolean;
  message: string;
  statusCode?: number;
  data?:
    | IEnrollment
    | IEnrollment[]
    | IPopulatedEnrollment
    | IPopulatedEnrollment[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Query parameters for fetching enrollments
export interface IEnrollmentQueryParams {
  userId?: string;
  courseId?: string;
  batchId?: string;
  isDeleted?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  populateCourse?: boolean;
}

// Stats interface for dashboard
export interface IEnrollmentStats {
  totalEnrollments: number;
  activeEnrollments: number;
  averageProgress: number;
  totalCompletedModules: number;
  enrolledCoursesCount: number;
}

// For the enrollment with progress summary
export interface IEnrollmentWithProgress extends IEnrollment {
  lastAccessed?: string;
  timeSpent?: number; // in minutes
}

// Type guard to check if courseId is populated
export function isCoursePopulated(
  enrollment: IEnrollment
): enrollment is IPopulatedEnrollment {
  return (
    typeof enrollment.courseId === "object" && enrollment.courseId !== null
  );
}

// Utility to safely get course title
export function getCourseTitle(enrollment: IEnrollment): string {
  if (isCoursePopulated(enrollment)) {
    return enrollment.courseId.title || "Course";
  }
  return "Course";
}
