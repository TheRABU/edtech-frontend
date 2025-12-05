/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
} from "@/redux/features/course/course.api";
import {
  updateCourseSchema,
  moduleSchema,
  batchSchema,
} from "@/validation/course.validation";
import { Plus, Trash2, CalendarIcon, ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UpdateCourseFormData = z.infer<typeof updateCourseSchema>;

const UpdateCourse = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch existing course data
  const {
    data: courseData,
    isLoading: isCourseLoading,
    isError: isCourseError,
    error: courseError,
  } = useGetCourseByIdQuery(id || "");

  console.log("Fetched update course data:", courseData);

  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [modules, setModules] = useState<Array<z.infer<typeof moduleSchema>>>(
    []
  );
  const [batches, setBatches] = useState<Array<z.infer<typeof batchSchema>>>(
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<UpdateCourseFormData>({
    resolver: zodResolver(updateCourseSchema),
    defaultValues: {
      tags: [],
      modules: [],
      batches: [],
    },
  });

  useEffect(() => {
    if (courseData?.data) {
      const course = courseData.data;

      reset({
        title: course.title,
        description: course.description,
        instructor: course.instructor,
        price: course.price,
        category: course.category,
        thumbnail: course.thumbnail || "",
      });

      if (course.tags) {
        setTags(course.tags);
        setValue("tags", course.tags);
      }

      if (course.modules) {
        setModules(course.modules);
        setValue("modules", course.modules);
      }

      if (course.batches) {
        setBatches(course.batches);
        setValue("batches", course.batches);
      }
    }
  }, [courseData, reset, setValue]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    setValue("tags", newTags);
  };

  const addModule = () => {
    const newModule = {
      title: "",
      description: "",
      duration: 30,
      order: modules.length + 1,
      videoUrl: "",
    };
    const newModules = [...modules, newModule];
    setModules(newModules);
    setValue("modules", newModules);
  };

  const updateModule = (index: number, field: string, value: any) => {
    const newModules = [...modules];
    newModules[index] = { ...newModules[index], [field]: value };
    setModules(newModules);
    setValue("modules", newModules);
  };

  const removeModule = (index: number) => {
    const newModules = modules.filter((_, i) => i !== index);
    const reorderedModules = newModules.map((module, idx) => ({
      ...module,
      order: idx + 1,
    }));
    setModules(reorderedModules);
    setValue("modules", reorderedModules);
  };

  const addBatch = () => {
    const newBatch = {
      batchId: "",
      startDate: "",
      maxStudents: 30,
    };
    const newBatches = [...batches, newBatch];
    setBatches(newBatches);
    setValue("batches", newBatches);
  };

  const updateBatch = (index: number, field: string, value: any) => {
    const newBatches = [...batches];
    newBatches[index] = { ...newBatches[index], [field]: value };
    setBatches(newBatches);
    setValue("batches", newBatches);
  };

  const handleDateSelect = (
    index: number,
    field: "startDate" | "endDate",
    date: Date | undefined
  ) => {
    if (date) {
      const dateString = format(date, "yyyy-MM-dd");
      updateBatch(index, field, dateString);
    } else {
      updateBatch(index, field, "");
    }
  };

  const removeBatch = (index: number) => {
    const newBatches = batches.filter((_, i) => i !== index);
    setBatches(newBatches);
    setValue("batches", newBatches);
  };

  const onSubmit = async (data: UpdateCourseFormData) => {
    if (!id) {
      alert("Course ID is missing");
      return;
    }

    try {
      const updateData = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) => value !== undefined && value !== ""
        )
      );

      if (data.tags !== undefined) updateData.tags = data.tags;
      if (data.modules !== undefined) updateData.modules = data.modules;
      if (data.batches !== undefined) updateData.batches = data.batches;

      const result = await updateCourse({ id, ...updateData }).unwrap();

      if (result.success) {
        alert("Course updated successfully!");
        navigate("/admin/courses");
      } else {
        alert(result.message || "Failed to update course");
      }
    } catch (error: any) {
      console.error("Error updating course:", error);
      alert(
        error?.data?.message || "Failed to update course. Please try again."
      );
    }
  };

  if (isCourseLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

  if (isCourseError || !courseData?.data) {
    // Safely extract error message
    const errorMessage = courseError
      ? (courseError as any)?.data?.message ||
        (courseError as any)?.message ||
        "The course you're trying to edit doesn't exist."
      : "The course you're trying to edit doesn't exist.";

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <CalendarIcon className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Course not found
          </h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => navigate("/admin/courses")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const course = courseData.data;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Courses
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">Update Course</h1>
            <p className="text-gray-600 mt-2">
              Edit course: <span className="font-medium">{course.title}</span>
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., React Masterclass"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor
                </label>
                <input
                  type="text"
                  {...register("instructor")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.instructor ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., John Doe"
                />
                {errors.instructor && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.instructor.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  {...register("category")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a category</option>
                  <option value="web-development">Web Development</option>
                  <option value="data-science">Data Science</option>
                  <option value="mobile-development">Mobile Development</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="marketing">Marketing</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Describe your course in detail..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail URL
              </label>
              <input
                type="url"
                {...register("thumbnail")}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.thumbnail ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="https://example.com/image.jpg"
              />
              {errors.thumbnail && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.thumbnail.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Tags</h2>
              <span className="text-sm text-gray-500">
                {tags.length} tags added
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Add a tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Modules</h2>
              <button
                type="button"
                onClick={addModule}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add Module
              </button>
            </div>

            {modules.map((module, index) => (
              <div
                key={index}
                className="mb-6 p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">
                    Module {index + 1}
                  </h3>
                  {modules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeModule(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Module Title
                    </label>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) =>
                        updateModule(index, "title", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Module title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={module.duration}
                      onChange={(e) =>
                        updateModule(
                          index,
                          "duration",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      min="1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={module.description}
                      onChange={(e) =>
                        updateModule(index, "description", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      rows={2}
                      placeholder="Module description"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-2">
                      Video URL
                    </label>
                    <input
                      type="url"
                      value={module.videoUrl}
                      onChange={(e) =>
                        updateModule(index, "videoUrl", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>
              </div>
            ))}

            {errors.modules && (
              <p className="mt-1 text-sm text-red-600">
                {errors.modules.message}
              </p>
            )}
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Batches</h2>
              <button
                type="button"
                onClick={addBatch}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add Batch
              </button>
            </div>

            {batches.map((batch, index) => (
              <div
                key={index}
                className="mb-6 p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">
                    Batch {index + 1}
                  </h3>
                  {batches.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBatch(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Batch ID
                    </label>
                    <input
                      type="text"
                      value={batch.batchId}
                      onChange={(e) =>
                        updateBatch(index, "batchId", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="e.g., BATCH2024-01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Start Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !batch.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {batch.startDate ? (
                            format(new Date(batch.startDate), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            batch.startDate
                              ? new Date(batch.startDate)
                              : undefined
                          }
                          onSelect={(date) =>
                            handleDateSelect(index, "startDate", date)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      End Date (Optional)
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !batch.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {batch.endDate ? (
                            format(new Date(batch.endDate), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            batch.endDate ? new Date(batch.endDate) : undefined
                          }
                          onSelect={(date) =>
                            handleDateSelect(index, "endDate", date)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Max Students
                    </label>
                    <input
                      type="number"
                      value={batch.maxStudents || ""}
                      onChange={(e) =>
                        updateBatch(
                          index,
                          "maxStudents",
                          parseInt(e.target.value) || undefined
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      min="1"
                      placeholder="30"
                    />
                  </div>
                </div>
              </div>
            ))}

            {errors.batches && (
              <p className="mt-1 text-sm text-red-600">
                {errors.batches.message}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <div className="text-sm text-gray-500">
              Last updated:{" "}
              {course.updatedAt
                ? new Date(course.updatedAt).toLocaleDateString()
                : "N/A"}
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/admin/courses")}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Course"
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Current Course Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Course ID</p>
              <p className="font-mono text-sm">{course._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-sm">
                {course.isDeleted ? (
                  <span className="text-red-600">Archived</span>
                ) : (
                  <span className="text-green-600">Active</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-sm">
                {course.createdAt
                  ? new Date(course.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Modules</p>
              <p className="text-sm">{course.modules?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourse;
