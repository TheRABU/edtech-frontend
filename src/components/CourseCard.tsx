import type { ICourse } from "@/types/course";
import { Trash2, Edit, Eye } from "lucide-react";
import { Link } from "react-router";

interface CourseCardProps extends ICourse {
  onDelete?: (courseId: string) => void;
  isAdminView?: boolean;
}

const CourseCard = ({
  _id,
  title,
  description,
  thumbnail,
  price,
  category,
  isDeleted,
  modules = [],
  batches = [],
  onDelete,
  isAdminView = false,
}: CourseCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (_id && onDelete) {
      onDelete(_id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Course Image */}
      <div className="h-48 bg-gray-200 relative">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No thumbnail</span>
          </div>
        )}

        <div className="absolute top-2 right-2">
          <span className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full">
            ${price}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 text-lg truncate">{title}</h3>
          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
            {category}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{modules.length} modules</span>
          <span>{batches.length} batches</span>
        </div>
      </div>

      {/* Action Buttons - Always visible */}
      <div className="px-4 pb-4 pt-0">
        <div className="flex gap-2">
          {/* View Details Button - Goes to course details page */}
          <Link
            to={`/courses/${_id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Link>

          {/* Update Button - Only shown in admin view, goes to edit page */}
          {isAdminView && (
            <Link
              to={`/admin/courses/edit/${_id}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              title="Edit Course"
            >
              <Edit className="h-4 w-4" />
              Update
            </Link>
          )}

          {/* Delete Button - Only shown in admin view for active courses */}
          {isAdminView && onDelete && !isDeleted && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              title="Delete Course"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
