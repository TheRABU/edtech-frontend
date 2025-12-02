import type { ICourse } from "@/types/course";
import { Clock, BookOpen, DollarSign } from "lucide-react";
import { Link } from "react-router";

const CourseCard = ({ ...props }: ICourse) => {
  const totalDuration = (props.modules ?? []).reduce(
    (total, module) => total + module.duration,
    0
  );

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      <Link to={`/courses/${props._id}`} className="block">
        <div className="relative overflow-hidden h-48">
          <img
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            src={
              props.thumbnail ||
              "https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            }
            alt={props.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="absolute top-3 right-3">
            <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              {props.category}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/courses/${props._id}`}>
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
            {props.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
          {props.description}
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span className="font-medium text-gray-700">
            By {props.instructor}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(totalDuration)}</span>
          </div>

          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{(props.modules ?? []).length} Modules</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">
              {props.price}
            </span>
          </div>

          <Link to={`/courses/${props._id}`}>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors duration-200">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
