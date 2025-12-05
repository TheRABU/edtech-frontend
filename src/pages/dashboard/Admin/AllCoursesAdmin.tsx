import CourseCard from "@/components/CourseCard";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import type { ICourse } from "@/types/course";

const AllCourses = () => {
  const {
    data: coursesData,
    isLoading,
    isError,
  } = useGetCoursesQuery({ limit: 10, page: 1 });

  console.log("course data", coursesData);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        All Courses (Admin)
      </h1>

      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading courses...</p>
        </div>
      )}

      {isError && (
        <div className="text-center py-12">
          <p className="text-red-600">
            Error loading courses. Please try again.
          </p>
        </div>
      )}

      {coursesData?.data?.courses && coursesData.data.courses.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData.data.courses.map((course: ICourse) => (
            <CourseCard key={course._id} {...course} />
          ))}
        </section>
      ) : !isLoading && !isError ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No courses found.</p>
        </div>
      ) : null}
    </div>
  );
};

export default AllCourses;
