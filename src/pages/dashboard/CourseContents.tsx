import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router";
import {
  Play,
  CheckCircle,
  Clock,
  BookOpen,
  ChevronRight,
  Menu,
  X,
  Download,
  MessageSquare,
  Award,
  Users,
  BarChart3,
} from "lucide-react";
import { useGetEnrollmentProgressQuery } from "@/redux/features/enrollment/enrollment.api";
import { useMarkModuleCompleteMutation } from "@/redux/features/enrollment/enrollment.api";

const CourseContent = () => {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const { data: enrollmentResponse, isLoading } = useGetEnrollmentProgressQuery(
    enrollmentId!
  );

  const [markComplete] = useMarkModuleCompleteMutation();

  const enrollment = enrollmentResponse?.data || enrollmentResponse;

  const course = enrollment?.courseId;

  const modules = course?.modules || [];
  const completedModules = enrollment?.completedModules || [];

  const sortedModules = useMemo(() => {
    if (!modules.length) return [];
    return [...modules].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [modules]);

  // auto select first module if none selected
  useEffect(() => {
    if (sortedModules.length > 0 && !selectedModuleId) {
      setSelectedModuleId(sortedModules[0]._id);
    }
  }, [sortedModules, selectedModuleId]);

  // Find the selected module
  const selectedModule =
    sortedModules.find((module) => module._id === selectedModuleId) ||
    sortedModules[0];

  const handleMarkComplete = async (moduleId: string) => {
    try {
      const completedModule = await markComplete({
        enrollmentId: enrollmentId!,
        moduleId,
      }).unwrap();
      console.log("Module marked as complete:", completedModule);
    } catch (error) {
      console.error("Failed to mark module as complete:", error);
    }
  };

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModuleId(moduleId);
  };

  // Helper function to get YouTube embed URL
  const getYouTubeEmbedUrl = (videoUrl: string) => {
    if (!videoUrl) return "";

    // Extract YouTube video ID from various URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = videoUrl.match(pattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }

    // If it's already an embed URL or we can't parse it, return as-is
    if (videoUrl.includes("youtube.com/embed/")) {
      return videoUrl;
    }

    // If it's a regular URL but not YouTube, just return it (for other video sources)
    return videoUrl;
  };

  // Format duration in minutes to readable format
  const formatDuration = (minutes: number) => {
    if (!minutes) return "0 min";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!enrollment || !course) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
          <BookOpen className="h-10 w-10 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Course not found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {enrollmentResponse
            ? `API Response Structure: ${JSON.stringify(
                enrollmentResponse,
                null,
                2
              )}`
            : "No enrollment data found"}
        </p>
        <Link
          to="/dashboard/courses"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to My Courses
        </Link>
      </div>
    );
  }

  // Calculate total course duration
  const totalDuration = sortedModules.reduce(
    (total, module) => total + (module.duration || 0),
    0
  );

  // Find current module index for navigation
  const currentModuleIndex = sortedModules.findIndex(
    (m) => m._id === selectedModule?._id
  );
  const hasPreviousModule = currentModuleIndex > 0;
  const hasNextModule = currentModuleIndex < sortedModules.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        <div className="flex items-center gap-2">
          <div className="text-sm">
            <div className="font-medium text-gray-900 dark:text-white">
              {selectedModule?.title || course.title}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              {enrollment.progress || 0}% Complete
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform lg:relative lg:translate-x-0 lg:w-64
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-full flex flex-col">
            {/* Sidebar header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-bold text-gray-900 dark:text-white">
                Course Content
              </h2>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    Progress
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {enrollment.progress || 0}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${enrollment.progress || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Modules list */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {sortedModules.map((module, index) => (
                  <div key={module._id} className="space-y-1">
                    <button
                      onClick={() => handleModuleSelect(module._id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
                        selectedModuleId === module._id
                          ? "bg-indigo-50 dark:bg-indigo-900/30"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {module.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDuration(module.duration || 0)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {completedModules.includes(module._id) ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Course info */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total: {formatDuration(totalDuration)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {sortedModules.length} modules
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Certificate available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Course header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Link
                    to="/dashboard/courses"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    My Courses
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <span>{selectedModule?.title || course.title}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedModule?.title || course.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {selectedModule?.description || course.description}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {enrollment.progress || 0}% Complete
                  </span>
                </div>
                {selectedModule &&
                  !completedModules.includes(selectedModule._id) && (
                    <button
                      onClick={() => handleMarkComplete(selectedModule._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4 mr-2 inline" />
                      Mark as Complete
                    </button>
                  )}
              </div>
            </div>
          </div>

          {/* Video/content area */}
          <div className="p-6">
            {selectedModule?.videoUrl ? (
              <div className="bg-black rounded-lg overflow-hidden mb-6 aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(selectedModule.videoUrl)}
                  title={`${selectedModule.title} - YouTube video player`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="bg-black rounded-lg aspect-video mb-6 flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-white opacity-50 mx-auto mb-4" />
                  <p className="text-white text-lg">No video available</p>
                  <p className="text-gray-400 mt-2">
                    This module doesn't have a video lesson
                  </p>
                </div>
              </div>
            )}

            {/* Lesson content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedModule?.title || "Select a Module"}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      {selectedModule
                        ? formatDuration(selectedModule.duration || 0)
                        : "Duration"}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Award className="h-4 w-4" />
                      {selectedModule &&
                      completedModules.includes(selectedModule._id)
                        ? "Completed"
                        : selectedModule
                        ? "In Progress"
                        : "Not Started"}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedModule?.videoUrl && (
                    <a
                      href={selectedModule.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      title="Open video in new tab"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                  )}
                  <button
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    title="Discussion"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                {selectedModule ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Module Description
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {selectedModule.description ||
                        "No description available."}
                    </p>

                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="text-blue-800 dark:text-blue-300 font-medium mb-2">
                        Learning Objectives
                      </h4>
                      <p className="text-blue-700 dark:text-blue-400">
                        Watch the video carefully and take notes. Try to
                        implement the concepts shown in the video.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Select a Module
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Choose a module from the sidebar to start learning
                    </p>
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="lg:hidden px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Open Course Modules
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              {selectedModule && (
                <div className="mt-8 flex justify-between items-center">
                  <div>
                    {hasPreviousModule && (
                      <button
                        onClick={() => {
                          const prevModule =
                            sortedModules[currentModuleIndex - 1];
                          handleModuleSelect(prevModule._id);
                        }}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        ← Previous Module
                      </button>
                    )}
                  </div>
                  <div className="flex gap-4">
                    {selectedModule &&
                      !completedModules.includes(selectedModule._id) && (
                        <button
                          onClick={() => handleMarkComplete(selectedModule._id)}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4 mr-2 inline" />
                          Mark as Complete
                        </button>
                      )}
                    {hasNextModule && (
                      <button
                        onClick={() => {
                          const nextModule =
                            sortedModules[currentModuleIndex + 1];
                          handleModuleSelect(nextModule._id);
                        }}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Next Module →
                      </button>
                    )}
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

export default CourseContent;
