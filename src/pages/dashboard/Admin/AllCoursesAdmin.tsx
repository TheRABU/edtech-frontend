import CourseCard from "@/components/CourseCard";
import {
  useGetCoursesQuery,
  useDeleteCourseMutation,
} from "@/redux/features/course/course.api";
import type { ICourse } from "@/types/course";
import { Eye, Loader2, AlertTriangle, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

const AllCourses = () => {
  const navigate = useNavigate();
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    data: coursesData,
    isLoading,
    isError,
    refetch,
  } = useGetCoursesQuery({ limit: 10, page: 1 });

  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const handleDeleteClick = (courseId: string) => {
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;

    try {
      await deleteCourse(courseToDelete).unwrap();
      alert("Course deleted successfully!");
      setShowDeleteModal(false);
      setCourseToDelete(null);
      refetch();
    } catch (error: any) {
      console.error("Error deleting course:", error);
      alert(
        error?.data?.message || "Failed to delete course. Please try again."
      );
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  const handleAddCourse = () => {
    navigate("/admin/courses/add");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="ml-2 text-gray-600">Loading courses...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Courses
          </h2>
          <p className="text-gray-600 mb-4">
            Failed to load courses. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const courses = coursesData?.data?.courses || [];

  return (
    <>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Course
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this course? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
            <p className="text-gray-600 mt-2">Manage your courses from here</p>
          </div>
          <button
            onClick={handleAddCourse}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Course</span>
          </button>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: ICourse) => (
              <CourseCard
                key={course._id}
                {...course}
                onDelete={handleDeleteClick}
                isAdminView={true}
              />
            ))}
          </section>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow border">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Eye className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started by creating your first course.
            </p>
            <button
              onClick={handleAddCourse}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create Your First Course
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AllCourses;
