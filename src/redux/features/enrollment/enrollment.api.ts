import { baseApi } from "@/redux/baseApi";

export interface Enrollment {
  _id: string;
  userId: string;
  courseId: string;
  batchId: string;
  progress: number;
  completedModules: string[];
  enrolledAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface EnrollRequest {
  courseId: string;
  batchId: string;
}

export interface MarkModuleCompleteRequest {
  enrollmentId: string;
  moduleId: string;
}

const enrollmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    enrollCourse: builder.mutation<Enrollment, EnrollRequest>({
      query: (enrollData) => ({
        url: "/courses/enroll",
        method: "POST",
        body: enrollData,
      }),
      invalidatesTags: ["Enrollments"],
    }),
    getMyEnrollments: builder.query<Enrollment[], void>({
      query: () => ({
        url: "/courses/enroll/my-enrollments",
        method: "GET",
      }),
      providesTags: ["Enrollments"],
    }),
    getEnrollmentProgress: builder.query<Enrollment, string>({
      query: (enrollmentId) => ({
        url: `/courses/enroll/progress/${enrollmentId}`,
        method: "GET",
      }),
      providesTags: (result) => [{ type: "Enrollments", id: result?._id }],
    }),

    markModuleComplete: builder.mutation({
      query: (data) => ({
        url: "/courses/enroll/complete-module",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Enrollments"],
    }),
    unenrollCourse: builder.mutation<void, string>({
      query: (enrollmentId) => ({
        url: `/courses/enroll/unenroll/${enrollmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Enrollments"],
    }),
    checkEnrollment: builder.query<
      { isEnrolled: boolean; enrollmentId?: string },
      string
    >({
      query: (courseId) => ({
        url: `/courses/enroll/check/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Enrollments"],
    }),
  }),
});

export const {
  useEnrollCourseMutation,
  useGetMyEnrollmentsQuery,
  useGetEnrollmentProgressQuery,
  useMarkModuleCompleteMutation,
  useUnenrollCourseMutation,
  useCheckEnrollmentQuery,
} = enrollmentApi;
