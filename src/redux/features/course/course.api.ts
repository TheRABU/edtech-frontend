import { baseApi } from "@/redux/baseApi";
import type { ICourse } from "@/types/course";

interface GetCoursesParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "createdAt" | "title";
  sortOrder?: "asc" | "desc";
  tags?: string;
}

interface GetCoursesResponse {
  success: boolean;
  data: {
    courses: ICourse[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  message?: string;
}

const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: (params: GetCoursesParams = {}) => {
        const queryParams = new URLSearchParams();

        if (params.page !== undefined)
          queryParams.append("page", params.page.toString());
        if (params.limit !== undefined)
          queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        if (params.category) queryParams.append("category", params.category);
        if (params.minPrice !== undefined)
          queryParams.append("minPrice", params.minPrice.toString());
        if (params.maxPrice !== undefined)
          queryParams.append("maxPrice", params.maxPrice.toString());
        if (params.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
        if (params.tags) queryParams.append("tags", params.tags);

        return {
          url: `/courses?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Courses"],
    }),

    getCourseById: builder.query({
      query: (id: string) => ({
        url: `/courses/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),
  }),
});

export const { useGetCoursesQuery, useGetCourseByIdQuery } = courseApi;
