/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import CourseCard from "../CourseCard";
import type { ICourse } from "@/types/course";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const AllCourses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // getting search from Redux store
  const searchValue = useSelector((state: RootState) => state.search.value);

  // update local search state when redux search changes
  useEffect(() => {
    setSearchTerm(searchValue);

    // Debounce the search input
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const {
    data: apiResponse,
    isLoading,
    isError,
    isFetching,
  } = useGetCoursesQuery({
    page: currentPage,
    limit: limit,
    search: debouncedSearch,
  });

  let coursesData: ICourse[] = [];
  let pagination = {
    total: 0,
    page: currentPage,
    limit: limit,
    totalPages: 1,
  };

  if (apiResponse) {
    if (apiResponse.data?.courses && apiResponse.data?.pagination) {
      coursesData = apiResponse.data.courses;
      pagination = apiResponse.data.pagination;
    } else if (apiResponse.courses && apiResponse.pagination) {
      coursesData = apiResponse.courses;
      pagination = apiResponse.pagination;
    } else if (Array.isArray(apiResponse)) {
      coursesData = apiResponse;
    }
  }

  const totalPages = pagination.totalPages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (value: string) => {
    const newLimit = parseInt(value);
    setLimit(newLimit);
    setCurrentPage(1);
  };

  if (isLoading || isFetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Failed to load courses
          </h3>
          <p className="text-red-600">Please try again later</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span
            key="ellipsis-start"
            className="px-2 text-gray-500 dark:text-gray-400"
          >
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === i
              ? "bg-indigo-600 text-white"
              : "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span
            key="ellipsis-end"
            className="px-2 text-gray-500 dark:text-gray-400"
          >
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          All Courses
        </h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {coursesData.length} of {pagination.total} courses
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Show:
              </span>
              <Select
                value={limit.toString()}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="8" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {coursesData.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="mx-auto h-24 w-24 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {debouncedSearch ? "No courses found" : "No courses available"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {debouncedSearch
              ? "Try adjusting your search terms"
              : "Check back soon for new courses!"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coursesData.map((course: ICourse) => (
              <CourseCard key={course._id} {...course} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex flex-col items-center justify-center gap-4">
              <div className="flex items-center justify-between w-full max-w-md">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {renderPageNumbers()}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages} • {pagination.total} total
                courses
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllCourses;
