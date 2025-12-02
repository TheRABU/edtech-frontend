import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_BASE_URL || import.meta.env.VITE_BASE_URL_LOCAL,
    credentials: "include",
  }),
  tagTypes: ["Auth", "Courses", "Enrollments", "Assignments", "Quizzes"],
  endpoints: () => ({}),
});
