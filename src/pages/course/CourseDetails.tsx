import { useParams, useNavigate } from "react-router";
import { useGetCourseByIdQuery } from "@/redux/features/course/course.api";
import {
  useCheckEnrollmentQuery,
  useEnrollCourseMutation,
} from "@/redux/features/enrollment/enrollment.api";
import {
  Clock,
  BookOpen,
  DollarSign,
  User,
  Calendar,
  Tag,
  ArrowLeft,
  PlayCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";

const CourseDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedBatch, setSelectedBatch] = useState<string>("");

  const { isAuthenticated } = useAuth();

  const { data, isLoading, isError } = useGetCourseByIdQuery(id || "");

  const { data: enrollmentCheck, isLoading: checkingEnrollment } =
    useCheckEnrollmentQuery(id || "", {
      skip: !isAuthenticated || !id,
    });

  // Enrollment mutation
  const [enrollCourse, { isLoading: isEnrolling }] = useEnrollCourseMutation();

  console.log("enrollment check", enrollmentCheck);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/courses/${id}` } });
      return;
    }

    if (!selectedBatch) {
      if (data?.data?.batches?.length === 1) {
        setSelectedBatch(data.data.batches[0].batchId);
        await proceedWithEnrollment(data.data.batches[0].batchId);
      } else {
        alert("Please select a batch to enroll in");
      }
      return;
    }

    await proceedWithEnrollment(selectedBatch);
  };

  const proceedWithEnrollment = async (batchId: string) => {
    try {
      const result = await enrollCourse({
        courseId: id!,
        batchId,
      }).unwrap();

      console.log("Enrollment successful:", result);
      navigate("/dashboard/courses", {
        state: {
          message: "Successfully enrolled in the course!",
          showSuccess: true,
        },
      });
    } catch (error: any) {
      console.error("Enrollment error:", error);

      if (error?.data?.message?.includes("Already enrolled")) {
        // If already enrolled, redirect to dashboard
        navigate("/dashboard/courses", {
          state: {
            message: "You are already enrolled in this course",
            showInfo: true,
          },
        });
      } else if (error?.status === 401) {
        // Unauthorized - redirect to login
        navigate("/login", { state: { from: `/courses/${id}` } });
      } else {
        // Generic error
        alert(error?.data?.message || "Failed to enroll. Please try again.");
      }
    }
  };

  const handleGoToCourse = () => {
    if (enrollmentCheck?.enrollmentId) {
      navigate(`/dashboard/courses/${enrollmentCheck.enrollmentId}`);
    } else {
      navigate("/dashboard/courses");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-300 rounded-lg mb-6"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
              <div className="h-96 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Course not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const course = data.data;
  const totalDuration = course.modules.reduce(
    (total, module) => total + module.duration,
    0
  );

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  let buttonText = "Enroll Now";
  let buttonColor = "bg-indigo-600 hover:bg-indigo-700";
  let isButtonDisabled = false;

  if (!isAuthenticated) {
    buttonText = "Login to Enroll";
  } else if (checkingEnrollment) {
    buttonText = "Checking...";
    isButtonDisabled = true;
  } else if (enrollmentCheck?.isEnrolled) {
    buttonText = "Go to Course";
    buttonColor = "bg-green-600 hover:bg-green-700";
  } else if (isEnrolling) {
    buttonText = "Enrolling...";
    isButtonDisabled = true;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Image */}
            <div className="relative rounded-xl overflow-hidden mb-6 shadow-lg">
              <img
                src={
                  course.thumbnail ||
                  "https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg"
                }
                alt={course.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block bg-indigo-600 text-white text-sm font-semibold px-4 py-1 rounded-full mb-3">
                  {course.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {course.title}
                </h1>
              </div>
            </div>

            {/* Course Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Duration</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatDuration(totalDuration)}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">Modules</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {course.modules.length}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Instructor</span>
                </div>
                <p className="font-semibold text-gray-900 truncate">
                  {course.instructor}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Batches</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {course.batches.length}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this course
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Tags */}
            {course.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Course Modules */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Course Content
              </h2>
              <div className="space-y-3">
                {[...course.modules]
                  .sort((a, b) => a.order - b.order)
                  .map((module, index) => (
                    <div
                      key={module._id}
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {module.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <PlayCircle className="w-4 h-4" />
                            Video
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDuration(module.duration)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-8 h-8 text-indigo-600" />
                  <span className="text-4xl font-bold text-gray-900">
                    {course.price}
                  </span>
                </div>
                <p className="text-gray-600">One-time payment</p>
              </div>

              {/* Enrollment status indicator */}
              {isAuthenticated && enrollmentCheck?.isEnrolled && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">You are enrolled</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Start learning now!
                  </p>
                </div>
              )}

              {/* Batch Selection (only show if not enrolled and multiple batches) */}
              {!enrollmentCheck?.isEnrolled &&
                course.batches.length > 1 &&
                isAuthenticated && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Batch
                    </label>
                    <select
                      value={selectedBatch}
                      onChange={(e) => setSelectedBatch(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={isEnrolling}
                    >
                      <option value="">Choose a batch</option>
                      {course.batches.map((batch, index) => (
                        <option key={index} value={batch.batchId}>
                          {batch.batchId} - Starts:{" "}
                          {new Date(batch.startDate).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              {/* Enroll Button */}
              <button
                onClick={() => {
                  if (enrollmentCheck?.isEnrolled) {
                    handleGoToCourse();
                  } else {
                    handleEnroll();
                  }
                }}
                disabled={isButtonDisabled}
                className={`w-full ${buttonColor} text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {isEnrolling ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enrolling...
                  </>
                ) : checkingEnrollment ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking...
                  </>
                ) : (
                  buttonText
                )}
              </button>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  This course includes:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {course.modules.length} video modules
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {formatDuration(totalDuration)} total content
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    Lifetime access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    Certificate of completion
                  </li>
                </ul>
              </div>

              {/* Available Batches */}
              {course.batches.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Available Batches:
                  </h3>
                  <div className="space-y-2">
                    {course.batches.map((batch, index) => (
                      <div
                        key={index}
                        className={`text-sm p-3 rounded-lg ${
                          selectedBatch === batch.batchId
                            ? "bg-indigo-50 border border-indigo-200"
                            : "bg-gray-50"
                        }`}
                      >
                        <p className="font-medium text-gray-900">
                          {batch.batchId}
                        </p>
                        <p className="text-gray-600 text-xs">
                          Starts:{" "}
                          {new Date(batch.startDate).toLocaleDateString()}
                        </p>
                        {batch.maxStudents && (
                          <p className="text-gray-600 text-xs">
                            Max: {batch.maxStudents} students
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
