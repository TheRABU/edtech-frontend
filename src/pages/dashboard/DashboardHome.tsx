import { Link } from "react-router";
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  Users,
} from "lucide-react";
import { useGetMyEnrollmentsQuery } from "@/redux/features/enrollment/enrollment.api";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import type { ICourse } from "@/types/course";
import type { IEnrollment } from "@/types/enrollment";

const DashboardHome = () => {
  const { data: enrollmentsData, isLoading: enrollmentsLoading } =
    useGetMyEnrollmentsQuery();
  const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery({
    limit: 4,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  console.log("enrollmentsData:", enrollmentsData);

  const isLoading = enrollmentsLoading || coursesLoading;

  // Safely extract enrolled courses with proper type checking
  const enrolledCourses: IEnrollment[] = Array.isArray(enrollmentsData?.data)
    ? enrollmentsData.data
    : Array.isArray(enrollmentsData)
    ? enrollmentsData
    : [];

  // Check if coursesData has a nested structure or is directly the array
  const newCourses: ICourse[] = Array.isArray(coursesData?.data?.courses)
    ? coursesData.data.courses
    : Array.isArray(coursesData?.data)
    ? coursesData.data
    : Array.isArray(coursesData)
    ? coursesData.slice(0, 4) // Take first 4 if it's an array
    : [];

  // Safe statistics calculation
  const stats = {
    enrolledCourses: enrolledCourses.length,
    completedModules: enrolledCourses.reduce(
      (acc, enrollment) =>
        acc +
        (Array.isArray(enrollment.completedModules)
          ? enrollment.completedModules.length
          : 0),
      0
    ),
    averageProgress:
      enrolledCourses.length > 0
        ? Math.round(
            enrolledCourses.reduce(
              (acc, enrollment) =>
                acc +
                (typeof enrollment.progress === "number"
                  ? enrollment.progress
                  : 0),
              0
            ) / enrolledCourses.length
          )
        : 0,
    activeLearningDays: 24,
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If there's an error in the API response structure
  if (!Array.isArray(enrolledCourses)) {
    console.error("enrolledCourses is not an array:", enrolledCourses);
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <BookOpen className="h-12 w-12 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Data Error
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Unable to load enrollment data. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, Student! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Continue your learning journey. You have {stats.enrolledCourses}{" "}
          active courses.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Enrolled Courses
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.enrolledCourses}
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
                Completed Modules
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.completedModules}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Progress
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.averageProgress}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Days
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.activeLearningDays}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Courses */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Continue Learning
              </h2>
            </div>
            <div className="p-6">
              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.slice(0, 3).map((enrollment) => (
                    <div
                      key={enrollment._id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {enrollment.courseId?.title || "Course"}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Batch: {enrollment.batchId || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {typeof enrollment.progress === "number"
                            ? enrollment.progress
                            : 0}
                          %
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Progress
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No enrolled courses yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Start your learning journey by enrolling in a course
                  </p>
                  <Link
                    to="/courses"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
              {enrolledCourses.length > 3 && (
                <div className="mt-6 text-center">
                  <Link
                    to="/dashboard/courses"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                  >
                    View all courses →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Courses & Quick Stats */}
        <div className="space-y-6">
          {/* New Courses */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                New Courses
              </h2>
            </div>
            <div className="p-6">
              {newCourses.length > 0 ? (
                <div className="space-y-4">
                  {newCourses.map((course: ICourse) => (
                    <Link
                      key={course._id}
                      to={`/courses/${course._id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {course.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ${course.price}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No new courses available
                </p>
              )}
              <div className="mt-4">
                <Link
                  to="/courses"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                >
                  Browse all courses →
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Learning Stats
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Time Spent
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    45h 30m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Classmates
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    128
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Certificates
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Upcoming Deadlines
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No upcoming deadlines
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You're all caught up! Check back later for new assignments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
