/**
 * Module type representing a course module/lesson
 */
export interface IModule {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in minutes
  order: number;
}

/**
 * Batch type representing a course batch/session
 */
export interface IBatch {
  batchId: string;
  startDate: Date | string;
  endDate?: Date | string;
  maxStudents?: number;
}

/**
 * Course type for the main course data
 */
export interface ICourse {
  _id?: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  category: string;
  tags: string[];
  thumbnail?: string;
  modules: IModule[];
  batches: IBatch[];
  isDeleted: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Course form data type - used when creating/updating a course
 */
export interface ICourseFormData {
  title: string;
  description: string;
  instructor: string;
  price: number;
  category: string;
  tags: string[];
  thumbnail?: string;
  modules?: IModule[];
  batches?: IBatch[];
}

/**
 * Course list item - simplified version for course listings
 */
export interface ICourseListItem {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  category: string;
  thumbnail?: string;
  modules: IModule[];
  batches: IBatch[];
}

/**
 * Course API response type
 */
export interface ICourseResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: ICourse;
}

/**
 * Course list API response type
 */
export interface ICourseListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: ICourse[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
