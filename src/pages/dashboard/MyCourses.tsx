/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  BookOpen,
  Clock,
  Award,
  Search,
  ChevronRight,
  Play,
  Calendar,
} from "lucide-react";
import { useGetMyEnrollmentsQuery } from "@/redux/features/enrollment/enrollment.api";
import { format } from "date-fns";
import type { IEnrollment, IEnrollmentApiResponse } from "@/types/enrollment";

const MyCourses = () => {
  const { data: enrollmentsResponse, isLoading } = useGetMyEnrollmentsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const enrollments = useMemo(() => {
    if (!enrollmentsResponse) return [];

    if (Array.isArray(enrollmentsResponse)) {
      return enrollmentsResponse;
    }

    const apiResponse = enrollmentsResponse as IEnrollmentApiResponse;
    if (
      apiResponse &&
      typeof apiResponse === "object" &&
      "data" in apiResponse
    ) {
      const data = apiResponse.data;
      if (Array.isArray(data)) {
        return data;
      } else if (data) {
        return [data];
      }
    }

    const anyResponse = enrollmentsResponse as any;
    if (anyResponse?.result) {
      if (Array.isArray(anyResponse.result)) {
        return anyResponse.result;
      }
    }
    console.warn("Unexpected response structure:", enrollmentsResponse);
    return [];
  }, [enrollmentsResponse]);

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter(
      (enrollment: { courseId: any; progress: number }) => {
        const courseTitle =
          enrollment.courseId && typeof enrollment.courseId === "object"
            ? (enrollment.courseId as any).title
            : "Course";

        const matchesSearch = courseTitle
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        if (filter === "in-progress") {
          return matchesSearch && enrollment.progress < 100;
        } else if (filter === "completed") {
          return matchesSearch && enrollment.progress === 100;
        }
        return matchesSearch;
      }
    );
  }, [enrollments, searchTerm, filter]);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusBadge = (progress: number) => {
    if (progress === 100) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
          Completed
        </span>
      );
    } else if (progress > 0) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
          In Progress
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">
          Not Started
        </span>
      );
    }
  };

  const getCourseTitle = (enrollment: IEnrollment): string => {
    if (!enrollment.courseId) return "Course Title";

    if (
      typeof enrollment.courseId === "object" &&
      enrollment.courseId !== null
    ) {
      return (enrollment.courseId as any).title || "Course Title";
    }

    return "Course Title";
  };

  const getCourseInstructor = (enrollment: IEnrollment): string => {
    if (!enrollment.courseId) return "Instructor";

    if (
      typeof enrollment.courseId === "object" &&
      enrollment.courseId !== null
    ) {
      const course = enrollment.courseId as any;
      if (typeof course.instructor === "string") return course.instructor;
      if (course.instructor && typeof course.instructor === "object") {
        return course.instructor.name || "Instructor";
      }
    }

    return "Instructor";
  };

  const getCourseCategory = (enrollment: IEnrollment): string => {
    if (!enrollment.courseId) return "";

    if (
      typeof enrollment.courseId === "object" &&
      enrollment.courseId !== null
    ) {
      return (enrollment.courseId as any).category || "";
    }

    return "";
  };

  const getCourseModules = (enrollment: IEnrollment): string[] => {
    if (!enrollment.courseId) return [];

    if (
      typeof enrollment.courseId === "object" &&
      enrollment.courseId !== null
    ) {
      return Array.isArray((enrollment.courseId as any).modules)
        ? (enrollment.courseId as any).modules
        : [];
    }

    return [];
  };

  const getCourseId = (enrollment: IEnrollment): string => {
    if (!enrollment.courseId) return "";

    if (
      typeof enrollment.courseId === "object" &&
      enrollment.courseId !== null
    ) {
      return (enrollment.courseId as any)._id || "";
    }

    return typeof enrollment.courseId === "string" ? enrollment.courseId : "";
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMM d");
    } catch (error) {
      return "N/A";
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state - if enrollments is not an array after processing
  if (!Array.isArray(enrollments)) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
          <BookOpen className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Data Error
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Unable to load your courses. The data format is unexpected.
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-500 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <code className="block text-left">
            Response structure: {JSON.stringify(enrollmentsResponse, null, 2)}
          </code>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Courses
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Track your progress and continue learning
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Browse More Courses
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Courses
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {enrollments.length}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                In Progress
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {
                  enrollments.filter((e) => e.progress > 0 && e.progress < 100)
                    .length
                }
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {enrollments.filter((e) => e.progress === 100).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => setFilter("in-progress")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "in-progress"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "completed"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment: IEnrollment) => (
            <div
              key={enrollment._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Course Header */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>{getStatusBadge(enrollment.progress)}</div>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                      {getCourseTitle(enrollment)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {getCourseInstructor(enrollment)} • Batch:{" "}
                      {enrollment.batchId}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">
                      Progress
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {enrollment.progress || 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(
                        enrollment.progress
                      )}`}
                      style={{ width: `${enrollment.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {enrollment.completedModules?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Modules
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getCourseModules(enrollment).length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Total
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatDate(enrollment.enrolledAt)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Enrolled
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    to={`/dashboard/courses/${enrollment._id}`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Continue
                  </Link>
                  <Link
                    to={`/courses/${getCourseId(enrollment)}`}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Started {formatDate(enrollment.enrolledAt)}
                    </span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {getCourseCategory(enrollment)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
            <BookOpen className="h-10 w-10 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm ? "No courses found" : "No courses enrolled yet"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {searchTerm
              ? "Try adjusting your search terms or browse available courses"
              : "Start your learning journey by enrolling in a course"}
          </p>
          <div className="flex gap-4 justify-center">
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Clear Search
              </button>
            ) : null}
            <Link
              to="/courses"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
