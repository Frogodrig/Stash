import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

interface BlogCardProps {
  id: number;
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
}

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) => {
  const strippedContent = content
    .replace(/<\/?(p|h1|h2|span|a|br|div|strong|em|u)[^>]*>/gi, " ") // Replace <p>, <h1>, <h2>, <span> with spaces
    .replace(/\s+/g, " ") // Normalize multiple spaces to a single space
    .trim(); // Trim any leading/trailing spaces

  return (
    <Link to={`/blog/${id}`}>
      <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer">
        <div className="flex">
          <Avatar size="small" name={authorName} />
          <div className="flex justify-center flex-col font-extralight pl-2 text-sm">
            {authorName.toUpperCase()}{" "}
          </div>
          <div className="flex justify-center flex-col pl-2">
            <Circle />
          </div>
          <div className="flex justify-center flex-col pl-2 font-thin text-slate-500 text-sm">
            {publishedDate}
          </div>
        </div>
        <div className="text-xl font-semibold pt-2">{title}</div>
        <div className="text-md font-thin">
          {strippedContent.slice(0, 100) + "..."}
        </div>
        <div className="text-slate-500 text-sm font-thin pt-4">
          {`${Math.ceil(content.length / 100)} minute read`}
        </div>
      </div>
    </Link>
  );
};

function Circle() {
  return <div className="h-1 w-1 rounded-full bg-slate-500"></div>;
}

export function Avatar({
  name,
  size = "small",
}: {
  name: string;
  size: "small" | "big";
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${
        size === "small" ? "w-6 h-6" : "w-10 h-10"
      }`}
    >
      <span
        className={`${
          size === "small" ? "text-xs" : "text-md"
        } font-thin text-gray-600 dark:text-gray-300`}
      >
        {name[0].toUpperCase()}
      </span>
    </div>
  );
}
